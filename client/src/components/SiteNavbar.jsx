import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import SpotifyLoginButton from "./SpotifyLoginButton.jsx";

export default function SiteNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-black/40 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-4">
          <img src={logo} alt="logo" className="h-16 w-24 md:h-16 md:w-24" />
          <h1 className="text-white font-bold font-[var(--font-display)] text-lg">Soundlytics</h1>
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

