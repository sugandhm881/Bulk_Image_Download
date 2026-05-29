from fastapi import APIRouter, UploadFile, File
from fastapi.responses import JSONResponse

import base64
import io
import zipfile
import asyncio
import aiohttp
from collections import defaultdict
from datetime import datetime

from services.excel_service import (
    extract_urls_from_text,
    read_rows,
)

from services.download_service import (
    download_image
)

from services.report_service import (
    summarize,
    build_report_csv,
)

router = APIRouter()


def parse_date(value):

    if isinstance(value, datetime):
        return value

    if value is None:
        return None

    for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y", "%m/%d/%Y", "%Y/%m/%d"):
        try:
            return datetime.strptime(str(value).strip(), fmt)
        except Exception:
            continue

    return None


@router.post("/upload-excel")
async def upload_excel(file: UploadFile = File(...)):

    # ====================================
    # READ EXCEL (in-memory)
    # ====================================

    try:
        file_bytes = await file.read()
        headers, rows = read_rows(file_bytes)
    except Exception as e:
        return JSONResponse(
            {"status": "error", "message": f"Could not read Excel: {e}"},
            status_code=400,
        )

    # ====================================
    # BUILD DOWNLOAD SPECS
    # ====================================

    specs = []
    pre_errors = []
    processed_urls = set()

    for index, row in enumerate(rows):

        try:

            user_name = str(row.get("user_name") or f"user_{index}").strip()
            if not user_name:
                user_name = f"user_{index}"

            now = datetime.now()
            date_str = now.strftime("%d-%m-%Y")
            month_folder = now.strftime("%B-%Y")

            bill_date = parse_date(row.get("bill_date")) if "bill_date" in row else None
            if bill_date:
                date_str = bill_date.strftime("%d-%m-%Y")
                month_folder = bill_date.strftime("%B-%Y")

            for header in headers:
                for url in extract_urls_from_text(row.get(header)):
                    if url in processed_urls:
                        continue
                    processed_urls.add(url)
                    specs.append({
                        "url": url,
                        "user": user_name,
                        "date": date_str,
                        "month": month_folder,
                    })

        except Exception as e:
            pre_errors.append({"status": "error", "error": str(e)})

    # ====================================
    # NAMING: number only when a user+date has more than one image
    # ====================================

    group_total = defaultdict(int)
    for s in specs:
        group_total[(s["user"], s["date"])] += 1

    group_seen = defaultdict(int)
    for s in specs:
        key = (s["user"], s["date"])
        group_seen[key] += 1
        s["counter"] = group_seen[key]
        s["total"] = group_total[key]

    # ====================================
    # DOWNLOAD (concurrent, in-memory)
    # ====================================

    results = list(pre_errors)
    contents = []

    connector = aiohttp.TCPConnector(limit=30)
    timeout = aiohttp.ClientTimeout(total=25)

    async with aiohttp.ClientSession(
        connector=connector,
        timeout=timeout,
    ) as session:

        tasks = [
            asyncio.create_task(download_image(session, s))
            for s in specs
        ]

        for fut in asyncio.as_completed(tasks):
            res = await fut
            content = res.pop("_content", None)
            if content is not None:
                contents.append((res["file"], content))
            results.append(res)

    # ====================================
    # ZIP IN MEMORY + REPORT
    # ====================================

    summary = summarize(results)

    zip_b64 = None
    filename = f"images_{datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"

    if contents:
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
            for arcname, data in contents:
                zf.writestr(arcname, data)
            zf.writestr("report.csv", build_report_csv(results))
        zip_b64 = base64.b64encode(buf.getvalue()).decode("ascii")

    return {
        "message": "Download Completed Successfully",
        "summary": summary,
        "results": results,
        "filename": filename,
        "zip_base64": zip_b64,
    }
