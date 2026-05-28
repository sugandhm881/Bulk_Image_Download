VALID_EXTENSIONS = (
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp"
)

def is_valid_image_url(url):

    lower_url = url.lower()

    return any(
        ext in lower_url
        for ext in VALID_EXTENSIONS
    )