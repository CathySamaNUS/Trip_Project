import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TRIP_STYLES } from '../utils/constants.js'
import { createTrip } from '../utils/storage.js'
import StickerTag from '../components/StickerTag.jsx'
import { PrimaryButton } from '../components/Buttons.jsx'

export default function CreateTripPage() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    tripTitle: '',
    startDate: '',
    endDate: '',
    tripStyle: [],
    companionsText: ''
  })

  const toggleStyle = (s) =>
    setForm((f) => ({
      ...f,
      tripStyle: f.tripStyle.includes(s) ? f.tripStyle.filter((x) => x !== s) : [...f.tripStyle, s]
    }))

  const submit = () => {
    if (!form.tripTitle.trim()) {
      alert('给这趟旅行起一个名字吧～')
      return
    }
    const trip = createTrip({
      tripTitle: form.tripTitle.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      tripStyle: form.tripStyle,
      companions: form.companionsText
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
    })
    nav(`/trip/${trip.id}`)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <button onClick={() => nav('/')} className="btn-ghost mb-3">← 返回首页</button>
      <div className="paper-card p-6 tape">
        <h1 className="font-serifc text-2xl text-center mb-1">创建一次旅行 ✈️</h1>
        <p className="text-center text-muted text-sm mb-6">和谁一起出发，谁的回忆都很重要 💛</p>

        <label className="label">旅行名称</label>
        <input
          className="field mb-4"
          placeholder="比如：台湾雨天旅行"
          value={form.tripTitle}
          onChange={(e) => setForm({ ...form, tripTitle: e.target.value })}
        />

        <label className="label">旅行时间</label>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="date"
            className="field"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
          />
          <span className="text-muted">→</span>
          <input
            type="date"
            className="field"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
          />
        </div>

        <label className="label">旅行风格</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {TRIP_STYLES.map((s) => (
            <StickerTag
              key={s}
              label={s}
              active={form.tripStyle.includes(s)}
              onClick={() => toggleStyle(s)}
            />
          ))}
        </div>

        <label className="label">同行人（可选）</label>
        <input
          className="field mb-6"
          placeholder="输入同行人昵称，用逗号分隔"
          value={form.companionsText}
          onChange={(e) => setForm({ ...form, companionsText: e.target.value })}
        />

        <PrimaryButton className="w-full" onClick={submit}>
          创建旅行
        </PrimaryButton>
      </div>
    </div>
  )
}
