import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [tracks, setTracks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          throw new Error("No code found in URL");
        }

        const tokenRes = await fetch("/api/spotify-callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code })
        });

        const tokenText = await tokenRes.text();
        let tokenData = null;
        try {
          tokenData = tokenText ? JSON.parse(tokenText) : null;
        } catch {
          // Some failure modes return HTML (404) or empty body; surface it.
          tokenData = { error: `Token endpoint returned non-JSON response: ${tokenText.slice(0, 500)}` };
        }
        if (!tokenRes.ok) {
          throw new Error(tokenData?.error || `Token endpoint failed (${tokenRes.status})`);
        }
        if (tokenData?.error) throw new Error(tokenData.error);
        if (!tokenData?.access_token) {
          throw new Error("Token endpoint did not return an access_token.");
        }

        const accessToken = tokenData.access_token;
        setToken(accessToken);

        // "Top 5 songs played" -> your most-played tracks
        const tracksRes = await fetch(
          "https://api.spotify.com/v1/me/top/tracks?limit=5",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const tracksText = await tracksRes.text();
        let tracksJson = null;
        try {
          tracksJson = tracksText ? JSON.parse(tracksText) : null;
        } catch {
          tracksJson = null;
        }
        if (!tracksRes.ok) {
          throw new Error(tracksJson?.error?.message || `Failed to fetch top tracks (${tracksRes.status})`);
        }

        const items = tracksJson?.items || [];
        setTracks(items);

        // Persist for the dedicated Top 5 page.
        window.localStorage.setItem("spotify_access_token", accessToken);
        navigate("/top-tracks", { replace: true, state: { tracks: items } });
      } catch (err) {
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your Top 5 Tracks</h1>

      {token ? null : <div className="mb-4">No token available.</div>}

      {tracks.length === 0 ? (
        <div>No tracks found.</div>
      ) : (
        <div className="space-y-3">
          {tracks.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-4 rounded-xl bg-white/5 p-3"
            >
              {t.album?.images?.[0]?.url ? (
                <img
                  src={t.album.images[0].url}
                  alt={t.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
              ) : null}

              <div className="min-w-0">
                <div className="font-semibold truncate">{t.name}</div>
                <div className="text-sm text-white/70 truncate">
                  {(t.artists || []).map((a) => a.name).join(", ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Debug: show token only when needed */}
      {/* <pre className="mt-6 whitespace-pre-wrap break-all text-xs opacity-70">{token}</pre> */}
    </div>
  );
}