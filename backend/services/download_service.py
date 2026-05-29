import os
import asyncio

from utils.helpers import (
    get_filename_from_url
)


async def download_image(session, spec):
    """Fetch one image and return its bytes in-memory (no disk writes).

    spec = {url, user, date, month, counter, total}
    Returns a result dict; on success it carries the bytes under "_content".
    """

    url = spec["url"]

    try:

        original_filename = get_filename_from_url(url)

        extension = os.path.splitext(original_filename)[1]

        if not extension:
            extension = ".jpg"

        # Single image for this user + date -> no numeric suffix.
        # Multiple images -> Bill_<name>_<date>_1, _2, ...
        if spec["total"] > 1:
            filename = f"Bill_{spec['user']}_{spec['date']}_{spec['counter']}{extension}"
        else:
            filename = f"Bill_{spec['user']}_{spec['date']}{extension}"

        # Forward slashes so the structure is preserved inside the zip.
        arcname = f"{spec['user']}/{spec['month']}/{filename}"

        for _ in range(3):

            try:

                async with session.get(url, timeout=20) as response:

                    if response.status == 200:

                        content = await response.read()

                        return {
                            "status": "success",
                            "file": arcname,
                            "size": len(content),
                            "_content": content,
                        }

            except Exception:

                await asyncio.sleep(0.5)

        return {
            "status": "failed",
            "url": url,
        }

    except Exception as e:

        return {
            "status": "error",
            "url": url,
            "error": str(e),
        }
