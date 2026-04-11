import TrueFocus from "../components/TrueFocus";
import SoftAurora from '../components/SoftAurora';
import logo from "../assets/logo.png";
import SiteNavbar from "../components/SiteNavbar.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import SpotifyLoginButton from "../components/SpotifyLoginButton.jsx";
import { Link } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen bg-[var(--color-spotify-light-black)] text-white">
      <SiteNavbar />

      <div className="relative">
        <div className="hidden absolute inset-0 z-0 lg:block pointer-events-none">
          <SoftAurora
            speed={0.6}
            scale={1.5}
            brightness={0.5}
            color1="#f7f7f7"
            color2="#1db954"
            noiseFrequency={1.5}
            noiseAmplitude={1}
            bandHeight={0.40}
            bandSpread={1}
            octaveDecay={0.1}
            layerOffset={0}
            colorSpeed={1}
            enableMouseInteraction
            mouseInfluence={0}
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="flex items-center gap-4">
              <img src={logo} alt="logo" className="h-16 w-24 md:h-24 md:w-32" />
              <h1 className="font-[var(--font-display)] font-bold text-white text-4xl md:text-5xl">
                Soundlytics
              </h1>
            </div>

            <TrueFocus
              sentence="Analyze Curate Explore"
              manualMode={false}
              blurAmount={5}
              borderColor="#1db954"
              animationDuration={0.5}
              pauseBetweenAnimations={1}
              className="text-3xl"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <SpotifyLoginButton />
              <Link
                to="/top-tracks"
                className="px-8 py-4 rounded-3xl border border-white/15 hover:border-white/30 bg-white/5 text-white text-center font-[var(--font-display)] font-medium transition-colors"
              >
                See Top 10 Played
              </Link>
            </div>

            <p className="text-white/80 text-sm">
              Spotify login required to fetch your listening history.
              {" "}
              <a
                href="https://accounts.spotify.com/login"
                className="text-[var(--color-spotify-green)] hover:text-white"
              >
                Sign up for Spotify
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <section className="py-10 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-3">What you get</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-[var(--color-spotify-green)] font-semibold mb-2">Top tracks</div>
              <div className="text-white/70">
                Instantly see your top 10 most played songs
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-[var(--color-spotify-green)] font-semibold mb-2">Clear insights</div>
              <div className="text-white/70">
                Clean UI focused on what matters: your listening patterns.
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-[var(--color-spotify-green)] font-semibold mb-2">Ready for growth</div>
              <div className="text-white/70">
                Add more sections (albums, artists, recommendations) as you go.
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-3">How it works</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-[var(--color-spotify-green)] font-semibold mb-2">1. Sign in</div>
              <div className="text-white/70">Connect Spotify to authorize access.</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-[var(--color-spotify-green)] font-semibold mb-2">2. Fetch data</div>
              <div className="text-white/70">We exchange your login code for an access token.</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className="text-[var(--color-spotify-green)] font-semibold mb-2">3. View Top 10</div>
              <div className="text-white/70">See your top songs in one place.</div>
            </div>
          </div>
        </section>

        <section className="py-10 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-3">FAQ</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-white/80 space-y-4">
            <div>
              <div className="font-semibold text-white mb-1">Do I need an account?</div>
              <div className="text-white/70">You must sign in with Spotify to access your data. This application is currently restricted to approved users only. A Spotify Premium account is recommended for full functionality, and access must be granted by the developer.</div>
            </div>
            <div>
              <div className="font-semibold text-white mb-1">Where does “Top 10” come from?</div>
              <div className="text-white/70">From Spotify’s “Top Tracks” endpoint using your authorized account. This data is based on your listening activity over the last 4 weeks, as provided by Spotify’s analytics system.</div>
            </div>
            <div>
              <div className="font-semibold text-white mb-1">Is my data stored?</div>
              <div className="text-white/70">
                This demo temporarily stores an access token in your browser while you use the app to enable Spotify data access.
              </div>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  )
}
