import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Search } from "lucide-react";
import { listDestinations, seedDestinations } from "../lib/api.js";
import DestinationCard from "../components/DestinationCard.jsx";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const seeded = sessionStorage.getItem("destinations_seeded");
        if (!seeded) {
          try {
            await seedDestinations();
          } catch {}
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

  return (
    <div>
      <section className="bg-[#f7f4ef]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#4d6554]">
              Simple travel booking
            </p>
            <h1 className="mb-6 max-w-2xl text-4xl font-semibold leading-[1.06] tracking-tight text-[#1f2933] sm:text-5xl lg:text-6xl">
              Find a place, check the essentials, book the trip.
            </h1>
            <p className="mb-8 max-w-xl text-base leading-7 text-[#6f6a61]">
              A smaller catalog of destinations with the details that matter:
              location, price, rating, and a direct path to booking.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/destinations" className="button-primary">
                Browse destinations
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/destinations?category=cultural"
                className="button-secondary"
              >
                View cultural trips
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#ded7cc] bg-[#fffdf9]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-[#ded7cc] px-4 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">
          {[
            ["50+", "destinations kept easy to compare"],
            ["4.9", "average traveler rating"],
            ["24h", "free cancellation window"],
          ].map(([value, label]) => (
            <div key={label} className="py-6 md:px-8">
              <div className="text-2xl font-semibold text-[#1f2933]">
                {value}
              </div>
              <div className="mt-1 text-sm text-[#6f6a61]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f4ef]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-5 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#4d6554]">
                Featured
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-[#1f2933] sm:text-3xl">
                Good trips without the noise
              </h2>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm leading-6 text-[#6f6a61]">
                A short list of popular destinations, shown with enough context
                to make a decision quickly.
              </p>
              <Link
                to="/destinations"
                className="hidden items-center gap-1 text-sm font-semibold text-[#4d6554] transition-colors hover:text-[#1f2933] sm:inline-flex"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="mb-4 aspect-[4/3] rounded-lg bg-[#e5ded2]" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-[#e5ded2]" />
                  <div className="h-3 w-1/2 rounded bg-[#e5ded2]" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((dest) => (
                <DestinationCard key={dest._id} destination={dest} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#4d6554]"
            >
              View all destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#ded7cc] bg-[#1f2933]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 text-[#fffdf9] sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c9d5c1]">
              <Search className="h-3.5 w-3.5" />
              Ready when you are
            </p>
            <h2 className="text-2xl font-semibold sm:text-3xl">
              Start with the destination list.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#d8d1c6]">
              Filter by travel style, compare a few options, then reserve the
              dates that work.
            </p>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#fffdf9] px-5 py-3 text-sm font-semibold text-[#1f2933] transition-colors hover:bg-[#ede7dd]"
          >
            Browse trips
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
