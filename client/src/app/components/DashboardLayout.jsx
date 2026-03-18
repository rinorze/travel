import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";
import DashboardSidebar from "./DashboardSidebar.jsx";

export default function DashboardLayout() {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="px-4 sm:px-6 lg:px-8 py-10">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar className="hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto" />

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute inset-0 bg-black/30"
          />
          <DashboardSidebar
            className="absolute left-0 top-0 h-full w-72 shadow-xl overflow-y-auto"
            onNavigate={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 h-14 bg-white/80 backdrop-blur border-b border-gray-200">
          <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="text-sm font-semibold text-gray-900">
                Dashboard
              </div>
            </div>

            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              View site
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
