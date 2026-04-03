import { useEffect } from "react";

export default function Callback() {
  useEffect(() => {
    // Get the "code" query parameter from Spotify
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      console.log("Spotify authorization code:", code);

      // Send this code to your backend to exchange for access token
      fetch("https://soundlytics.vercel.app/api/spotify-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(data => {
          console.log("Access token data:", data);
          // Optionally save token in localStorage or state
          // Then redirect to main page
          window.location.href = "/";
        })
        .catch(err => console.error(err));
    } else {
      console.error("No code found in query string");
    }
  }, []);

  return (
    <div className="h-screen bg-[var(--color-spotify-light-black)] flex justify-center items-center">
      <p className="font-[var(--font-display)] font-normal text-white text-xl">Logging in with Spotify...</p>
    </div>
  );
}