import { useNavigate } from 'react-router-dom'
import { PrimaryButton, SecondaryButton } from '../components/Buttons.jsx'
import { ensureSampleTrip } from '../utils/sampleData.js'

const features = [
  { icon: '🗺️', title: '地点地图', desc: '用地点串起整趟旅行' },
  { icon: '✏️', title: '小事记录', desc: '保存以后容易忘记的细节' },
  { icon: '🪄', title: '自动整理', desc: '不用写长游记，几个关键词也可以' },
  { icon: '👥', title: '共同创作', desc: '朋友也能一起补照片、补回忆' }
]

export default function HomePage() {
  const nav = useNavigate()

  const onSample = () => {
    const id = ensureSampleTrip()
    nav(`/trip/${id}/journal`)
  }

  return (
    <div className="min-h-full max-w-5xl mx-auto px-5 py-10 md:py-14">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="paper-card p-7 md:p-9 relative tape">
          <div className="text-xs text-muted tracking-widest mb-2">📷 旅行回忆手账生成器</div>
          <h1 className="font-serifc text-3xl md:text-4xl leading-snug">
            把旅行里的小事，<br />整理成一本可以<br />重新翻开的手账
          </h1>
          <p className="text-muted mt-4">
            上传照片，补充一点小事和感觉，生成属于你的旅行回忆手账。
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.title} className="bg-white/70 rounded-xl p-3 border border-[#e8dec2]">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{f.icon}</span>
                  <span className="font-medium">{f.title}</span>
                </div>
                <div className="text-xs text-muted mt-1">{f.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <PrimaryButton onClick={() => nav('/create-trip')}>创建我的旅行</PrimaryButton>
            <SecondaryButton onClick={onSample}>查看示例手账</SecondaryButton>
          </div>
        </div>

        <div className="relative h-[420px] hidden md:block">
          <div className="absolute top-2 left-10 polaroid rotate-[-6deg] w-56">
            <img src="https://picsum.photos/seed/trip-cover-1/400/300" className="w-full h-40 object-cover rounded-sm" />
            <div className="text-center text-xs text-muted mt-1">雨天的小巷</div>
          </div>
          <div className="absolute top-32 left-44 polaroid rotate-[4deg] w-56 z-10">
            <img src="https://picsum.photos/seed/trip-cover-2/400/300" className="w-full h-40 object-cover rounded-sm" />
            <div className="text-center text-xs text-muted mt-1">店里的猫</div>
          </div>
          <div className="absolute top-64 left-20 polaroid rotate-[-2deg] w-56">
            <img src="https://picsum.photos/seed/trip-cover-3/400/300" className="w-full h-40 object-cover rounded-sm" />
            <div className="text-center text-xs text-muted mt-1">老板请的茶</div>
          </div>
          <div className="absolute -top-6 right-8 text-3xl rotate-12">📌</div>
          <div className="absolute bottom-2 right-12 text-3xl rotate-[-12deg]">🌿</div>
        </div>
      </div>

      <div className="text-center text-xs text-muted mt-12">
        所有数据保存在你的浏览器里 · 暂未连接服务端
      </div>
    </div>
  )
}
