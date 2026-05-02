export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button className={`btn-primary ${className}`} {...props}>
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', ...props }) {
  return (
    <button className={`btn-secondary ${className}`} {...props}>
      {children}
    </button>
  )
}
