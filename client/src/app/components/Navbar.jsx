import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import {
  Menu,
  X,
  LogOut,
  MapPin,
  CalendarCheck,
  LayoutDashboard,
  UserCircle,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/destinations", label: "Destinations", icon: MapPin },
  ];

  if (user) {
    navLinks.push({
      to: "/my-bookings",
      label: "My Bookings",
      icon: CalendarCheck,
    });
    navLinks.push({
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#ded7cc] bg-[#fffdf9]/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#1f2933] hover:text-[#4d6554] transition-colors shrink-0"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full border border-[#1f2933] text-xs font-bold">
              T
            </span>
            <span className="text-lg font-semibold tracking-tight">Travel</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive(link.to)
                    ? "text-[#1f2933]"
                    : "text-[#7a756b] hover:text-[#1f2933]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/dashboard?tab=profile"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    isActive("/dashboard")
                      ? "bg-[#ebe5d9] text-[#1f2933]"
                      : "text-[#5f665d] hover:bg-[#f0ebe2]"
                  }`}
                >
                  <UserCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#6f6a61] hover:text-[#1f2933] hover:bg-[#f0ebe2] rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-[#5f665d] hover:text-[#1f2933] transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="button-primary px-4 py-2"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[#5f665d] hover:text-[#1f2933] cursor-pointer"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#ded7cc] bg-[#fffdf9]">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "text-[#1f2933] bg-[#ebe5d9]"
                    : "text-[#5f665d] hover:bg-[#f0ebe2]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#ded7cc]">
              {user ? (
                <div className="space-y-1">
                  <Link
                    to="/dashboard?tab=profile"
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive("/dashboard")
                        ? "text-blue-600 bg-blue-50"
                        : "text-[#5f665d] hover:bg-[#f0ebe2]"
                    }`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-[#5f665d] hover:bg-[#f0ebe2] cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#5f665d] hover:bg-[#f0ebe2]"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm font-medium text-white bg-[#1f2933] text-center"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
