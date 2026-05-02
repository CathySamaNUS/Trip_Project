import { createContext, useCallback, useContext, useState } from 'react'

const ToastCtx = createContext(null)

export function ToastProvider({ children }) {
  const [items, setItems] = useState([])
  const show = useCallback((msg) => {
    const id = Math.random().toString(36).slice(2)
    setItems((s) => [...s, { id, msg }])
    setTimeout(() => setItems((s) => s.filter((i) => i.id !== id)), 2200)
  }, [])
  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none">
        {items.map((i) => (
          <div
            key={i.id}
            className="bg-ink/90 text-white text-sm px-4 py-2 rounded-full shadow-paper"
          >
            {i.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export const useToast = () => useContext(ToastCtx) || (() => {})
