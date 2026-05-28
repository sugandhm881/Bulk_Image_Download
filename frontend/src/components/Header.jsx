import { FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const titles = {
  "/": "Dashboard",
  "/how-it-works": "How It Works",
  "/reports": "Reports",
  "/history": "History",
  "/settings": "Settings",
};

function Header({ onMenuClick }) {

  const { pathname } = useLocation();
  const title = titles[pathname] || "Dashboard";

  return (
    <header className="h-16 sm:h-20 border-b border-slate-800 flex items-center justify-between px-4 sm:px-6 bg-slate-900 gap-3">

      <div className="flex items-center gap-3 min-w-0">

        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="lg:hidden text-slate-300 hover:text-white text-xl shrink-0"
        >
          <FaBars />
        </button>

        <h2 className="text-lg sm:text-2xl font-semibold truncate">
          {title}
        </h2>

      </div>

      <div className="flex items-center gap-3 sm:gap-4 shrink-0">

        <input
          type="text"
          placeholder="Search..."
          className="hidden sm:block bg-slate-800 px-4 py-2 rounded-lg outline-none w-32 md:w-56"
        />

        <div
          title="Sugandh K Mishra"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0"
        >
          SM
        </div>

      </div>

    </header>
  );
}

export default Header;
