import pandas as pd
import re

VALID_EXTENSIONS = (
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp"
)

def extract_urls_from_text(text):

    if pd.isna(text):
        return []

    text = str(text)

    pattern = r'https?://[^\s,"\']+'

    matches = re.findall(pattern, text)

    valid_urls = []

    for url in matches:

        lower_url = url.lower()

        if any(ext in lower_url for ext in VALID_EXTENSIONS):
            valid_urls.append(url)

    return valid_urls


def process_excel_file(file_path):

    df = pd.read_excel(file_path)

    extracted_data = []

    for index, row in df.iterrows():

        user_name = str(
            row.get("user_name", f"user_{index}")
        ).strip()

        row_urls = []

        for column in df.columns:

            cell_value = row[column]

            urls = extract_urls_from_text(cell_value)

            row_urls.extend(urls)

        extracted_data.append({
            "user_name": user_name,
            "urls": row_urls
        })

    return extracted_data