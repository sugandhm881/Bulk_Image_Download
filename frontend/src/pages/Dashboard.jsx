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
import DownloadTable from "../components/DownloadTable";

function Dashboard() {

  const [summary, setSummary] = useState(null);
  const [results, setResults] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [filename, setFilename] = useState("images.zip");

  const handleComplete = ({ summary, blob, filename }) => {
    setSummary(summary || null);
    setResults([]);

    if (downloadUrl) URL.revokeObjectURL(downloadUrl);

    if (blob && blob.size > 0) {
      setDownloadUrl(URL.createObjectURL(blob));
      setFilename(filename || "images.zip");
    } else {
      setDownloadUrl(null);
    }
  };

  return (
    <>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">

        <StatsCard title="Total URLs" value={summary ? summary.total : 0} icon={FaLink} accent="cyan" />
        <StatsCard title="Downloaded" value={summary ? summary.success : 0} icon={FaCheckCircle} accent="green" />
        <StatsCard title="Failed" value={summary ? summary.failed : 0} icon={FaTimesCircle} accent="red" />
        <StatsCard title="Duplicates" value={summary ? summary.duplicates : 0} icon={FaCopy} accent="yellow" />

      </div>

      <UploadBox onComplete={handleComplete} />

      {downloadUrl && (
        <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-semibold text-green-400">Your images are ready</p>
            <p className="text-slate-400 text-sm">Bundled into a single ZIP, including a report.csv.</p>
          </div>
          <a
            href={downloadUrl}
            download={filename}
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
