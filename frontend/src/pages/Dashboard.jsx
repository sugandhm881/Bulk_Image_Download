import { useState } from "react";
import {
  FaDownload,
  FaLink,
  FaCheckCircle,
  FaTimesCircle,
  FaCopy
} from "react-icons/fa";
import UploadBox from "../components/UploadBox";
import StatsCard from "../components/StatsCard";
import ProgressCard from "../components/ProgressCard";
import DownloadTable from "../components/DownloadTable";
import API from "../services/api";

function Dashboard() {

  const [summary, setSummary] = useState(null);
  const [results, setResults] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [progress, setProgress] = useState(null);

  const handleStart = (total) => {
    setDownloadUrl(null);
    setResults([]);
    setSummary({ total, success: 0, failed: 0, duplicates: 0 });
    setProgress({ done: 0, total, speed_bps: 0, file: "", active: true });
  };

  const handleProgress = (m) => {
    setSummary({
      total: m.total,
      success: m.success,
      failed: m.failed,
      duplicates: m.duplicates,
    });
    setProgress({
      done: m.done,
      total: m.total,
      speed_bps: m.speed_bps,
      file: m.file,
      active: true,
    });
  };

  const handleComplete = (data) => {
    setSummary(data.summary || null);
    setResults(data.results || []);
    setDownloadUrl(data.download_url || null);
    setProgress((p) => (p ? { ...p, active: false } : null));
  };

  return (
    <>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">

        <StatsCard title="Total URLs" value={summary ? summary.total : 0} icon={FaLink} accent="cyan" />
        <StatsCard title="Downloaded" value={summary ? summary.success : 0} icon={FaCheckCircle} accent="green" />
        <StatsCard title="Failed" value={summary ? summary.failed : 0} icon={FaTimesCircle} accent="red" />
        <StatsCard title="Duplicates" value={summary ? summary.duplicates : 0} icon={FaCopy} accent="yellow" />

      </div>

      <UploadBox
        onStart={handleStart}
        onProgress={handleProgress}
        onComplete={handleComplete}
      />

      {progress && (
        <div className="mt-6">
          <ProgressCard {...progress} />
        </div>
      )}

      {downloadUrl && (
        <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-green-400">Your images are ready</p>
            <p className="text-slate-400 text-sm">Bundled into a single ZIP, including the summary report.</p>
          </div>
          <a
            href={`${API.defaults.baseURL}${downloadUrl}`}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition-colors shrink-0"
          >
            <FaDownload />
            Download ZIP
          </a>
        </div>
      )}

      <div className="mt-6">
        <DownloadTable results={results} />
      </div>

    </>
  );
}

export default Dashboard;
