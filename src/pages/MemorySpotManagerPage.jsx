import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTrip, updateLocation } from '../utils/storage.js'
import MemorySpotCard from '../components/MemorySpotCard.jsx'
import MemorySpotEditor from '../components/MemorySpotEditor.jsx'
import { PrimaryButton, SecondaryButton } from '../components/Buttons.jsx'
import { useToast } from '../components/Toast.jsx'

export default function MemorySpotManagerPage() {
  const { tripId, locationId } = useParams()
  const nav = useNavigate()
  const toast = useToast()
  const trip = getTrip(tripId)
  const location = trip?.locations.find((l) => l.id === locationId)

  const [spots, setSpots] = useState(location?.memorySpots || [])
  const [editing, setEditing] = useState(null)

  if (!trip || !location) {
    return (
      <div className="p-6">
        找不到地点。<button onClick={() => nav('/')} className="btn-ghost">回首页</button>
      </div>
    )
  }

  const persist = (next) => {
    setSpots(next)
    updateLocation(tripId, locationId, { memorySpots: next })
  }

  const onSave = (spot) => {
    const exists = spots.find((s) => s.id === spot.id)
    const next = exists ? spots.map((s) => (s.id === spot.id ? spot : s)) : [...spots, spot]
    persist(next)
    setEditing(null)
    toast(exists ? '已更新' : '已添加小回忆点')
  }

  const onDelete = (spot) => {
    if (confirm(`要删除小回忆点「${spot.title || ''}」吗？`)) {
      persist(spots.filter((s) => s.id !== spot.id))
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-12">
      <button onClick={() => nav(`/trip/${tripId}/location/${locationId}/input`)} className="btn-ghost mb-3">
        ← 返回回忆素材
      </button>

      <div className="paper-card p-5 tape mb-4">
        <h1 className="font-serifc text-xl">这个地点里还有哪些小片段？</h1>
        <p className="text-sm text-muted mt-1">
          如果这个地点不止一个瞬间，可以添加几个小回忆点。比如：门口的小猫、老板请茶、买下挂件、雨中的废弃房子。
        </p>
      </div>

      <div className="space-y-3">
        {spots.length === 0 && (
          <div className="paper-card p-6 text-center text-muted">
            还没有小回忆点 — 添加一个，把那些一闪而过的瞬间留下来 ✨
          </div>
        )}
        {spots.map((s) => (
          <MemorySpotCard
            key={s.id}
            spot={s}
            onEdit={() => setEditing(s)}
            onDelete={() => onDelete(s)}
          />
        ))}
      </div>

      <button
        className="w-full paper-card p-4 mt-3 text-rose hover:bg-paper transition border-dashed"
        onClick={() => setEditing({})}
      >
        ＋ 添加一个小回忆点
      </button>

      <div className="flex gap-3 mt-6">
        <SecondaryButton className="flex-1" onClick={() => nav(`/trip/${tripId}/location/${locationId}/input`)}>
          返回继续编辑
        </SecondaryButton>
        <PrimaryButton
          className="flex-1"
          onClick={() => nav(`/trip/${tripId}/location/${locationId}/input`)}
        >
          完成
        </PrimaryButton>
      </div>

      {editing !== null && (
        <MemorySpotEditor
          initial={editing.id ? editing : null}
          photos={location.photos || []}
          onSave={onSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
