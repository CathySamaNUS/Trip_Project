import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import CreateTripPage from './pages/CreateTripPage.jsx'
import TripDashboardPage from './pages/TripDashboardPage.jsx'
import AddLocationPage from './pages/AddLocationPage.jsx'
import LocationMemoryInputPage from './pages/LocationMemoryInputPage.jsx'
import MemorySpotManagerPage from './pages/MemorySpotManagerPage.jsx'
import GeneratedLocationPreviewPage from './pages/GeneratedLocationPreviewPage.jsx'
import TravelJournalPreviewPage from './pages/TravelJournalPreviewPage.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { LightboxProvider } from './components/Lightbox.jsx'
import { seedOnce } from './utils/sampleData.js'

export default function App() {
  useEffect(() => {
    seedOnce()
  }, [])

  return (
    <ToastProvider>
      <LightboxProvider>
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
