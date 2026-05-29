import { useState, useRef } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { FaFileExcel, FaUpload, FaTimes } from "react-icons/fa";

function UploadBox({ onComplete }) {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {

      setLoading(true);

      const res = await fetch(
        `${API.defaults.baseURL}/upload-excel`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        let msg = "Upload Failed";
        try {
          const j = await res.json();
          if (j.message) msg = j.message;
        } catch {
          // response was not JSON
        }
        throw new Error(msg);
      }

      const summaryHeader = res.headers.get("X-Summary");
      const summary = summaryHeader ? JSON.parse(summaryHeader) : null;

      const dispo = res.headers.get("Content-Disposition") || "";
      const match = dispo.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : "images.zip";

      const blob = await res.blob();

      if (onComplete) onComplete({ summary, blob, filename });

      toast.success("Download Completed Successfully");

      clearFile();

    } catch (error) {

      console.error(error);
      toast.error(error.message || "Upload Failed");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="border-2 border-dashed border-cyan-500 rounded-2xl p-6 sm:p-10 bg-slate-900 text-center">

      <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
        Upload Excel File
      </h2>

      <p className="text-slate-400 mb-5 text-sm sm:text-base">
        Upload Excel file containing image URLs
      </p>

      <input
        ref={inputRef}
        id="excel-input"
        type="file"
        accept=".xlsx"
        onChange={handleSelect}
        className="hidden"
        disabled={loading}
      />

      {!file ? (

        <label
          htmlFor="excel-input"
          className="inline-flex items-center gap-2 cursor-pointer bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-lg transition-colors"
        >
          <FaFileExcel className="text-green-400" />
          Choose Excel File
        </label>

      ) : (

        <div className="flex flex-col items-center gap-4">

          <div className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-lg max-w-full">

            <FaFileExcel className="text-green-400 shrink-0" />

            <span className="truncate">
              {file.name}
            </span>

            <span className="text-slate-400 text-sm shrink-0">
              {(file.size / 1024).toFixed(1)} KB
            </span>

            {!loading && (
              <button
                onClick={clearFile}
                aria-label="Remove file"
                className="text-slate-400 hover:text-red-400 shrink-0"
              >
                <FaTimes />
              </button>
            )}

          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <FaUpload />
            {loading ? "Processing..." : "Upload & Download"}
          </button>

        </div>

      )}

    </div>
  );
}

export default UploadBox;
