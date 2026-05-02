import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const LightboxCtx = createContext(null)

export function LightboxProvider({ children }) {
  const [state, setState] = useState({ open: false, photos: [], index: 0 })

  const open = useCallback((photos, index = 0) => {
    if (!photos?.length) return
    setState({ open: true, photos, index })
  }, [])
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), [])
  const next = useCallback(
    () => setState((s) => ({ ...s, index: (s.index + 1) % s.photos.length })),
    []
  )
  const prev = useCallback(
    () =>
      setState((s) => ({
        ...s,
        index: (s.index - 1 + s.photos.length) % s.photos.length
      })),
    []
  )

  useEffect(() => {
    if (!state.open) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [state.open, close, next, prev])

  return (
    <LightboxCtx.Provider value={{ open }}>
      {children}
      {state.open && (
        <div
          onClick={close}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/90 hover:text-white text-3xl leading-none"
            aria-label="关闭"
          >
            ✕
          </button>

          {state.photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                className="absolute left-4 md:left-10 text-white/80 hover:text-white text-4xl"
                aria-label="上一张"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                className="absolute right-4 md:right-10 text-white/80 hover:text-white text-4xl"
                aria-label="下一张"
              >
                ›
              </button>
            </>
          )}

          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={state.photos[state.index]?.url}
              alt={state.photos[state.index]?.name || ''}
              className="w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
            />
            <div className="text-center text-white/80 text-sm mt-3">
              {state.photos[state.index]?.name || ''}
              <span className="ml-3 opacity-60">
                {state.index + 1} / {state.photos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </LightboxCtx.Provider>
  )
}

export const useLightbox = () => useContext(LightboxCtx) || { open: () => {} }
