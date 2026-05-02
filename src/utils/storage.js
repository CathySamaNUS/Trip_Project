import { uid } from './id.js'

const KEY = 'trip_memory_v1'

const read = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { trips: [] }
    return JSON.parse(raw)
  } catch {
    return { trips: [] }
  }
}

const write = (data) => {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export const getAllTrips = () => read().trips || []

export const getTrip = (tripId) =>
  read().trips.find((t) => t.id === tripId) || null

export const saveTrip = (trip) => {
  const data = read()
  const idx = data.trips.findIndex((t) => t.id === trip.id)
  trip.updatedAt = new Date().toISOString()
  if (idx === -1) data.trips.push(trip)
  else data.trips[idx] = trip
  write(data)
  return trip
}

export const updateTrip = (trip) => saveTrip(trip)

export const deleteTrip = (tripId) => {
  const data = read()
  data.trips = data.trips.filter((t) => t.id !== tripId)
  write(data)
}

export const createTrip = (payload) => {
  const trip = {
    id: uid('trip'),
    tripTitle: payload.tripTitle || '未命名旅行',
    startDate: payload.startDate || '',
    endDate: payload.endDate || '',
    tripStyle: payload.tripStyle || [],
    companions: payload.companions || [],
    locations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  return saveTrip(trip)
}

export const addLocation = (tripId, locationPayload) => {
  const trip = getTrip(tripId)
  if (!trip) return null
  const location = {
    id: uid('loc'),
    tripId,
    locationName: locationPayload.locationName || '',
    locationType: locationPayload.locationType || '',
    locationTime: locationPayload.locationTime || '',
    order: locationPayload.order ?? trip.locations.length + 1,
    mapLocation: null,
    photos: [],
    memoryInput: emptyMemoryInput(),
    memorySpots: [],
    generatedContent: null,
    generated: false
  }
  trip.locations.push(location)
  saveTrip(trip)
  return location
}

export const updateLocation = (tripId, locationId, patch) => {
  const trip = getTrip(tripId)
  if (!trip) return null
  const idx = trip.locations.findIndex((l) => l.id === locationId)
  if (idx === -1) return null
  trip.locations[idx] = { ...trip.locations[idx], ...patch }
  saveTrip(trip)
  return trip.locations[idx]
}

export const deleteLocation = (tripId, locationId) => {
  const trip = getTrip(tripId)
  if (!trip) return
  trip.locations = trip.locations.filter((l) => l.id !== locationId)
  saveTrip(trip)
}

const draftKey = (tripId, locationId) => `trip_memory_draft_${tripId}_${locationId}`

export const saveLocationDraft = (tripId, locationId, payload) => {
  localStorage.setItem(draftKey(tripId, locationId), JSON.stringify(payload))
}

export const getLocationDraft = (tripId, locationId) => {
  try {
    const raw = localStorage.getItem(draftKey(tripId, locationId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const clearLocationDraft = (tripId, locationId) => {
  localStorage.removeItem(draftKey(tripId, locationId))
}

export const emptyMemoryInput = () => ({
  oneLineMemory: '',
  memorableDetailsText: '',
  memorableDetailTags: [],
  moodTags: [],
  moodText: '',
  people: [],
  keepsakes: [],
  quote: ''
})
