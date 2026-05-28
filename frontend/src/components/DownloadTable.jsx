function formatBytes(bytes) {
  if (bytes === undefined || bytes === null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileLabel(item) {
  if (item.file) {
    const parts = item.file.split(/[\\/]/);
    return parts[parts.length - 1];
  }
  return item.url || "—";
}

const statusStyles = {
  success: "text-green-400",
  duplicate: "text-yellow-400",
  failed: "text-red-400",
  error: "text-red-400",
};

function DownloadTable({ results = [] }) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto">

      <table className="w-full min-w-[480px]">

        <thead className="bg-slate-800">

          <tr>
            <th className="text-left p-4">File</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Size</th>
          </tr>

        </thead>

        <tbody>

          {results.length === 0 ? (

            <tr className="border-t border-slate-800">
              <td colSpan={3} className="p-6 text-center text-slate-500">
                No downloads yet. Upload an Excel file to begin.
              </td>
            </tr>

          ) : (

            results.map((item, i) => (
              <tr key={i} className="border-t border-slate-800">

                <td className="p-4 max-w-[280px] truncate">
                  {fileLabel(item)}
                </td>

                <td className={`p-4 capitalize ${statusStyles[item.status] || "text-slate-300"}`}>
                  {item.status}
                </td>

                <td className="p-4">
                  {formatBytes(item.size)}
                </td>

              </tr>
            ))

          )}

        </tbody>

      </table>

    </div>
  );
}

export default DownloadTable;
