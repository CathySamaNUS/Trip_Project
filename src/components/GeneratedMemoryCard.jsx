import KeepsakeCard from './KeepsakeCard.jsx'
import { useLightbox } from './Lightbox.jsx'

function SectionHeading({ children }) {
  return (
    <div className="flex items-center gap-2 mt-7 mb-3">
      <span className="w-1.5 h-4 bg-rose rounded-sm" />
      <h3 className="font-serifc text-lg text-ink">{children}</h3>
    </div>
  )
}

function ClickablePhoto({ photo, photos, index, className = '', size = 'md' }) {
  const { open } = useLightbox()
  const isLg = size === 'lg'
  const thumbHeight = size === 'sm' ? 'h-20' : 'h-32'
  return (
    <button
      type="button"
      onClick={() => open(photos, index)}
      className={`polaroid block ${className} hover:shadow-lg transition`}
      title="点击查看大图"
    >
      <img
        src={photo.url}
        alt={photo.name || ''}
        className={
          isLg
            ? 'w-full h-auto max-h-[70vh] rounded-sm'
            : `${thumbHeight} w-auto rounded-sm`
        }
      />
      {photo.name && !isLg && (
        <div className="text-center text-[10px] text-muted mt-1 truncate max-w-[8rem]">
          {photo.name}
        </div>
      )}
    </button>
  )
}

export default function GeneratedMemoryCard({
  content,
  time,
  showSpots = true,
  onSpotClick
}) {
  if (!content) return null
  const photos = content.photoGroup?.photos || []
  const cover = photos.find((p) => p.isCover) || photos[0]
  const restPhotos = cover ? photos.filter((p) => p !== cover) : photos

  return (
    <article className="paper-card p-5 md:p-7 relative">
      <div className="absolute -top-3 left-8 w-20 h-4 bg-[rgba(255,220,180,0.7)] rotate-[-3deg] rounded-sm shadow-soft" />

      {time && <div className="text-sm text-muted">{time}</div>}
      <h2 className="font-serifc text-2xl text-ink mt-1">{content.title}</h2>
      {content.subtitle && <p className="text-muted italic mt-1">{content.subtitle}</p>}

      {cover && (
        <div className="mt-4">
          <ClickablePhoto
            photo={cover}
            photos={photos}
            index={photos.indexOf(cover)}
            size="lg"
            className="inline-block rotate-[-1deg] max-w-md"
          />
        </div>
      )}

      <SectionHeading>这里发生了什么</SectionHeading>
      <div className="leading-7 text-ink space-y-3">
        {content.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {content.peopleCards?.length > 0 && (
        <>
          <SectionHeading>遇见的人</SectionHeading>
          <div className="space-y-2">
            {content.peopleCards.map((p) => (
              <div key={p.id} className="paper-card p-3">
                <div className="font-medium">👤 {p.name}</div>
                <div className="text-sm text-muted mt-1">{p.description}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {showSpots && content.spotRefs?.length > 0 && (
        <>
          <SectionHeading>这里的小回忆点</SectionHeading>
          <div className="space-y-2">
            {content.spotRefs.map((s, i) => (
              <button
                key={s.id}
                onClick={() => onSpotClick?.(s, i)}
                className="w-full text-left paper-card p-3 hover:border-rose hover:shadow-md transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-cream flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                  <div className="font-medium">📌 {s.title}</div>
                  {onSpotClick && <span className="ml-auto text-xs text-rose">展开 →</span>}
                </div>
                {s.shortText && (
                  <div className="text-sm text-muted mt-1 line-clamp-2 pl-8">
                    {s.shortText}
                  </div>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {content.keepsakes?.length > 0 && (
        <>
          <SectionHeading>这一刻留下了</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {content.keepsakes.map((k) => (
              <KeepsakeCard key={k.id} {...k} />
            ))}
          </div>
        </>
      )}

      {restPhotos.length > 0 && (
        <>
          <SectionHeading>{content.photoGroup?.title || '这一段照片'}</SectionHeading>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {restPhotos.map((p, i) => (
              <ClickablePhoto
                key={p.id}
                photo={p}
                photos={photos}
                index={photos.indexOf(p)}
                size="md"
                className={`flex-shrink-0 ${i % 2 ? 'rotate-[1deg]' : 'rotate-[-1deg]'}`}
              />
            ))}
          </div>
        </>
      )}

      {content.quote && (
        <>
          <SectionHeading>想保留的一句话</SectionHeading>
          <blockquote className="border-l-4 border-rose pl-4 italic text-ink/80 bg-cream/40 py-2 rounded-r-md">
            {content.quote}
          </blockquote>
        </>
      )}

      {content.endingSentence && (
        <div className="mt-8 text-center text-muted text-sm">
          — {content.endingSentence} —
        </div>
      )}
    </article>
  )
}

export { ClickablePhoto, SectionHeading }
