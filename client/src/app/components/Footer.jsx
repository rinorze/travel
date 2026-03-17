import { Link } from "react-router-dom";
import { Compass, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-gray-900 mb-3">
              <Compass className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-semibold tracking-tight">
                Travel
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              Discover extraordinary destinations and craft unforgettable travel
              experiences. Your next adventure starts here.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Explore
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/destinations"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations?category=beach"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Beaches
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations?category=mountain"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Mountains
                </Link>
              </li>
              <li>
                <Link
                  to="/destinations?category=cultural"
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Cultural
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-gray-500">About</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Contact</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Travel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
