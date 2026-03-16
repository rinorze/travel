import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Users,
  Shield,
  Star,
  Globe,
  Sparkles,
} from "lucide-react";
import { listDestinations, seedDestinations } from "../lib/api.js";
import DestinationCard from "../components/DestinationCard.jsx";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Seed destinations once per session if needed
        const seeded = sessionStorage.getItem("destinations_seeded");
        if (!seeded) {
          try {
            await seedDestinations();
          } catch (e) {
            // Already seeded or unavailable, ignore
          }
          sessionStorage.setItem("destinations_seeded", "true");
        }

        const data = await listDestinations({ featured: "true" });
        setFeatured(data.destinations.slice(0, 6));
      } catch (err) {
        console.error("Failed to load destinations:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = [
    { icon: Globe, value: "50+", label: "Destinations" },
    { icon: Users, value: "10k+", label: "Happy Travelers" },
    { icon: Star, value: "4.9", label: "Average Rating" },
    { icon: Shield, value: "100%", label: "Secure Booking" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-30 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-100 rounded-full opacity-30 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full mb-6">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-medium text-blue-600">
                Your next adventure awaits
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
              Explore the world's
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                most beautiful
              </span>{" "}
              places
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl">
              Discover handpicked destinations, plan seamlessly, and create
              memories that last a lifetime. Travel made simple.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/destinations"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Browse Destinations
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl border border-gray-200 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Featured Destinations
            </h2>
            <p className="text-gray-500">
              Curated places loved by thousands of travelers
            </p>
          </div>
          <Link
            to="/destinations"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((dest) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600"
          >
            View all destinations
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Join thousands of travelers who book their dream trips with Voyager.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
