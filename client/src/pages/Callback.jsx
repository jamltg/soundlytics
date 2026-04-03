import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        const expectedState = window.sessionStorage.getItem("spotify_oauth_state");

        if (!code) {
          throw new Error("No code found in URL");
        }
        if (!state || !expectedState || state !== expectedState) {
          throw new Error("Invalid OAuth state. Please sign in again.");
        }
        window.sessionStorage.removeItem("spotify_oauth_state");

        // Spotify requires the exact redirect_uri used during authorization.
        // Send it from the browser to avoid relying on Vercel env var naming.
        const redirectUri = `${window.location.origin}${window.location.pathname}`;

        const tokenRes = await fetch("/api/spotify-callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, redirectUri })
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
        // Persist so the /top-tracks page can fetch the latest data.
        window.sessionStorage.setItem("spotify_access_token", accessToken);
        window.localStorage.removeItem("spotify_access_token");
        window.dispatchEvent(new Event("spotify-auth-changed"));
        navigate("/top-tracks", { replace: true });
      } catch (err) {
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) return <div className="h-screen bg-[var(--color-spotify-light-black)]"><span className="text text-white font-[var(--font-display)] font-medium">Loading...</span></div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Spotify connected</h1>
      <p className="text-white/70">Loading your Top 10 Played…</p>

      {/* Debug: show token only when needed */}
      {/* <pre className="mt-6 whitespace-pre-wrap break-all text-xs opacity-70">{token}</pre> */}
    </div>
  );
}