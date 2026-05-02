import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, SUPABASE_CONFIGURED } from './supabase.js'

const AuthCtx = createContext({
  user: null,
  loading: false,
  signInWithEmail: async () => ({ error: { message: 'Supabase 未配置' } }),
  signOut: async () => {},
  configured: false
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(SUPABASE_CONFIGURED)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setUser(data?.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => {
      mounted = false
      sub?.subscription?.unsubscribe?.()
    }
  }, [])

  const signInWithEmail = async (email) => {
    if (!supabase) return { error: { message: 'Supabase 未配置' } }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
    return { error }
  }

  const signOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return (
    <AuthCtx.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signOut,
        configured: SUPABASE_CONFIGURED
      }}
    >
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
