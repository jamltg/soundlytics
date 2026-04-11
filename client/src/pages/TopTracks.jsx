import { useEffect, useState } from "react";
import SiteNavbar from "../components/SiteNavbar.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import SpotifyLoginButton from "../components/SpotifyLoginButton.jsx";

async function readJsonSafe(res) {
  const text = await res.text();
  if (!text) return { ok: res.ok, status: res.status, data: null };

  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text) };
  } catch {
    return { ok: res.ok, status: res.status, data: null };
  }
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("spotify_refresh_token");

  if (!refreshToken) {
    throw new Error("Missing refresh token. Please log in again.");
  }

  const res = await fetch("/api/refresh-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const data = await res.json();

  if (!data.access_token) {
    throw new Error("Failed to refresh access token");
  }

  sessionStorage.setItem("spotify_access_token", data.access_token);

  return data.access_token;
}

export default function TopTracks() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchTopTracks = async () => {
    let accessToken =
      window.sessionStorage.getItem("spotify_access_token") ||
      window.localStorage.getItem("spotify_access_token");

    if (!window.sessionStorage.getItem("spotify_access_token") && accessToken) {
      window.sessionStorage.setItem("spotify_access_token", accessToken);
      window.localStorage.removeItem("spotify_access_token");
    }

    if (!accessToken) {
      throw new Error("Please sign in with Spotify first.");
    }

    // FIRST REQUEST
    let res = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (res.status === 401) {
      accessToken = await refreshAccessToken();

      res = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=short_term",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    }

    const json = await readJsonSafe(res);

    if (!json.ok) {
      throw new Error(
        json.data?.error?.message || "Failed to fetch top tracks"
      );
    }

    setTracks(json.data?.items || []);
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchTopTracks();
      } catch (err) {
        if (String(err?.message || "").includes("401")) {
          window.sessionStorage.removeItem("spotify_access_token");
          window.localStorage.removeItem("spotify_access_token");
          window.dispatchEvent(new Event("spotify-auth-changed"));
        }

        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [refreshKey]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-spotify-light-black)] text-white">
      <SiteNavbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl text-center font-bold mb-2 font-[var(--font-display)]">
          Your Top 10 Played
        </h1>

        <p className="text-white/70 mb-6 text-center">
          Based on Spotify’s Top Tracks
        </p>

        {loading ? (
          <div className="py-16 text-white/80">Loading...</div>
        ) : error ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="font-semibold mb-3">Couldn’t load tracks</div>
            <div className="text-white/70 mb-4">{error}</div>
            <SpotifyLoginButton className="w-full justify-center" />
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-white/70">No top tracks found yet.</div>
        ) : (
          <div>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="mb-4 px-4 py-2 rounded-xl border border-white/15 bg-white/5"
            >
              Refresh
            </button>

            <div className="space-y-3">
              {tracks.map((t, index) => (
                <div
                  key={`${t.id}-${index}`}
                  className="flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 p-3"
                >
                  {t.album?.images?.[0]?.url ? (
                    <img
                      src={t.album.images[0].url}
                      alt={t.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-white/10" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">{t.name}</div>
                    <div className="text-sm text-white/70 truncate">
                      {(t.artists || []).map((a) => a.name).join(", ")}
                    </div>
                  </div>

                  {t.preview_url ? (
                    <audio controls src={t.preview_url} className="w-40" />
                  ) : (
                    <div className="text-white/50 text-xs">
                      No preview
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}