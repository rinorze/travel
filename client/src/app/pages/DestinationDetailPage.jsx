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

    const loadDestination = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getDestination(id);
        setDestination(data.destination);
        const relatedData = await listDestinations({
          category: data.destination.category,
        });
        setRelated(
          relatedData.destinations.filter((d) => d._id !== id).slice(0, 3),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#4d6554] animate-spin" />
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
            className="button-primary"
          >
            <ArrowLeft className="w-4 h-4" />
            All Destinations
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#f7f4ef]">
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#fffdf9]/90 px-3 py-2 text-sm font-semibold text-[#1f2933] transition-colors hover:bg-[#fffdf9] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded bg-[#fffdf9]/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#4d6554]">
                {destination.category}
              </span>
              <div className="flex items-center gap-1 rounded bg-[#fffdf9]/90 px-2 py-1">
                <Star className="w-3.5 h-3.5 text-[#b36b38] fill-[#b36b38]" />
                <span className="text-xs font-semibold text-[#1f2933]">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-[#1f2933] mb-4">
              About this destination
            </h2>
            <p className="text-[#5f665d] leading-relaxed text-base mb-8">
              {destination.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-lg border border-[#ded7cc] bg-[#fffdf9] p-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#ebe5d9] flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4.5 h-4.5 text-[#4d6554]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#7a756b]">{item.label}</div>
                    <div className="text-sm font-semibold text-[#1f2933] mt-0.5">
                      {item.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold text-[#1f2933] mb-3">
              What to expect
            </h2>
            <ul className="space-y-2 text-[#5f665d] text-sm leading-relaxed mb-8">
              <li className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[#4d6554] mt-0.5 flex-shrink-0" />
                Flexible booking dates with free cancellation up to 24 hours
                before departure
              </li>
              <li className="flex items-start gap-2">
                <Users className="w-4 h-4 text-[#4d6554] mt-0.5 flex-shrink-0" />
                Small group or private tours available for up to 12 guests
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-4 h-4 text-[#4d6554] mt-0.5 flex-shrink-0" />
                Highly rated experience by thousands of travelers worldwide
              </li>
            </ul>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#fffdf9] rounded-lg border border-[#ded7cc] p-6 sticky top-24">
              <div className="mb-4">
                <span className="text-3xl font-semibold text-[#1f2933]">
                  ${(destination.price ?? 0).toLocaleString()}
                </span>
                <span className="text-sm text-[#7a756b] ml-1">/ person</span>
              </div>
              <p className="text-sm text-[#6f6a61] mb-5">
                Includes guided tours, accommodations, and local experiences.
              </p>
              <Link
                to={`/book/${destination._id}`}
                className="button-primary w-full"
              >
                Book This Trip
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-xs text-[#7a756b] text-center mt-3">
                No payment required to reserve
              </p>
            </div>
          </div>
        </div>

        {/* Related destinations */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-[#ded7cc]">
            <h2 className="text-xl font-semibold text-[#1f2933] mb-6">
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
