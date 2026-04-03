export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { code, redirectUri: redirectUriFromClient } = req.body;
  if (!code) return res.status(400).json({ error: "Missing code" });

  // Env vars for Vercel:
  // - SPOTIFY_CLIENT_ID
  // - SPOTIFY_CLIENT_SECRET
  // - SPOTIFY_REDIRECT_URI (e.g. https://soundlytics.vercel.app/callback)
  const spotifyClientId = process.env.SPOTIFY_CLIENT_ID ?? process.env.VITE_SPOTIFY_CLIENT_ID;
  const spotifyClientSecret =
    process.env.SPOTIFY_CLIENT_SECRET ?? process.env.VITE_SPOTIFY_CLIENT_SECRET;
  const spotifyRedirectUri =
    redirectUriFromClient ?? process.env.SPOTIFY_REDIRECT_URI ?? process.env.VITE_SPOTIFY_REDIRECT_URI;

  const missing = [];
  if (!spotifyClientId) missing.push("SPOTIFY_CLIENT_ID / VITE_SPOTIFY_CLIENT_ID");
  if (!spotifyClientSecret) missing.push("SPOTIFY_CLIENT_SECRET / VITE_SPOTIFY_CLIENT_SECRET");
  if (missing.length) {
    return res.status(500).json({
      error: `Missing Spotify OAuth env vars: ${missing.join(", ")}`,
    });
  }

  if (!spotifyRedirectUri) {
    return res.status(500).json({
      error: "Missing redirect_uri (client didn’t send it and SPOTIFY_REDIRECT_URI env var is not set).",
    });
  }

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", spotifyRedirectUri);

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${spotifyClientId}:${spotifyClientSecret}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const text = await response.text();
    console.log("Spotify raw response (client/api):", text);
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      return res.status(response.status).json({ error: text || "Invalid JSON from Spotify" });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

