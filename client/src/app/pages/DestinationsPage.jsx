import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
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

  // Debounce search input
  useEffect(() => {
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(debounceTimer.current);
  }, [search]);

  // Fetch destinations when debounced search or category changes
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
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Destinations
          </h1>
          <p className="text-gray-500 mb-6">
            Explore our collection of handpicked travel destinations
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search destinations..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat.value
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-20">
            <MapEmptyIcon />
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-1">
              No destinations found
            </h3>
            <p className="text-sm text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400 mb-4">
              {destinations.length} destination
              {destinations.length !== 1 ? "s" : ""} found
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
      <Search className="w-7 h-7 text-gray-300" />
    </div>
  );
}
