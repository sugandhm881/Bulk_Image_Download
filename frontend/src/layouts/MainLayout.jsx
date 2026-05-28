import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function MainLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-slate-950 min-h-screen text-white">

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">

        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 sm:p-6 flex-1">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default MainLayout;
