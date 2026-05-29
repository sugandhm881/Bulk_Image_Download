import csv
import io


def summarize(results):

    success = sum(1 for r in results if r.get("status") == "success")
    duplicates = sum(1 for r in results if r.get("status") == "duplicate")
    failed = sum(
        1 for r in results
        if r.get("status") not in ("success", "duplicate")
    )

    return {
        "total": len(results),
        "success": success,
        "failed": failed,
        "duplicates": duplicates,
    }


def build_report_csv(results):

    out = io.StringIO()
    writer = csv.writer(out)

    writer.writerow(["status", "file_or_url", "size"])

    for r in results:
        writer.writerow([
            r.get("status", ""),
            r.get("file") or r.get("url", ""),
            r.get("size", ""),
        ])

    return out.getvalue()
