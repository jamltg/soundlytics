import { Link, NavLink } from "react-router-dom";
import SpotifyLoginButton from "./SpotifyLoginButton.jsx";

export default function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="text-white font-bold font-[var(--font-display)] text-lg">
          Soundlytics
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-[var(--color-spotify-green)] font-semibold" : "text-white/80 hover:text-white"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/top-tracks"
            className={({ isActive }) =>
              isActive
                ? "text-[var(--color-spotify-green)] font-semibold"
                : "text-white/80 hover:text-white"
            }
          >
            Top 10 Played
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SpotifyLoginButton className="text-sm px-6 py-3" />
          </div>
        </div>
      </div>
    </header>
  );
}

