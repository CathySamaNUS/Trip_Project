import KeepsakeCard from './KeepsakeCard.jsx'
import { ClickablePhoto, SectionHeading } from './GeneratedMemoryCard.jsx'

export default function MemorySpotPage({ content, indexLabel }) {
  if (!content) return null
  const photos = content.photoGroup?.photos || []
  const cover = content.cover
  const restPhotos = cover ? photos.filter((p) => p.id !== cover.id) : photos

  return (
    <article className="paper-card p-5 md:p-7 relative">
      <div className="absolute -top-3 left-8 w-24 h-4 bg-[rgba(200,216,184,0.7)] rotate-[-3deg] rounded-sm shadow-soft" />

      <div className="flex items-center gap-2 text-sm text-muted">
        {indexLabel && (
          <span className="bg-cream px-2 py-0.5 rounded-full text-xs">
            {indexLabel}
          </span>
        )}
        <span>来自「{content.parentLocationName}」</span>
      </div>
      <h2 className="font-serifc text-2xl text-ink mt-2">📌 {content.title}</h2>
      {content.subtitle && (
        <p className="text-muted italic mt-1">{content.subtitle}</p>
      )}

      {cover && (
        <div className="mt-4">
          <ClickablePhoto
            photo={cover}
            photos={photos}
            index={photos.indexOf(cover)}
            size="lg"
            className="inline-block rotate-[1deg] max-w-md"
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
          <SectionHeading>这一刻的画面</SectionHeading>
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
    </article>
  )
}
