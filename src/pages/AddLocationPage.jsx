import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LOCATION_TYPES } from '../utils/constants.js'
import { addLocation, getTrip } from '../utils/storage.js'
import StickerTag from '../components/StickerTag.jsx'
import { PrimaryButton } from '../components/Buttons.jsx'

export default function AddLocationPage() {
  const { tripId } = useParams()
  const nav = useNavigate()
  const trip = getTrip(tripId)
  const [form, setForm] = useState({
    locationName: '',
    locationType: '',
    locationTime: '',
    order: (trip?.locations?.length || 0) + 1
  })

  if (!trip) {
    return (
      <div className="p-6">
        找不到这趟旅行 <button onClick={() => nav('/')} className="btn-ghost">返回</button>
      </div>
    )
  }

  const submit = () => {
    if (!form.locationName.trim()) {
      alert('给这个地点起一个名字吧')
      return
    }
    const loc = addLocation(tripId, {
      ...form,
      locationName: form.locationName.trim()
    })
    nav(`/trip/${tripId}/location/${loc.id}/input`)
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 pb-12">
      <button onClick={() => nav(`/trip/${tripId}`)} className="btn-ghost mb-3">← 返回工作台</button>

      <div className="paper-card p-6 tape">
        <h1 className="font-serifc text-2xl mb-4">添加一个地点</h1>

        <label className="label">地点名称</label>
        <input
          className="field mb-4"
          placeholder="比如：彩虹葱油饼店"
          value={form.locationName}
          onChange={(e) => setForm({ ...form, locationName: e.target.value })}
        />

        <label className="label">地点类型（可选）</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {LOCATION_TYPES.map((t) => (
            <StickerTag
              key={t}
              label={t}
              active={form.locationType === t}
              onClick={() => setForm({ ...form, locationType: form.locationType === t ? '' : t })}
            />
          ))}
        </div>

        <label className="label">时间（可选）</label>
        <input
          className="field mb-4"
          placeholder="比如：傍晚 / 第一天晚上 / 雨变大的时候"
          value={form.locationTime}
          onChange={(e) => setForm({ ...form, locationTime: e.target.value })}
        />

        <label className="label">地图位置（可选）</label>
        <button
          type="button"
          onClick={() => alert('地图位置功能后续接入')}
          className="w-full bg-white border border-dashed border-[#e0d4b6] rounded-xl p-4 text-left hover:border-rose hover:text-rose transition mb-4"
        >
          <div className="flex items-center gap-2">
            <span>📍</span>
            <div>
              <div className="font-medium">选择地图位置</div>
              <div className="text-xs text-muted">地图位置功能后续接入</div>
            </div>
          </div>
        </button>

        <label className="label">在旅行中的顺序</label>
        <div className="flex items-center gap-3 mb-6">
          <button
            className="btn-secondary !px-4"
            onClick={() => setForm({ ...form, order: Math.max(1, form.order - 1) })}
          >
            －
          </button>
          <input
            type="number"
            min="1"
            className="field w-24 text-center"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 1 })}
          />
          <button
            className="btn-secondary !px-4"
            onClick={() => setForm({ ...form, order: form.order + 1 })}
          >
            ＋
          </button>
        </div>

        <PrimaryButton className="w-full" onClick={submit}>
          下一步：补充地点回忆
        </PrimaryButton>
      </div>
    </div>
  )
}
