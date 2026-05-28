import aiohttp
import aiofiles
import os
import asyncio

from utils.helpers import (
    get_filename_from_url
)

from utils.file_manager import (
    create_folder,
    file_exists
)

async def download_image(
    session,
    url,
    save_folder,
    user_name,
    date_str,
    counter,
    total=1
):

    try:

        create_folder(save_folder)

        original_filename = get_filename_from_url(url)

        extension = os.path.splitext(
            original_filename
        )[1]

        if not extension:
            extension = ".jpg"

        # Single image for this user + date -> no numeric suffix.
        # Multiple images -> Bill_<name>_<date>_1, _2, ...
        if total > 1:
            filename = (
                f"Bill_{user_name}_{date_str}_{counter}{extension}"
            )
        else:
            filename = (
                f"Bill_{user_name}_{date_str}{extension}"
            )

        save_path = os.path.join(
            save_folder,
            filename
        )

        if file_exists(save_path):

            return {
                "status": "duplicate",
                "file": save_path
            }

        retries = 3

        for attempt in range(retries):

            try:

                async with session.get(
                    url,
                    timeout=30
                ) as response:

                    if response.status == 200:

                        content = await response.read()

                        async with aiofiles.open(
                            save_path,
                            "wb"
                        ) as f:

                            await f.write(content)

                        return {
                            "status": "success",
                            "file": save_path,
                            "size": len(content)
                        }

            except Exception:

                await asyncio.sleep(1)

        return {
            "status": "failed",
            "url": url
        }

    except Exception as e:

        return {
            "status": "error",
            "url": url,
            "error": str(e)
        }