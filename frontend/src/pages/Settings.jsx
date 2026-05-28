import { FaCog } from "react-icons/fa";

function Settings() {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 sm:p-12 flex flex-col items-center text-center">

      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4">
        <FaCog className="text-cyan-400 text-xl" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mb-2">
        Settings
      </h2>

      <p className="text-slate-400 text-sm sm:text-base max-w-md">
        App preferences and download options will appear here.
      </p>

    </div>
  );
}

export default Settings;
