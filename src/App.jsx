import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import CreateTripPage from './pages/CreateTripPage.jsx'
import TripDashboardPage from './pages/TripDashboardPage.jsx'
import AddLocationPage from './pages/AddLocationPage.jsx'
import LocationMemoryInputPage from './pages/LocationMemoryInputPage.jsx'
import MemorySpotManagerPage from './pages/MemorySpotManagerPage.jsx'
import GeneratedLocationPreviewPage from './pages/GeneratedLocationPreviewPage.jsx'
import TravelJournalPreviewPage from './pages/TravelJournalPreviewPage.jsx'
import { ToastProvider, useToast } from './components/Toast.jsx'
import { LightboxProvider } from './components/Lightbox.jsx'
import { seedOnce } from './utils/sampleData.js'
import { saveTrip } from './utils/storage.js'
import { decodeTripFromHash, clearShareHash } from './utils/exporter.js'

function ShareImporter() {
  const nav = useNavigate()
  const toast = useToast()
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    const incoming = decodeTripFromHash()
    if (!incoming) return
    const sharedId = `shared_${incoming.id}_${Date.now().toString(36)}`
    const trip = {
      ...incoming,
      id: sharedId,
      tripTitle: incoming.tripTitle ? `${incoming.tripTitle}（朋友分享）` : '朋友分享的旅行',
      locations: (incoming.locations || []).map((loc) => ({ ...loc, tripId: sharedId })),
      createdAt: incoming.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    saveTrip(trip)
    clearShareHash()
    toast('已收到一本朋友分享的手账 💛')
    nav(`/trip/${sharedId}/journal`, { replace: true })
    setDone(true)
  }, [done, nav, toast])

  return null
}

export default function App() {
  useEffect(() => {
    seedOnce()
  }, [])

  return (
    <ToastProvider>
      <LightboxProvider>
        <ShareImporter />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-trip" element={<CreateTripPage />} />
          <Route path="/trip/:tripId" element={<TripDashboardPage />} />
          <Route path="/trip/:tripId/add-location" element={<AddLocationPage />} />
          <Route
            path="/trip/:tripId/location/:locationId/input"
            element={<LocationMemoryInputPage />}
          />
          <Route
            path="/trip/:tripId/location/:locationId/spots"
            element={<MemorySpotManagerPage />}
          />
          <Route
            path="/trip/:tripId/location/:locationId/preview"
            element={<GeneratedLocationPreviewPage />}
          />
          <Route path="/trip/:tripId/journal" element={<TravelJournalPreviewPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LightboxProvider>
    </ToastProvider>
  )
}
