import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaFileAlt,
  FaHistory,
  FaCog,
  FaTimes,
  FaImages,
  FaRegLightbulb
} from "react-icons/fa";

const links = [
  { to: "/", label: "Dashboard", icon: FaHome },
  { to: "/how-it-works", label: "How It Works", icon: FaRegLightbulb },
  { to: "/reports", label: "Reports", icon: FaFileAlt },
  { to: "/history", label: "History", icon: FaHistory },
  { to: "/settings", label: "Settings", icon: FaCog },
];

function Sidebar({ open, onClose }) {
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col transform transition-transform duration-200 ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >

      <div className="flex items-center justify-between p-5 border-b border-slate-800">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shrink-0">
            <FaImages className="text-white text-lg" />
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-bold text-white">
              Bulk Image
            </h1>
            <p className="text-xs text-cyan-400 font-medium tracking-wide">
              DOWNLOAD
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close menu"
          className="lg:hidden text-slate-400 hover:text-white"
        >
          <FaTimes />
        </button>

      </div>

      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">

        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                  : "hover:bg-slate-800 text-slate-300"
              }`
            }
          >
            <Icon className="shrink-0" />
            {label}
          </NavLink>
        ))}

      </nav>

      <div className="p-4 border-t border-slate-800">
        <p className="text-[11px] uppercase tracking-wider text-slate-500">
          Tool Created By
        </p>
        <p className="text-sm font-semibold text-cyan-400">
          Sugandh K Mishra
        </p>
      </div>

    </aside>
  );
}

export default Sidebar;
