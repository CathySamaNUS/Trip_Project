import { uid } from './id.js'

const KEEPSAKE_EMOJI = {
  茶: '🍵', 饮料: '🥤', 车票: '🎫', 小票: '🧾', 明信片: '📮', 雨衣: '🧥',
  花: '🌸', 贝壳: '🐚', 挂件: '🪧', 摆件: '🏮', 门票: '🎟️', 地图: '🗺️',
  照片: '🖼️', 小挂件: '🪬'
}

const guessEmoji = (name) => {
  for (const k of Object.keys(KEEPSAKE_EMOJI)) {
    if (name.includes(k)) return KEEPSAKE_EMOJI[k]
  }
  return '🌿'
}

const buildSubtitle = (loc) => {
  const m = loc.memoryInput || {}
  if (m.moodText && m.moodText.length > 0) return m.moodText
  if (m.moodTags?.length) return m.moodTags.slice(0, 3).join(' · ')
  if (m.oneLineMemory) return m.oneLineMemory
  return '一段被留下来的小事。'
}

const splitParagraphs = (text) => {
  if (!text) return []
  return text
    .split(/[。\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.endsWith('。') ? s : s + '。'))
}

export const composeLocationMemory = (location) => {
  const m = location.memoryInput || {}

  // narrative paragraphs: ONLY this location's main story.
  // people / spots / keepsakes are rendered as their own sections, not merged in.
  const paragraphs = []
  const oneLine = m.oneLineMemory?.trim()
  const detailLines = splitParagraphs(m.memorableDetailsText)

  if (oneLine) {
    paragraphs.push(oneLine.endsWith('。') ? oneLine : oneLine + '。')
  }
  if (detailLines.length > 0) {
    if (detailLines.length <= 2) {
      paragraphs.push(detailLines.join(''))
    } else {
      const mid = Math.ceil(detailLines.length / 2)
      paragraphs.push(detailLines.slice(0, mid).join(''))
      paragraphs.push(detailLines.slice(mid).join(''))
    }
  }
  if (paragraphs.length === 0) {
    paragraphs.push('这一刻没有写下太多，但它还留在你心里。')
  }

  const keepsakes = (m.keepsakes || []).map((name) => ({
    id: uid('ks'),
    name,
    emoji: guessEmoji(name),
    description: `这趟旅行从「${location.locationName}」带走的小东西。`
  }))

  // include memorySpot keepsakes too
  ;(location.memorySpots || []).forEach((spot) => {
    ;(spot.keepsakes || []).forEach((name) => {
      if (!keepsakes.find((k) => k.name === name)) {
        keepsakes.push({
          id: uid('ks'),
          name,
          emoji: guessEmoji(name),
          description: `来自「${spot.title || location.locationName}」的小东西。`
        })
      }
    })
  })

  const peopleCards = (m.people || []).map((p) => ({
    id: p.id || uid('pc'),
    name: p.personName || '一位旅途中遇到的人',
    description: [p.personAction, p.personFeeling].filter(Boolean).join(' · ')
  }))

  const quote = m.quote || ''

  const photoGroup = {
    title: '这一段照片',
    photos: (location.photos || []).slice(0, 8)
  }

  const spotRefs = (location.memorySpots || []).map((s) => ({
    id: s.id,
    title: s.title || '小回忆点',
    shortText: s.shortText || ''
  }))

  let endingSentence = '这一刻被留下来了。'
  if (m.moodTags?.includes('温暖') || m.moodTags?.includes('治愈')) {
    endingSentence = '雨没有停，但有一段被收起来了。'
  } else if (m.moodTags?.includes('狼狈')) {
    endingSentence = '走错的那段路，后来也变成了故事。'
  } else if (m.moodTags?.includes('热闹')) {
    endingSentence = '人群散开以后，这一段还热着。'
  }

  return {
    title: location.locationName || '这个地点',
    subtitle: buildSubtitle(location),
    paragraphs,
    keepsakes,
    peopleCards,
    quote,
    photoGroup,
    spotRefs,
    endingSentence
  }
}

export const composeMemorySpot = (spot, location) => {
  const photoMap = new Map((location?.photos || []).map((p) => [p.id, p]))
  const photos = (spot.photoIds || []).map((id) => photoMap.get(id)).filter(Boolean)
  const cover = photos[0] || (location?.photos || [])[0] || null

  const paragraphs = []
  if (spot.shortText) {
    spot.shortText
      .split(/\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((p) => paragraphs.push(p.endsWith('。') ? p : p + '。'))
  }
  if (paragraphs.length === 0) {
    paragraphs.push('这一刻没有写下太多，但它还留在你心里。')
  }

  const keepsakes = (spot.keepsakes || []).map((name) => ({
    id: uid('ks'),
    name,
    emoji: guessEmoji(name),
    description: `来自「${spot.title || location?.locationName || ''}」的小东西。`
  }))

  const peopleCards = (spot.people || []).map((p) => ({
    id: p.id || uid('pc'),
    name: p.personName || '一位旅途中遇到的人',
    description: [p.personAction, p.personFeeling].filter(Boolean).join(' · ')
  }))

  let subtitle = ''
  if (spot.moodTags?.length) subtitle = spot.moodTags.slice(0, 3).join(' · ')

  return {
    title: spot.title || '小回忆点',
    subtitle,
    paragraphs,
    keepsakes,
    peopleCards,
    quote: spot.quote || '',
    photoGroup: { title: '这一刻的画面', photos },
    cover,
    parentLocationName: location?.locationName || ''
  }
}
