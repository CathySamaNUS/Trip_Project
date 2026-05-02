import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  DETAIL_TAGS,
  MOOD_TAGS,
  KEEPSAKE_PRESETS
} from '../utils/constants.js'
import {
  getTrip,
  updateLocation,
  saveLocationDraft,
  getLocationDraft,
  clearLocationDraft,
  emptyMemoryInput
} from '../utils/storage.js'
import { uid } from '../utils/id.js'
import { composeLocationMemory } from '../utils/mockGenerator.js'
import StickerTag from '../components/StickerTag.jsx'
import SectionTitle from '../components/SectionTitle.jsx'
import CollapsiblePanel from '../components/CollapsiblePanel.jsx'
import PhotoUploader from '../components/PhotoUploader.jsx'
import { PrimaryButton, SecondaryButton } from '../components/Buttons.jsx'
import { useToast } from '../components/Toast.jsx'

export default function LocationMemoryInputPage() {
  const { tripId, locationId } = useParams()
  const nav = useNavigate()
  const toast = useToast()
  const trip = getTrip(tripId)
  const location = trip?.locations.find((l) => l.id === locationId)

  const initial = useMemo(() => {
    const draft = getLocationDraft(tripId, locationId)
    if (draft) return draft
    return {
      photos: location?.photos || [],
      memoryInput: { ...emptyMemoryInput(), ...(location?.memoryInput || {}) }
    }
  }, [tripId, locationId, location])

  const [photos, setPhotos] = useState(initial.photos)
  const [m, setM] = useState(initial.memoryInput)

  // custom detail tag input
  const [customDetail, setCustomDetail] = useState('')
  const [customDetailList, setCustomDetailList] = useState(
    (initial.memoryInput.memorableDetailTags || []).filter((t) => !DETAIL_TAGS.includes(t))
  )

  // keepsake input
  const [keepsakeInput, setKeepsakeInput] = useState('')

  // auto-save draft (debounced) so refresh doesn't lose anything
  useEffect(() => {
    if (!tripId || !locationId) return
    const t = setTimeout(() => {
      saveLocationDraft(tripId, locationId, { photos, memoryInput: m })
    }, 600)
    return () => clearTimeout(t)
  }, [tripId, locationId, photos, m])

  // also persist on tab close / page hide
  useEffect(() => {
    const onHide = () => saveLocationDraft(tripId, locationId, { photos, memoryInput: m })
    window.addEventListener('beforeunload', onHide)
    document.addEventListener('visibilitychange', onHide)
    return () => {
      window.removeEventListener('beforeunload', onHide)
      document.removeEventListener('visibilitychange', onHide)
    }
  }, [tripId, locationId, photos, m])

  const allDetailTags = useMemo(
    () => [...DETAIL_TAGS, ...customDetailList],
    [customDetailList]
  )

  if (!trip || !location) {
    return (
      <div className="p-6">
        找不到地点。 <button className="btn-ghost" onClick={() => nav('/')}>回首页</button>
      </div>
    )
  }

  const toggleDetail = (t) =>
    setM((s) => ({
      ...s,
      memorableDetailTags: s.memorableDetailTags.includes(t)
        ? s.memorableDetailTags.filter((x) => x !== t)
        : [...s.memorableDetailTags, t]
    }))

  const toggleMood = (t) =>
    setM((s) => {
      const has = s.moodTags.includes(t)
      if (!has && s.moodTags.length >= 3) {
        toast('选 1–3 个就好，太多会让文案不够聚焦')
        return s
      }
      return {
        ...s,
        moodTags: has ? s.moodTags.filter((x) => x !== t) : [...s.moodTags, t]
      }
    })

  const addCustomDetail = () => {
    const v = customDetail.trim()
    if (!v) return
    if (!customDetailList.includes(v) && !DETAIL_TAGS.includes(v)) {
      setCustomDetailList((s) => [...s, v])
    }
    setM((s) => ({
      ...s,
      memorableDetailTags: s.memorableDetailTags.includes(v)
        ? s.memorableDetailTags
        : [...s.memorableDetailTags, v]
    }))
    setCustomDetail('')
  }

  const togglePresetKeepsake = (k) => {
    setM((s) => ({
      ...s,
      keepsakes: s.keepsakes.includes(k)
        ? s.keepsakes.filter((x) => x !== k)
        : [...s.keepsakes, k]
    }))
  }
  const addCustomKeepsake = () => {
    const v = keepsakeInput.trim()
    if (!v) return
    if (!m.keepsakes.includes(v)) {
      setM((s) => ({ ...s, keepsakes: [...s.keepsakes, v] }))
    }
    setKeepsakeInput('')
  }

  const addPerson = () =>
    setM((s) => ({
      ...s,
      people: [
        ...s.people,
        { id: uid('per'), personName: '', personAction: '', personFeeling: '' }
      ]
    }))
  const updatePerson = (id, patch) =>
    setM((s) => ({
      ...s,
      people: s.people.map((p) => (p.id === id ? { ...p, ...patch } : p))
    }))
  const removePerson = (id) =>
    setM((s) => ({ ...s, people: s.people.filter((p) => p.id !== id) }))

  const persistDraft = () => saveLocationDraft(tripId, locationId, { photos, memoryInput: m })
  const onSaveDraft = () => {
    persistDraft()
    toast('草稿已保存')
  }

  const goManageSpots = () => {
    persistDraft()
    updateLocation(tripId, locationId, { photos, memoryInput: m })
    nav(`/trip/${tripId}/location/${locationId}/spots`)
  }

  const finishToPreview = () => {
    const updated = updateLocation(tripId, locationId, {
      photos,
      memoryInput: m
    })
    const generated = composeLocationMemory(updated)
    updateLocation(tripId, locationId, { generatedContent: generated })
    clearLocationDraft(tripId, locationId)
    nav(`/trip/${tripId}/location/${locationId}/preview`)
  }

  const skipDirectGenerate = () => {
    finishToPreview()
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-12">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => nav(`/trip/${tripId}`)} className="btn-ghost">← 返回工作台</button>
        <div className="flex gap-1">
          <button onClick={onSaveDraft} className="btn-ghost">保存草稿</button>
          <button onClick={() => alert('地图位置功能后续接入')} className="btn-ghost">📍 查看地图位置</button>
        </div>
      </div>

      <div className="paper-card p-5 tape mb-4">
        <h1 className="font-serifc text-2xl">
          为「{location.locationName}」<br />补充一点回忆
        </h1>
        <p className="text-muted text-sm mt-1">
          不用写很多，几个关键词也可以，我们会帮你整理成一页旅行手账 ✨
        </p>
      </div>

      {/* 1 photos */}
      <div className="paper-card p-5 mb-4">
        <SectionTitle index={1} title="上传照片" hint="可以多传几张：场景、人、食物、纪念品都可以。" />
        <PhotoUploader photos={photos} onChange={setPhotos} />
      </div>

      {/* 2 oneLine */}
      <div className="paper-card p-5 mb-4">
        <SectionTitle index={2} title="这里发生了什么？" hint="一句话就可以，帮我们了解这段经历。" />
        <textarea
          className="field min-h-[80px]"
          maxLength={100}
          placeholder="比如：老板请我们喝茶，店里有很多猫，我买了一个小挂件。"
          value={m.oneLineMemory}
          onChange={(e) => setM({ ...m, oneLineMemory: e.target.value })}
        />
        <div className="text-right text-xs text-muted mt-1">{m.oneLineMemory.length}/100</div>
      </div>

      {/* 3 details */}
      <div className="paper-card p-5 mb-4">
        <SectionTitle
          index={3}
          title="有什么小事不想忘？"
          hint="写几个关键词或一两句话都可以。下面的标签可以帮你找灵感。"
        />
        <textarea
          className="field min-h-[110px]"
          maxLength={300}
          placeholder="比如：刚才还关着的店突然开了，雨声被留在门外，老板倒了茶，猫懒懒地趴在角落。"
          value={m.memorableDetailsText}
          onChange={(e) => setM({ ...m, memorableDetailsText: e.target.value })}
        />
        <div className="text-right text-xs text-muted mt-1 mb-3">{m.memorableDetailsText.length}/300</div>
        <div className="flex flex-wrap gap-2">
          {allDetailTags.map((t) => (
            <StickerTag
              key={t}
              label={t}
              active={m.memorableDetailTags.includes(t)}
              onClick={() => toggleDetail(t)}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <input
            className="field flex-1"
            placeholder="＋ 添加一个小事，比如：被狗叫醒"
            value={customDetail}
            onChange={(e) => setCustomDetail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomDetail())}
          />
          <button onClick={addCustomDetail} className="btn-secondary">添加</button>
        </div>
      </div>

      {/* 4 mood */}
      <div className="paper-card p-5 mb-4">
        <SectionTitle
          index={4}
          title="这个地点给你的感觉是？"
          hint="可以选 1–3 个词，也可以自己写一句。"
        />
        <div className="flex flex-wrap gap-2 mb-3">
          {MOOD_TAGS.map((t) => (
            <StickerTag
              key={t}
              label={t}
              variant="mood"
              active={m.moodTags.includes(t)}
              onClick={() => toggleMood(t)}
            />
          ))}
        </div>
        <textarea
          className="field min-h-[64px]"
          maxLength={100}
          placeholder="比如：像是在一场雨里误打误撞得到了一点温柔。"
          value={m.moodText}
          onChange={(e) => setM({ ...m, moodText: e.target.value })}
        />
        <div className="text-right text-xs text-muted mt-1">{m.moodText.length}/100</div>
      </div>

      {/* 5 collapsibles */}
      <CollapsiblePanel title="遇见的人（可选）" hint="记一记旅途中印象深的某个人">
        {m.people.map((p) => (
          <div key={p.id} className="border border-[#e8dec2] rounded-xl p-3 mb-3 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted">人物</div>
              <button onClick={() => removePerson(p.id)} className="text-xs text-rose">移除</button>
            </div>
            <input
              className="field mb-2"
              placeholder="人物称呼：葱油饼店老板"
              value={p.personName}
              onChange={(e) => updatePerson(p.id, { personName: e.target.value })}
            />
            <input
              className="field mb-2"
              placeholder="他/她做了什么：请我们喝茶，讲了自己为什么在这里开店。"
              value={p.personAction}
              onChange={(e) => updatePerson(p.id, { personAction: e.target.value })}
            />
            <input
              className="field"
              placeholder="他/她给你的感觉：热情、温暖、很有故事。"
              value={p.personFeeling}
              onChange={(e) => updatePerson(p.id, { personFeeling: e.target.value })}
            />
          </div>
        ))}
        <button onClick={addPerson} className="btn-secondary w-full">＋ 添加一个人物</button>
      </CollapsiblePanel>

      <CollapsiblePanel title="留下的东西（可选）" hint="可以买的、收到的，也可以是一个很小的物件。">
        <div className="flex flex-wrap gap-2 mb-3">
          {[...new Set([...KEEPSAKE_PRESETS, ...m.keepsakes])].map((k) => (
            <StickerTag
              key={k}
              label={k}
              active={m.keepsakes.includes(k)}
              onClick={() => togglePresetKeepsake(k)}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="field flex-1"
            placeholder="自定义一个，比如：店主送的明信片"
            value={keepsakeInput}
            onChange={(e) => setKeepsakeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomKeepsake())}
          />
          <button onClick={addCustomKeepsake} className="btn-secondary">添加</button>
        </div>
      </CollapsiblePanel>

      <CollapsiblePanel title="想保留的一句话（可选）" hint="一句被记住的话，往往胜过一张照片。">
        <textarea
          className="field min-h-[64px]"
          placeholder='比如：老板说："我就是喜欢这个地方，所以在这里开店。"'
          value={m.quote}
          onChange={(e) => setM({ ...m, quote: e.target.value })}
        />
      </CollapsiblePanel>

      <div className="paper-card p-3 mt-4 flex items-center justify-between gap-3">
        <SecondaryButton onClick={goManageSpots} className="flex-1 !px-3">
          管理小回忆点
        </SecondaryButton>
      </div>

      <div className="flex gap-3 mt-4">
        <SecondaryButton className="flex-1" onClick={skipDirectGenerate}>
          先跳过，直接生成
        </SecondaryButton>
        <PrimaryButton className="flex-1" onClick={finishToPreview}>
          整理成手账页 ✨
        </PrimaryButton>
      </div>
    </div>
  )
}
