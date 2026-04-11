import { PiSpotifyLogoFill } from "react-icons/pi";
import { useEffect, useState } from "react";

export default function SpotifyLoginButton({ className = "" }) {
  const [isSignedIn, setIsSignedIn] = useState(() => {
    if (typeof window === "undefined") return false;
    return Boolean(
      window.sessionStorage.getItem("spotify_access_token") ||
      window.localStorage.getItem("spotify_access_token")
    );
  });

  useEffect(() => {
    const syncAuthState = () => {
      const sessionToken = window.sessionStorage.getItem("spotify_access_token");
      const legacyLocalToken = window.localStorage.getItem("spotify_access_token");
      if (!sessionToken && legacyLocalToken) {
        window.sessionStorage.setItem("spotify_access_token", legacyLocalToken);
        window.localStorage.removeItem("spotify_access_token");
      }
      setIsSignedIn(Boolean(window.sessionStorage.getItem("spotify_access_token")));
    };

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);
    window.addEventListener("spotify-auth-changed", syncAuthState);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
      window.removeEventListener("spotify-auth-changed", syncAuthState);
    };
  }, []);

  const handleSpotifyLogin = () => {
    const clientId = "929f1129cc4b44fc9133b02a4c9a8dee";
    const redirectUri = `${window.location.origin}/callback`;
    const scope = "user-top-read";
    const state = crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem("spotify_oauth_state", state);

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&state=${encodeURIComponent(
      state
    )}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
  };

  if (isSignedIn) return null;

  return (
    <button
      type="button"
      onClick={handleSpotifyLogin}
      className={`bg-[var(--color-spotify-green)] flex flex-row gap-6 items-center font-[var(--font-display)] font-medium text-xl text-black tracking-wider px-8 py-4 rounded-3xl transition-colors duration-200 hover:bg-[#0B9945] md:px-8 md:tracking-widest ${className}`}
    >
      <PiSpotifyLogoFill className="h-8 w-8" />
      Sign in with Spotify
    </button>
  );
}

