import { PiSpotifyLogoFill } from "react-icons/pi";
import TrueFocus from "../components/TrueFocus";
import SoftAurora from '../components/SoftAurora';
import logo from "../assets/logo.png";

export default function App() {
  
  const handleSpotifyLogin = () => {
    const clientId = "929f1129cc4b44fc9133b02a4c9a8dee";
    const redirectUri = "https://soundlytics.vercel.app/callback";
    const scope = "user-read-email user-read-private";

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="h-screen bg-[var(--color-spotify-light-black)] flex justify-center items-center">
      <div className="hidden absolute inset-0 z-0 lg:block">  
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
      <div className='z-10'>
        <div className='flex flex-col justify-center items-center gap-8 p-4'>
          <div className="flex items-center">
            <img src={logo} alt="logo" className="h-16 w-24 md:h-24 md:w-32"/>
            <h1 className="font-[var(--font-display)] font-bold text-white text-4xl mb-2 md:text-5xl">Soundlytics</h1>
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
          <button 
            onClick={handleSpotifyLogin}
            className='bg-[var(--color-spotify-green)] flex flex-row gap-6 items-center font-[var(--font-display)] font-medium text-xl text-black tracking-wider px-8 py-4 rounded-3xl transition-colors duration-200 hover:bg-[#0B9945] md:px-8 md:tracking-widest'
          >
            <PiSpotifyLogoFill className="h-8 w-8"/> Sign in with Spotify
          </button>
          <p className="text-white">Don't have an account? <a href="https://accounts.spotify.com/login" className="text-white hover:text-[var(--color-spotify-green)]">Sign up for Spotify</a></p>
        </div>
      </div>
    </div>
  )
}
