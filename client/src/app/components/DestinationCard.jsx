import { Star, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DestinationCard({ destination }) {
  const categoryColors = {
    beach: "bg-cyan-50 text-cyan-700",
    mountain: "bg-emerald-50 text-emerald-700",
    city: "bg-violet-50 text-violet-700",
    cultural: "bg-amber-50 text-amber-700",
    adventure: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              categoryColors[destination.category] || "bg-gray-50 text-gray-700"
            }`}
          >
            {destination.category}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-semibold text-gray-800">
            {destination.rating}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-base font-semibold text-gray-900">
            {destination.name}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs">{destination.country}</span>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {destination.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ${(destination.price ?? 0).toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 ml-1">/ person</span>
          </div>
          <Link
            to={`/destinations/${destination._id}`}
            className="flex items-center gap-2 text-xs font-medium bg-gray-900 text-white transition-transform px-3 py-2 rounded hover:bg-gray-800"
          >
            View details <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
