import { useState, useRef } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { FaFileExcel, FaUpload, FaTimes } from "react-icons/fa";

function UploadBox({ onStart, onProgress, onComplete }) {

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

  const handleMessage = (msg) => {
    if (msg.type === "start") {
      if (onStart) onStart(msg.total);
    } else if (msg.type === "progress") {
      if (onProgress) onProgress(msg);
    } else if (msg.type === "done") {
      if (onComplete) onComplete(msg);
      toast.success(msg.message || "Download Completed Successfully");
      clearFile();
    }
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

      if (!res.ok || !res.body) {
        throw new Error(`Server error ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {

        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let idx;
        while ((idx = buffer.indexOf("\n")) >= 0) {

          const line = buffer.slice(0, idx).trim();
          buffer = buffer.slice(idx + 1);

          if (!line) continue;

          let msg;
          try {
            msg = JSON.parse(line);
          } catch {
            continue;
          }

          handleMessage(msg);
        }
      }

    } catch (error) {

      console.error(error);
      toast.error("Upload Failed");

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
        accept=".xlsx,.xls"
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
