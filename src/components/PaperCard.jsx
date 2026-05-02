export default function PaperCard({ children, className = '', tape = false, ...props }) {
  return (
    <div
      className={`paper-card ${tape ? 'tape mt-4' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
