import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  MapPin,
  Shield,
  UserCircle,
} from "lucide-react";
import { useAuth } from "../lib/AuthContext.jsx";

function getActiveTab(search, isAdmin) {
  const tab = new URLSearchParams(search).get("tab");
  if (tab === "profile") return "profile";
  if (tab === "bookings") return "bookings";
  if (tab === "overview") return "overview";
  if (tab === "destinations" && isAdmin) return "destinations";
  return isAdmin ? "destinations" : "overview";
}

export default function DashboardSidebar({ className = "", onNavigate }) {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const activeTab = getActiveTab(location.search, isAdmin);

  const items = [
    { key: "overview", label: "Overview", icon: LayoutDashboard },
    ...(isAdmin
      ? [{ key: "destinations", label: "Destinations", icon: MapPin }]
      : []),
    { key: "bookings", label: "Bookings", icon: CalendarCheck },
    { key: "profile", label: "Profile", icon: UserCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    onNavigate?.();
  };

  return (
    <aside
      className={`w-64 shrink-0 border-r border-gray-200 bg-white flex flex-col h-full ${className}`}
    >
      <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between">
        <Link
          to="/dashboard"
          onClick={() => onNavigate?.()}
          className="font-semibold text-gray-900"
        >
          Travel Admin
        </Link>
        {isAdmin && (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-[11px] font-medium rounded-full">
            <Shield className="w-3.5 h-3.5" />
            Admin
          </span>
        )}
      </div>

      <nav className="p-2 space-y-1">
        {items.map((item) => {
          const isActive = activeTab === item.key;
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              to={`/dashboard?tab=${item.key}`}
              onClick={() => onNavigate?.()}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-4 border-t border-gray-200">
        <div className="text-sm font-semibold text-gray-900 truncate">
          {user.name}
        </div>
        <div className="text-xs text-gray-500 truncate">{user.email}</div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
