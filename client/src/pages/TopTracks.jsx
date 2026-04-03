import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import SiteNavbar from "../components/SiteNavbar.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import SpotifyLoginButton from "../components/SpotifyLoginButton.jsx";

async function readJsonSafe(res) {
  const text = await res.text();
  if (!text) return { ok: res.ok, status: res.status, data: null, raw: text };
  try {
    return { ok: res.ok, status: res.status, data: JSON.parse(text), raw: text };
  } catch {
    return { ok: res.ok, status: res.status, data: null, raw: text };
  }
}

export default function TopTracks() {
  const location = useLocation();
  const initialTracks = useMemo(() => location.state?.tracks, [location.state]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tracks, setTracks] = useState(Array.isArray(initialTracks) ? initialTracks : []);

  useEffect(() => {
    const run = async () => {
      try {
        // If we came from the callback, use the tracks we already fetched.
        if (Array.isArray(initialTracks) && initialTracks.length > 0) {
          setLoading(false);
          return;
        }

        const accessToken = window.localStorage.getItem("spotify_access_token");
        if (!accessToken) {
          setError("Please sign in with Spotify first.");
          setLoading(false);
          return;
        }

        const tracksRes = await fetch(
          "https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=long_term",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const tracksJsonSafe = await readJsonSafe(tracksRes);
        if (!tracksJsonSafe.ok) {
          const msg =
            tracksJsonSafe.data?.error?.message ||
            `Failed to fetch top tracks (${tracksJsonSafe.status})`;
          throw new Error(msg);
        }

        setTracks(tracksJsonSafe.data?.items || []);
      } catch (err) {
        // Token might be expired or revoked.
        if (String(err?.message || "").includes("401")) {
          window.localStorage.removeItem("spotify_access_token");
        }
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-spotify-light-black)] text-white">
      <SiteNavbar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2 font-[var(--font-display)]">Your Top 5 Played</h1>
        <p className="text-white/70 mb-6">
          Most-played songs based on your Spotify listening history.
        </p>

        {loading ? (
          <div className="text-white/80">Loading...</div>
        ) : error ? (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="font-semibold mb-3">Couldn’t load top tracks</div>
            <div className="text-white/70 mb-4">{error}</div>
            <SpotifyLoginButton className="w-full justify-center" />
          </div>
        ) : tracks.length === 0 ? (
          <div className="text-white/70">No tracks found for your account yet.</div>
        ) : (
          <div className="space-y-3">
            {tracks.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-4 rounded-xl bg-white/5 border border-white/10 p-3"
              >
                {t.album?.images?.[0]?.url ? (
                  <img
                    src={t.album.images[0].url}
                    alt={t.name}
                    className="w-14 h-14 rounded-lg object-cover flex-none"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-white/10 flex-none" />
                )}

                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate">{t.name}</div>
                  <div className="text-sm text-white/70 truncate">
                    {(t.artists || []).map((a) => a.name).join(", ")}
                  </div>
                </div>

                {t.preview_url ? (
                  <audio controls src={t.preview_url} className="w-40" />
                ) : (
                  <div className="text-white/50 text-xs">No preview</div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

