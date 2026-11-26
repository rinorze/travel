import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#ded7cc] bg-[#ede7dd]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="mb-3 flex items-center gap-2 text-[#1f2933]">
              <span className="grid h-7 w-7 place-items-center rounded-full border border-[#1f2933] text-xs font-bold">
                T
              </span>
              <span className="text-lg font-semibold tracking-tight">Travel</span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-[#6f6a61]">
              Straightforward trip browsing for people who already know they
              want to go somewhere worth remembering.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#1f2933]">Explore</h3>
            <ul className="space-y-2">
              {[
                ["Destinations", "/destinations"],
                ["Beaches", "/destinations?category=beach"],
                ["Mountains", "/destinations?category=mountain"],
                ["Cultural", "/destinations?category=cultural"],
              ].map(([label, to]) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="inline-flex items-center gap-1 text-sm text-[#6f6a61] transition-colors hover:text-[#1f2933]"
                  >
                    {label}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#1f2933]">Project</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/rinorze/travel"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-[#6f6a61] hover:text-[#1f2933]"
                >
                  Source code on GitHub
                </a>
              </li>
              <li>
                <span className="text-sm text-[#6f6a61]">A portfolio project, not a real travel agency</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[#d8d1c6] pt-6 sm:flex-row">
          <p className="text-xs text-[#7a756b]">
            &copy; {new Date().getFullYear()} Rinor Zeqiri · Travel
          </p>
        </div>
      </div>
    </footer>
  );
}
