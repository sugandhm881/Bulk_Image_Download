import { FaSpinner, FaCheckCircle } from "react-icons/fa";

function formatSpeed(bps) {
  if (!bps) return "0 KB/s";
  const mbps = bps / (1024 * 1024);
  if (mbps >= 1) return `${mbps.toFixed(2)} MB/s`;
  return `${(bps / 1024).toFixed(0)} KB/s`;
}

function baseName(path) {
  if (!path) return "";
  return path.split(/[\\/]/).pop();
}

function ProgressCard({ done, total, speed_bps, file, active }) {

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-6">

      <div className="flex items-center justify-between mb-3">

        <div className="flex items-center gap-2 font-semibold">
          {active ? (
            <FaSpinner className="animate-spin text-cyan-400" />
          ) : (
            <FaCheckCircle className="text-green-400" />
          )}
          {active ? "Downloading images..." : "Completed"}
        </div>

        <span className="text-cyan-400 font-bold">{pct}%</span>

      </div>

      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-slate-400">
          {done} of {total} files
        </span>
        <span className="text-cyan-400 font-medium">
          {formatSpeed(speed_bps)}
        </span>
      </div>

      {active && file && (
        <p className="mt-2 text-xs text-slate-500 truncate">
          Last: {baseName(file)}
        </p>
      )}

    </div>
  );
}

export default ProgressCard;
