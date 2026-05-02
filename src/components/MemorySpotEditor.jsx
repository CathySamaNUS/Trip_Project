import { useState } from 'react'
import { uid } from '../utils/id.js'
import { MOOD_TAGS, KEEPSAKE_PRESETS } from '../utils/constants.js'
import StickerTag from './StickerTag.jsx'
import { PrimaryButton, SecondaryButton } from './Buttons.jsx'

export default function MemorySpotEditor({ initial, photos = [], onSave, onCancel }) {
  const [spot, setSpot] = useState(
    initial || {
      id: uid('ms'),
      title: '',
      shortText: '',
      photoIds: [],
      moodTags: [],
      keepsakes: [],
      people: [],
      quote: ''
    }
  )
  const [keepsakeInput, setKeepsakeInput] = useState('')

  const togglePhoto = (id) => {
    setSpot((s) => ({
      ...s,
      photoIds: s.photoIds.includes(id)
        ? s.photoIds.filter((x) => x !== id)
        : [...s.photoIds, id]
    }))
  }
  const toggleMood = (m) =>
    setSpot((s) => ({
      ...s,
      moodTags: s.moodTags.includes(m)
        ? s.moodTags.filter((x) => x !== m)
        : [...s.moodTags, m]
    }))
  const toggleKeep = (k) =>
    setSpot((s) => ({
      ...s,
      keepsakes: s.keepsakes.includes(k)
        ? s.keepsakes.filter((x) => x !== k)
        : [...s.keepsakes, k]
    }))

  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-end md:items-center justify-center p-2 md:p-6">
      <div className="paper-card w-full max-w-lg p-5 max-h-[90vh] overflow-y-auto">
        <div className="font-serifc text-lg mb-3">
          {initial ? '编辑小回忆点' : '添加一个小回忆点'}
        </div>

        <label className="label">小片段名称</label>
        <input
          className="field mb-3"
          placeholder="比如：老板请茶 / 店里的猫 / 买下小挂件"
          value={spot.title}
          onChange={(e) => setSpot({ ...spot, title: e.target.value })}
        />

        <label className="label">这里发生了什么</label>
        <textarea
          className="field mb-3 min-h-[80px]"
          placeholder="一句话就可以。"
          value={spot.shortText}
          onChange={(e) => setSpot({ ...spot, shortText: e.target.value })}
        />

        {photos.length > 0 && (
          <>
            <label className="label">关联照片</label>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
              {photos.map((p) => {
                const active = spot.photoIds.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePhoto(p.id)}
                    className={`flex-shrink-0 rounded-md overflow-hidden border-2 ${
                      active ? 'border-rose' : 'border-transparent'
                    }`}
                  >
                    <img src={p.url} alt="" className="w-16 h-16 object-cover" />
                  </button>
                )
              })}
            </div>
          </>
        )}

        <label className="label">感觉</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {MOOD_TAGS.map((m) => (
            <StickerTag
              key={m}
              label={m}
              variant="mood"
              active={spot.moodTags.includes(m)}
              onClick={() => toggleMood(m)}
            />
          ))}
        </div>

        <label className="label">留下的东西</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {[...new Set([...KEEPSAKE_PRESETS, ...spot.keepsakes])].map((k) => (
            <StickerTag
              key={k}
              label={k}
              active={spot.keepsakes.includes(k)}
              onClick={() => toggleKeep(k)}
            />
          ))}
        </div>
        <div className="flex gap-2 mb-3">
          <input
            className="field flex-1"
            placeholder="自定义一个，比如：店主送的明信片"
            value={keepsakeInput}
            onChange={(e) => setKeepsakeInput(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              const v = keepsakeInput.trim()
              if (v && !spot.keepsakes.includes(v)) {
                setSpot({ ...spot, keepsakes: [...spot.keepsakes, v] })
              }
              setKeepsakeInput('')
            }}
            className="btn-secondary"
          >
            添加
          </button>
        </div>

        <label className="label">想保留的一句话（可选）</label>
        <input
          className="field mb-4"
          placeholder="比如：老板说……"
          value={spot.quote}
          onChange={(e) => setSpot({ ...spot, quote: e.target.value })}
        />

        <div className="flex gap-3 justify-end">
          <SecondaryButton onClick={onCancel}>取消</SecondaryButton>
          <PrimaryButton onClick={() => onSave(spot)}>保存</PrimaryButton>
        </div>
      </div>
    </div>
  )
}
