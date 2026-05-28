from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException
)
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse
from starlette.background import BackgroundTask

import shutil
import os
import re
import json
import time
import uuid
import tempfile
import aiohttp
import asyncio
from collections import defaultdict
from datetime import datetime
import pandas as pd

from services.excel_service import (
    extract_urls_from_text
)

from services.download_service import (
    download_image
)

from services.report_service import (
    generate_download_report
)

router = APIRouter()

# Temp working areas only — nothing persists in the project folder.
UPLOAD_FOLDER = tempfile.mkdtemp(prefix="bid_upload_")
ZIP_FOLDER = tempfile.mkdtemp(prefix="bid_zips_")


@router.post("/upload-excel")
async def upload_excel(
    file: UploadFile = File(...)
):

    # ====================================
    # SAVE + PARSE EXCEL (temp, deleted after read)
    # ====================================

    safe_name = os.path.basename(
        file.filename or "upload.xlsx"
    )

    upload_path = os.path.join(
        UPLOAD_FOLDER,
        safe_name
    )

    with open(upload_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        df = pd.read_excel(upload_path)
    except Exception as e:
        return JSONResponse(
            {"status": "error", "message": f"Could not read Excel: {e}"},
            status_code=400
        )
    finally:
        if os.path.exists(upload_path):
            os.remove(upload_path)

    # ====================================
    # BUILD DOWNLOAD SPECS (folders under a temp batch dir)
    # ====================================

    batch_dir = tempfile.mkdtemp(prefix="bid_batch_")

    specs = []
    pre_errors = []
    processed_urls = set()

    for index, row in df.iterrows():

        try:

            user_name = str(
                row.get("user_name", f"user_{index}")
            ).strip()

            date_str = datetime.now().strftime("%d-%m-%Y")

            if "bill_date" in row:
                try:
                    bill_date = pd.to_datetime(row["bill_date"])
                    date_str = bill_date.strftime("%d-%m-%Y")
                    month_folder = bill_date.strftime("%B-%Y")
                except:
                    month_folder = datetime.now().strftime("%B-%Y")
            else:
                month_folder = datetime.now().strftime("%B-%Y")

            month_subfolder = os.path.join(
                batch_dir,
                user_name,
                month_folder
            )

            os.makedirs(month_subfolder, exist_ok=True)

            for column in df.columns:

                urls = extract_urls_from_text(row[column])

                for url in urls:

                    if url in processed_urls:
                        continue

                    processed_urls.add(url)

                    specs.append({
                        "url": url,
                        "folder": month_subfolder,
                        "user_name": user_name,
                        "date_str": date_str,
                    })

        except Exception as e:
            pre_errors.append({"status": "error", "error": str(e)})

    # ====================================
    # NAMING: number only when a user+date has more than one image
    # (single -> Bill_<name>_<date>, multiple -> Bill_<name>_<date>_1, _2, ...)
    # ====================================

    group_total = defaultdict(int)
    for s in specs:
        group_total[(s["user_name"], s["date_str"])] += 1

    group_seen = defaultdict(int)
    for s in specs:
        key = (s["user_name"], s["date_str"])
        group_seen[key] += 1
        s["counter"] = group_seen[key]
        s["total"] = group_total[key]

    # ====================================
    # STREAM PROGRESS AS EACH DOWNLOAD COMPLETES
    # ====================================

    async def event_stream():

        results = list(pre_errors)

        total = len(specs)
        done = 0
        success = 0
        failed = 0
        duplicates = 0
        total_bytes = 0
        start = time.monotonic()

        yield json.dumps({"type": "start", "total": total}) + "\n"

        connector = aiohttp.TCPConnector(limit=50)
        timeout = aiohttp.ClientTimeout(total=60)

        async with aiohttp.ClientSession(
            connector=connector,
            timeout=timeout
        ) as session:

            tasks = [
                asyncio.create_task(
                    download_image(
                        session,
                        s["url"],
                        s["folder"],
                        s["user_name"],
                        s["date_str"],
                        s["counter"],
                        s["total"]
                    )
                )
                for s in specs
            ]

            for fut in asyncio.as_completed(tasks):

                res = await fut
                results.append(res)
                done += 1

                status = res.get("status")

                if status == "success":
                    success += 1
                    total_bytes += res.get("size", 0)
                elif status == "duplicate":
                    duplicates += 1
                else:
                    failed += 1

                elapsed = time.monotonic() - start
                speed_bps = total_bytes / elapsed if elapsed > 0 else 0

                yield json.dumps({
                    "type": "progress",
                    "done": done,
                    "total": total,
                    "success": success,
                    "failed": failed,
                    "duplicates": duplicates,
                    "speed_bps": speed_bps,
                    "file": res.get("file") or res.get("url", ""),
                }) + "\n"

        # ====================================
        # REPORT + ZIP, THEN CLEAN UP
        # ====================================

        report, _ = generate_download_report(
            results,
            output_dir=batch_dir
        )

        download_url = None
        saved = report["success"] + report["duplicates"]

        if saved > 0:
            token = uuid.uuid4().hex
            shutil.make_archive(
                os.path.join(ZIP_FOLDER, token),
                "zip",
                batch_dir
            )
            download_url = f"/download/{token}"

        shutil.rmtree(batch_dir, ignore_errors=True)

        yield json.dumps({
            "type": "done",
            "message": "Download Completed Successfully",
            "summary": report,
            "download_url": download_url,
            "results": results,
        }) + "\n"

    return StreamingResponse(
        event_stream(),
        media_type="application/x-ndjson"
    )


@router.get("/download/{token}")
def download_zip(token: str):

    if not re.fullmatch(r"[a-f0-9]+", token):
        raise HTTPException(
            status_code=400,
            detail="Invalid token"
        )

    zip_path = os.path.join(
        ZIP_FOLDER,
        f"{token}.zip"
    )

    if not os.path.exists(zip_path):
        raise HTTPException(
            status_code=404,
            detail="File not found or already downloaded"
        )

    filename = (
        f"images_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"
    )

    return FileResponse(
        zip_path,
        media_type="application/zip",
        filename=filename,
        background=BackgroundTask(os.remove, zip_path)
    )
