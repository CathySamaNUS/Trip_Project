export default function SectionTitle({ index, title, hint, right }) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-serifc text-lg text-ink flex items-center gap-2">
          {index !== undefined && (
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose text-white text-xs">
              {index}
            </span>
          )}
          <span>{title}</span>
        </h3>
        {right}
      </div>
      {hint && <p className="text-sm text-muted mt-1">{hint}</p>}
    </div>
  )
}
