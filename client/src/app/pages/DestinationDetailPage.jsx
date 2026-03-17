import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  DollarSign,
  Calendar,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { getDestination, listDestinations } from "../lib/api.js";
import DestinationCard from "../components/DestinationCard.jsx";

export default function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError("");

    getDestination(id)
      .then((data) => {
        setDestination(data.destination);
        // Fetch related destinations in the same category
        return listDestinations({ category: data.destination.category });
      })
      .then((data) => {
        setRelated(data.destinations.filter((d) => d._id !== id).slice(0, 3));
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl font-bold text-gray-200 mb-2">404</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Destination not found
          </h2>
          <p className="text-gray-500 mb-6">
            {error || "This destination doesn't exist or has been removed."}
          </p>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Destinations
          </Link>
        </div>
      </div>
    );
  }

  const categoryColors = {
    beach: "bg-cyan-50 text-cyan-700",
    mountain: "bg-emerald-50 text-emerald-700",
    city: "bg-violet-50 text-violet-700",
    cultural: "bg-amber-50 text-amber-700",
    adventure: "bg-rose-50 text-rose-700",
  };

  const highlights = [
    {
      icon: DollarSign,
      label: "Starting from",
      value: `$${(destination.price ?? 0).toLocaleString()} / person`,
    },
    {
      icon: Star,
      label: "Rating",
      value: `${destination.rating} / 5.0`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: destination.country,
    },
    {
      icon: Users,
      label: "Group size",
      value: "1 - 12 guests",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero image */}
      <div className="relative h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-lg hover:bg-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  categoryColors[destination.category] ||
                  "bg-gray-50 text-gray-700"
                }`}
              >
                {destination.category}
              </span>
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-gray-800">
                  {destination.rating}
                </span>
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1">
              {destination.name}
            </h1>
            <div className="flex items-center gap-1 text-white/80">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{destination.country}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              About this destination
            </h2>
            <p className="text-gray-600 leading-relaxed text-base mb-8">
              {destination.description}
            </p>

            {/* Highlights grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4.5 h-4.5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="text-sm font-semibold text-gray-800 mt-0.5">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-3">
              What to expect
            </h2>
            <ul className="space-y-2 text-gray-600 text-sm leading-relaxed mb-8">
              <li className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                Flexible booking dates with free cancellation up to 24 hours
                before departure
              </li>
              <li className="flex items-start gap-2">
                <Users className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                Small group or private tours available for up to 12 guests
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                Highly rated experience by thousands of travelers worldwide
              </li>
            </ul>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 shadow-sm">
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${(destination.price ?? 0).toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 ml-1">/ person</span>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                Includes guided tours, accommodations, and local experiences.
              </p>
              <Link
                to={`/book/${destination._id}`}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Book This Trip
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-gray-400 text-center mt-3">
                No payment required to reserve
              </p>
            </div>
          </div>
        </div>

        {/* Related destinations */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Similar destinations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((dest) => (
                <DestinationCard key={dest._id} destination={dest} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
