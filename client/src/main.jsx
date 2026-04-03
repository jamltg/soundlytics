import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import './index.css'
import App from './pages/App.jsx'
import Callback from './pages/Callback.jsx'
import TopTracks from './pages/TopTracks.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/top-tracks" element={<TopTracks />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
