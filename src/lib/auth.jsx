import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, SUPABASE_CONFIGURED } from './supabase.js'

const notConfigured = { error: { message: 'Supabase 未配置' } }

const AuthCtx = createContext({
  user: null,
  loading: false,
  configured: false,
  signUp: async () => notConfigured,
  signInWithPassword: async () => notConfigured,
  signInWithEmail: async () => notConfigured,
  resetPasswordForEmail: async () => notConfigured,
  updatePassword: async () => notConfigured,
  signOut: async () => {}
})

// Translate Supabase auth errors into friendlier Chinese messages.
const translateError = (err) => {
  if (!err) return null
  const msg = err.message || ''
  const map = [
    [/invalid login credentials/i, '邮箱或密码不对，再确认一下？'],
    [/email not confirmed/i, '这个邮箱还没验证，请先去邮箱里点确认链接'],
    [/user already registered/i, '这个邮箱已经注册过了，直接登录就好'],
    [/password should be at least/i, '密码太短，至少 6 个字符'],
    [/rate limit/i, '操作太频繁，等一两分钟再试'],
    [/invalid email/i, '邮箱格式不太对'],
    [/over.*email.*rate.*limit/i, '邮件发送太频繁，过几分钟再试'],
    [/network/i, '网络好像不太稳，再试一次']
  ]
  for (const [re, zh] of map) if (re.test(msg)) return { ...err, message: zh }
  return err
}

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

  const signUp = async (email, password) => {
    if (!supabase) return notConfigured
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin }
    })
    return { data, error: translateError(error) }
  }

  const signInWithPassword = async (email, password) => {
    if (!supabase) return notConfigured
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error: translateError(error) }
  }

  // Magic link, kept for "send me a one-time link" backup
  const signInWithEmail = async (email) => {
    if (!supabase) return notConfigured
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin }
    })
    return { error: translateError(error) }
  }

  const resetPasswordForEmail = async (email) => {
    if (!supabase) return notConfigured
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { error: translateError(error) }
  }

  const updatePassword = async (password) => {
    if (!supabase) return notConfigured
    const { data, error } = await supabase.auth.updateUser({ password })
    return { data, error: translateError(error) }
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
        configured: SUPABASE_CONFIGURED,
        signUp,
        signInWithPassword,
        signInWithEmail,
        resetPasswordForEmail,
        updatePassword,
        signOut
      }}
    >
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
