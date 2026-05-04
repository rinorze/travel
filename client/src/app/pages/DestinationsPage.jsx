import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import { listDestinations } from "../lib/api.js";
import DestinationCard from "../components/DestinationCard.jsx";

const categories = [
  { value: "all", label: "All" },
  { value: "beach", label: "Beach" },
  { value: "mountain", label: "Mountain" },
  { value: "city", label: "City" },
  { value: "cultural", label: "Cultural" },
  { value: "adventure", label: "Adventure" },
];

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all",
  );
  const debounceTimer = useRef(null);

  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(debounceTimer.current);
  }, [search]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = {};
        if (activeCategory !== "all") params.category = activeCategory;
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

        const data = await listDestinations(params);
        setDestinations(data.destinations);
      } catch (err) {
        console.error("Failed to load destinations:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCategory, debouncedSearch]);

  const handleCategoryChange = (value) => {
    setActiveCategory(value);
    const params = {};
    if (value !== "all") params.category = value;
    if (search.trim()) params.search = search.trim();
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    const params = {};
    if (activeCategory !== "all") params.category = activeCategory;
    if (value.trim()) params.search = value.trim();
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <div className="border-b border-[#ded7cc] bg-[#fffdf9]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#4d6554]">
            Browse
          </p>
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-[#1f2933]">
            Destinations
          </h1>
          <p className="mb-6 max-w-2xl text-sm leading-6 text-[#6f6a61]">
            Search by place or narrow the list by travel style. The results stay
            plain on purpose: image, location, price, and rating.
          </p>

          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f958b]" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search destinations"
              className="field pl-10 pr-10"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  const params = {};
                  if (activeCategory !== "all")
                    params.category = activeCategory;
                  setSearchParams(params);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8f958b] hover:text-[#1f2933] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat.value
                  ? "border-[#1f2933] bg-[#1f2933] text-[#fffdf9]"
                  : "border-[#ded7cc] bg-[#fffdf9] text-[#5f665d] hover:border-[#9c9488]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="mb-4 aspect-[4/3] rounded-lg bg-[#e5ded2]" />
                <div className="mb-2 h-4 w-3/4 rounded bg-[#e5ded2]" />
                <div className="h-3 w-1/2 rounded bg-[#e5ded2]" />
              </div>
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20">
            <MapEmptyIcon />
            <h3 className="mt-4 mb-1 text-lg font-semibold text-[#1f2933]">
              No destinations found
            </h3>
            <p className="text-sm text-[#6f6a61]">
              Try a different search or filter.
            </p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-[#6f6a61]">
              {destinations.length} destination
              {destinations.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((dest) => (
                <DestinationCard key={dest._id} destination={dest} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MapEmptyIcon() {
  return (
    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ebe5d9]">
      <Search className="h-7 w-7 text-[#8f958b]" />
    </div>
  );
}
