import { Star, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DestinationCard({ destination }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-[#ded7cc] bg-[#fffdf9] transition-colors hover:border-[#9c9488]">
      <Link to={`/destinations/${destination._id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e0d3]">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3 rounded bg-[#fffdf9]/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#4d6554]">
          {destination.category}
        </div>
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded bg-[#fffdf9]/90 px-2 py-1">
          <Star className="h-3.5 w-3.5 fill-[#b36b38] text-[#b36b38]" />
          <span className="text-xs font-semibold text-[#1f2933]">
            {destination.rating}
          </span>
        </div>
      </div>

        <div className="p-4">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-[#1f2933]">
            {destination.name}
          </h3>
            <div className="text-right text-sm font-semibold text-[#1f2933]">
              ${(destination.price ?? 0).toLocaleString()}
            </div>
          </div>
          <div className="mb-3 flex items-center gap-1 text-[#6f6a61]">
            <MapPin className="h-3.5 w-3.5" />
            <span className="text-xs">{destination.country}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-relaxed text-[#6f6a61]">
          {destination.description}
        </p>
          <div className="mt-4 flex items-center justify-between border-t border-[#ebe5d9] pt-3 text-xs font-semibold text-[#4d6554]">
            <span>per person</span>
            <span className="inline-flex items-center gap-1">
              Details <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
