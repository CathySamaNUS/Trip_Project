import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTrip, updateLocation } from '../utils/storage.js'
import { composeLocationMemory } from '../utils/mockGenerator.js'
import GeneratedMemoryCard from '../components/GeneratedMemoryCard.jsx'
import { PrimaryButton, SecondaryButton } from '../components/Buttons.jsx'
import { useToast } from '../components/Toast.jsx'

export default function GeneratedLocationPreviewPage() {
  const { tripId, locationId } = useParams()
  const nav = useNavigate()
  const toast = useToast()

  const [content, setContent] = useState(null)
  const [location, setLocation] = useState(null)

  const refresh = () => {
    const trip = getTrip(tripId)
    const loc = trip?.locations.find((l) => l.id === locationId)
    if (!loc) {
      alert('找不到地点')
      nav(`/trip/${tripId}`)
      return
    }
    setLocation(loc)
    // always recompose from current inputs so preview reflects latest schema
    const c = composeLocationMemory(loc)
    updateLocation(tripId, locationId, { generatedContent: c })
    setContent(c)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, locationId])

  if (!content || !location) return null

  const onUse = () => {
    updateLocation(tripId, locationId, { generated: true, generatedContent: content })
    toast('已收进手账')
    nav(`/trip/${tripId}`)
  }
  const onRegenerate = () => {
    const c = composeLocationMemory(location)
    setContent(c)
    updateLocation(tripId, locationId, { generatedContent: c })
    toast('已重新整理')
  }
  const onContinueEdit = () => nav(`/trip/${tripId}/location/${locationId}/input`)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-12">
      <div className="flex items-center justify-between mb-3">
        <button onClick={onContinueEdit} className="btn-ghost">← 返回编辑</button>
        <div className="text-sm text-muted">{location.locationName}</div>
        <button onClick={onUse} className="btn-ghost text-rose">使用这一页</button>
      </div>

      <GeneratedMemoryCard content={content} time={location.locationTime} />

      <div className="paper-card p-3 mt-4 flex flex-col sm:flex-row gap-3">
        <SecondaryButton className="flex-1" onClick={onRegenerate}>重新整理</SecondaryButton>
        <SecondaryButton className="flex-1" onClick={onContinueEdit}>继续编辑</SecondaryButton>
        <PrimaryButton className="flex-1" onClick={onUse}>使用这一页</PrimaryButton>
      </div>

      <div className="text-center text-xs text-muted mt-4">
        系统整理结果可能会有小变化，使用这一页后会保存到旅行手账中。
      </div>
    </div>
  )
}
