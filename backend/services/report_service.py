import os
import pandas as pd
from datetime import datetime

def generate_download_report(results, output_dir="reports"):

    success = []
    failed = []
    duplicates = []

    for item in results:

        status = item.get("status")

        if status == "success":
            success.append(item)

        elif status == "duplicate":
            duplicates.append(item)

        else:
            failed.append(item)

    report = {
        "total": len(results),
        "success": len(success),
        "failed": len(failed),
        "duplicates": len(duplicates)
    }

    timestamp = datetime.now().strftime(
        "%Y%m%d_%H%M%S"
    )

    os.makedirs(output_dir, exist_ok=True)

    report_path = os.path.join(
        output_dir,
        f"report_{timestamp}.xlsx"
    )

    with pd.ExcelWriter(report_path) as writer:

        pd.DataFrame(success).to_excel(
            writer,
            sheet_name="Success",
            index=False
        )

        pd.DataFrame(failed).to_excel(
            writer,
            sheet_name="Failed",
            index=False
        )

        pd.DataFrame(duplicates).to_excel(
            writer,
            sheet_name="Duplicates",
            index=False
        )

    return report, report_path