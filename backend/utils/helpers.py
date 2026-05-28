import os
import hashlib
from urllib.parse import urlparse

def generate_file_hash(text):
    return hashlib.md5(
        text.encode()
    ).hexdigest()


def get_filename_from_url(url):

    parsed = urlparse(url)

    filename = os.path.basename(
        parsed.path
    )

    if not filename:
        filename = "image.jpg"

    return filename