import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTrip, deleteLocation, deleteTrip } from '../utils/storage.js'
import LocationCard from '../components/LocationCard.jsx'
import MapRoutePreview from '../components/MapRoutePreview.jsx'
import { PrimaryButton, SecondaryButton } from '../components/Buttons.jsx'
import { useToast } from '../components/Toast.jsx'

export default function TripDashboardPage() {
  const { tripId } = useParams()
  const nav = useNavigate()
  const toast = useToast()
  const [trip, setTrip] = useState(null)
  const [tab, setTab] = useState('list')

  const refresh = () => {
    const t = getTrip(tripId)
    if (!t) {
      alert('找不到这趟旅行')
      nav('/')
      return
    }
    setTrip(t)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId])

  if (!trip) return null

  const generated = trip.locations.filter((l) => l.generated).length
  const total = trip.locations.length
  const ratio = total ? Math.round((generated / total) * 100) : 0

  const onDeleteLoc = (loc) => {
    if (confirm(`要删除「${loc.locationName || '这个地点'}」吗？`)) {
      deleteLocation(trip.id, loc.id)
      toast('地点已删除')
      refresh()
    }
  }

  const onDeleteTrip = () => {
    if (confirm('要删除整趟旅行吗？此操作无法撤销。')) {
      deleteTrip(trip.id)
      nav('/')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-28">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => nav('/')} className="btn-ghost">← 首页</button>
        <button onClick={onDeleteTrip} className="btn-ghost text-rose">删除旅行</button>
      </div>

      {/* Header */}
      <div className="paper-card p-5 tape">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="font-serifc text-2xl">{trip.tripTitle} 🌧️</h1>
            <div className="text-sm text-muted mt-1">
              {trip.startDate} - {trip.endDate}
              {trip.companions?.length > 0 && ` · 和 ${trip.companions.length} 位朋友`}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          <Stat label="地点数量" value={total} />
          <Stat label="已生成" value={generated} />
          <Stat label="完成度" value={`${ratio}%`} accent />
        </div>

        <div className="mt-4">
          <MapRoutePreview locations={trip.locations} />
        </div>
      </div>

      {/* List */}
      {tab === 'list' && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-serifc text-lg">地点列表</div>
            <button
              onClick={() => nav(`/trip/${trip.id}/add-location`)}
              className="text-rose text-sm hover:underline"
            >
              ＋ 添加新地点
            </button>
          </div>
          <div className="space-y-3">
            {trip.locations.length === 0 && (
              <div className="paper-card p-6 text-center text-muted">
                还没有地点 — 添加一个开始整理回忆吧
              </div>
            )}
            {trip.locations.map((loc) => (
              <LocationCard key={loc.id} loc={loc} onDelete={onDeleteLoc} />
            ))}
          </div>
        </div>
      )}

      {tab === 'map' && (
        <div className="mt-5 paper-card p-4">
          <MapRoutePreview locations={trip.locations} height={260} />
          <div className="text-xs text-muted mt-2">真实地图后续接入</div>
        </div>
      )}

      {/* Bottom action */}
      <div className="fixed left-0 right-0 bottom-0 z-20 bg-paper2/95 backdrop-blur border-t border-[#e8dec2]">
        <div className="max-w-xl mx-auto px-4 py-2 grid grid-cols-3 gap-2 items-center">
          <TabBtn active={tab === 'map'} onClick={() => setTab('map')} icon="🗺️" label="地图" />
          <button
            onClick={() => nav(`/trip/${trip.id}/add-location`)}
            className="btn-primary -translate-y-3 mx-auto"
          >
            ＋
          </button>
          <TabBtn
            active={false}
            onClick={() => nav(`/trip/${trip.id}/journal`)}
            icon="📖"
            label="预览手账"
          />
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div className="text-center">
      <div className={`font-serifc text-2xl ${accent ? 'text-rose' : 'text-ink'}`}>{value}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  )
}

function TabBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center text-xs py-1 ${active ? 'text-rose' : 'text-muted'}`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  )
}
