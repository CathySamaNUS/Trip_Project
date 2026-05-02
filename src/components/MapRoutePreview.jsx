export default function MapRoutePreview({ locations = [], height = 180 }) {
  const pins = locations.length || 0
  const positions = Array.from({ length: pins }).map((_, i) => {
    const t = pins === 1 ? 0.5 : i / (pins - 1)
    return {
      x: 12 + t * 76 + (i % 2 === 0 ? 0 : 4),
      y: 30 + ((i * 17) % 50)
    }
  })

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-[#e8dec2]"
      style={{
        height,
        background:
          'linear-gradient(135deg, #eef3e6 0%, #e6efe1 60%, #f3eedc 100%)'
      }}
    >
      {/* roads */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-50">
        <path d="M0,80 Q30,60 50,70 T100,30" stroke="#cdbf9d" strokeWidth="0.5" fill="none" />
        <path d="M0,30 Q40,10 70,40 T100,70" stroke="#cdbf9d" strokeWidth="0.5" fill="none" />
        <path d="M20,0 L25,100" stroke="#dbcfa9" strokeWidth="0.4" fill="none" />
        <path d="M70,0 L60,100" stroke="#dbcfa9" strokeWidth="0.4" fill="none" />
      </svg>

      {/* dashed route */}
      {pins > 1 && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <polyline
            points={positions.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#ef7f8f"
            strokeWidth="0.6"
            strokeDasharray="2 1.5"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* pins */}
      {positions.map((p, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          title={locations[i]?.locationName}
        >
          <div className="flex flex-col items-center">
            <div className="bg-rose text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-soft">
              {i + 1}
            </div>
            <div className="w-0.5 h-1.5 bg-rose"></div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur text-xs text-muted rounded-full px-3 py-1 border border-[#e8dec2]">
        路线预览
      </div>
    </div>
  )
}
