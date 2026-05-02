import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTrip } from '../utils/storage.js'
import GeneratedMemoryCard from '../components/GeneratedMemoryCard.jsx'
import MemorySpotPage from '../components/MemorySpotPage.jsx'
import KeepsakeCard from '../components/KeepsakeCard.jsx'
import MapRoutePreview from '../components/MapRoutePreview.jsx'
import ShareModal from '../components/ShareModal.jsx'
import { composeLocationMemory, composeMemorySpot } from '../utils/mockGenerator.js'

export default function TravelJournalPreviewPage() {
  const { tripId } = useParams()
  const nav = useNavigate()
  const trip = getTrip(tripId)

  const pages = useMemo(() => {
    if (!trip) return []
    const list = [
      { kind: 'cover', title: '封面', toc: '封面', depth: 0 },
      { kind: 'map', title: '地图路线', toc: '地图路线', depth: 0 }
    ]
    trip.locations.forEach((loc, locIdx) => {
      list.push({
        kind: 'location',
        title: loc.locationName,
        toc: loc.locationName,
        depth: 0,
        location: loc,
        locIndex: locIdx
      })
      ;(loc.memorySpots || []).forEach((spot, spotIdx) => {
        list.push({
          kind: 'spot',
          title: spot.title,
          toc: spot.title,
          depth: 1,
          spot,
          location: loc,
          spotIndex: spotIdx
        })
      })
    })
    list.push({ kind: 'keepsakes', title: '纪念物', toc: '纪念物', depth: 0 })
    list.push({ kind: 'ending', title: '最后的话', toc: '最后的话', depth: 0 })
    return list
  }, [trip])

  const [idx, setIdx] = useState(0)
  const [shareOpen, setShareOpen] = useState(false)
  const exportRefs = useRef([])
  const setExportRef = (i) => (el) => {
    exportRefs.current[i] = el
  }
  const getExportElements = () => exportRefs.current.filter(Boolean)

  if (!trip) {
    return (
      <div className="p-6">
        找不到旅行 <button onClick={() => nav('/')} className="btn-ghost">回首页</button>
      </div>
    )
  }

  const current = pages[idx]

  const allKeepsakes = trip.locations.flatMap((loc) => {
    const fromMain = (loc.memoryInput?.keepsakes || []).map((name) => ({
      name,
      from: loc.locationName
    }))
    const fromSpots = (loc.memorySpots || []).flatMap((s) =>
      (s.keepsakes || []).map((name) => ({ name, from: s.title || loc.locationName }))
    )
    return [...fromMain, ...fromSpots]
  })

  const jumpToSpot = (locIdx, spotIdx) => {
    if (locIdx === undefined) return
    const targetLocId = trip.locations[locIdx]?.id
    const target = pages.findIndex(
      (p) => p.kind === 'spot' && p.location.id === targetLocId && p.spotIndex === spotIdx
    )
    if (target >= 0) setIdx(target)
  }

  return (
    <div className="min-h-screen px-3 md:px-6 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => nav(`/trip/${tripId}`)} className="btn-ghost">← 返回工作台</button>
          <div className="text-sm text-muted">整本手账预览</div>
          <button onClick={() => setShareOpen(true)} className="btn-ghost">↗ 分享</button>
        </div>

        <div className="grid md:grid-cols-[260px_1fr] gap-4">
          {/* TOC */}
          <aside className="paper-card p-4 md:sticky md:top-4 self-start max-h-[80vh] overflow-y-auto">
            <div className="font-serifc text-lg mb-3">目录</div>
            <ul className="space-y-1">
              {pages.map((p, i) => (
                <li key={i}>
                  <button
                    onClick={() => setIdx(i)}
                    className={`w-full text-left text-sm rounded-md px-2 py-1.5 transition flex items-center gap-2 ${
                      i === idx ? 'bg-rose text-white' : 'hover:bg-paper text-ink'
                    } ${p.depth === 1 ? 'pl-6' : ''}`}
                  >
                    <span className="flex-shrink-0">{iconFor(p)}</span>
                    <span className="truncate">{p.toc}</span>
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {/* book page */}
          <div className="paper-card p-5 md:p-8 min-h-[60vh] relative">
            <BookPage
              page={current}
              trip={trip}
              keepsakes={allKeepsakes}
              onSpotClick={(_, spotIdx) =>
                jumpToSpot(current.locIndex, spotIdx)
              }
            />
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#efe4cc]">
              <button
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx === 0}
                className="btn-secondary disabled:opacity-50"
              >
                ← 上一页
              </button>
              <div className="text-xs text-muted">
                {idx + 1} / {pages.length}
              </div>
              <button
                onClick={() => setIdx((i) => Math.min(pages.length - 1, i + 1))}
                disabled={idx === pages.length - 1}
                className="btn-primary disabled:opacity-50"
              >
                下一页 →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden offscreen container used by ShareModal to capture every page */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          left: '-100000px',
          top: 0,
          width: '900px',
          pointerEvents: 'none',
          zIndex: -1
        }}
      >
        {pages.map((p, i) => (
          <div
            key={i}
            ref={setExportRef(i)}
            className="paper-card p-8 mb-6"
            style={{ width: '900px', backgroundColor: '#fff8ec' }}
          >
            <BookPage page={p} trip={trip} keepsakes={allKeepsakes} />
          </div>
        ))}
      </div>

      {shareOpen && (
        <ShareModal
          trip={trip}
          getElements={getExportElements}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  )
}

const iconFor = (p) => {
  if (p.kind === 'cover') return '📔'
  if (p.kind === 'map') return '🗺️'
  if (p.kind === 'keepsakes') return '🎁'
  if (p.kind === 'ending') return '🌿'
  if (p.kind === 'spot') return '📌'
  return '📍'
}

function BookPage({ page, trip, keepsakes, onSpotClick }) {
  if (page.kind === 'cover') {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">🌧️</div>
        <h1 className="font-serifc text-3xl md:text-5xl">{trip.tripTitle}</h1>
        <div className="text-muted mt-3">
          {trip.startDate} - {trip.endDate}
        </div>
        <div className="flex justify-center flex-wrap gap-2 mt-4">
          {trip.tripStyle?.map((s) => (
            <span key={s} className="bg-cream px-3 py-1 rounded-full text-sm">{s}</span>
          ))}
        </div>
        <p className="text-muted mt-8 max-w-md mx-auto">
          把旅行里的小事，整理成了一本可以重新翻开的手账。
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <div className="polaroid rotate-[-3deg]">
            <img src="https://picsum.photos/seed/cover-a/240/180" className="w-44 h-32 object-cover rounded-sm" />
          </div>
          <div className="polaroid rotate-[3deg]">
            <img src="https://picsum.photos/seed/cover-b/240/180" className="w-44 h-32 object-cover rounded-sm" />
          </div>
        </div>
      </div>
    )
  }
  if (page.kind === 'map') {
    return (
      <div>
        <h2 className="font-serifc text-2xl mb-3">这趟路线</h2>
        <MapRoutePreview locations={trip.locations} height={260} />
        <ol className="mt-4 space-y-2">
          {trip.locations.map((loc) => (
            <li key={loc.id} className="flex items-center gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-rose text-white flex items-center justify-center text-xs">
                {loc.order}
              </span>
              <span className="font-medium">{loc.locationName}</span>
              {loc.locationTime && <span className="text-muted">· {loc.locationTime}</span>}
            </li>
          ))}
        </ol>
      </div>
    )
  }
  if (page.kind === 'location') {
    const content = composeLocationMemory(page.location)
    return (
      <GeneratedMemoryCard
        content={content}
        time={page.location.locationTime}
        showSpots={true}
        onSpotClick={onSpotClick}
      />
    )
  }
  if (page.kind === 'spot') {
    const content = composeMemorySpot(page.spot, page.location)
    return (
      <MemorySpotPage
        content={content}
        indexLabel={`小回忆 ${page.spotIndex + 1}`}
      />
    )
  }
  if (page.kind === 'keepsakes') {
    return (
      <div>
        <h2 className="font-serifc text-2xl mb-1">这趟旅行留下的东西</h2>
        <p className="text-muted text-sm mb-4">看似很小，但每一件都有自己的故事。</p>
        {keepsakes.length === 0 && (
          <div className="text-muted">这趟旅行还没记录纪念物。</div>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          {keepsakes.map((k, i) => (
            <KeepsakeCard
              key={i}
              name={k.name}
              description={`来自「${k.from}」`}
            />
          ))}
        </div>
      </div>
    )
  }
  if (page.kind === 'ending') {
    return (
      <div className="text-center py-10">
        <h2 className="font-serifc text-2xl mb-4">这趟旅行被收进手账了</h2>
        <p className="text-muted leading-7 max-w-md mx-auto">
          有些照片保存画面，<br />有些小事保存感觉。<br />
          谢谢你把它们留下来。
        </p>
        <div className="text-3xl mt-8">🌿</div>
      </div>
    )
  }
  return null
}
