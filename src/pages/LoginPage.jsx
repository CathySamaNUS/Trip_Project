import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { PrimaryButton, SecondaryButton } from '../components/Buttons.jsx'

export default function LoginPage() {
  const nav = useNavigate()
  const { signInWithEmail, configured, user } = useAuth()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="paper-card p-6 tape">
          <div className="text-4xl mb-3">🌿</div>
          <div className="font-serifc text-xl">你已经登录</div>
          <div className="text-sm text-muted mt-2">{user.email}</div>
          <PrimaryButton className="mt-6 w-full" onClick={() => nav('/')}>
            回到首页
          </PrimaryButton>
        </div>
      </div>
    )
  }

  const submit = async (e) => {
    e?.preventDefault?.()
    if (!email.trim()) return
    setBusy(true)
    setError('')
    const { error } = await signInWithEmail(email.trim())
    setBusy(false)
    if (error) setError(error.message || '发送失败，请稍后再试')
    else setSent(true)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <button onClick={() => nav('/')} className="btn-ghost mb-3">← 返回首页</button>

      <div className="paper-card p-6 tape">
        <div className="text-4xl text-center mb-2">📬</div>
        <h1 className="font-serifc text-2xl text-center">登录 / 注册</h1>
        <p className="text-sm text-muted text-center mt-2">
          填一个邮箱，我们会给你发一封带登录链接的邮件，点开就能进来。
          <br />不用记密码，第一次填的邮箱就是你的账号。
        </p>

        {!configured && (
          <div className="mt-4 text-sm text-rose bg-rose/10 px-3 py-2 rounded-md">
            Supabase 还没配置好，登录暂不可用。请先按 <code>SUPABASE_SETUP.md</code> 完成配置。
          </div>
        )}

        {sent ? (
          <div className="mt-6">
            <div className="paper-card p-4 bg-cream/40">
              <div className="font-medium">✉️ 已发送登录链接到</div>
              <div className="text-rose mt-1">{email}</div>
              <div className="text-xs text-muted mt-2 leading-5">
                打开邮箱点击链接即可登录。<br />
                没收到？检查垃圾邮件，或一分钟后重试。
              </div>
            </div>
            <SecondaryButton
              className="w-full mt-4"
              onClick={() => {
                setSent(false)
                setEmail('')
              }}
            >
              换一个邮箱
            </SecondaryButton>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6">
            <label className="label">邮箱</label>
            <input
              type="email"
              autoFocus
              required
              disabled={busy || !configured}
              className="field mb-3"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && (
              <div className="text-sm text-rose bg-rose/10 px-3 py-2 rounded-md mb-3">
                {error}
              </div>
            )}
            <PrimaryButton
              type="submit"
              className="w-full"
              disabled={busy || !configured || !email.trim()}
            >
              {busy ? '正在发送…' : '发送登录链接'}
            </PrimaryButton>
          </form>
        )}

        <div className="text-xs text-muted text-center mt-6 leading-5">
          登录后你的旅行会同步到云端。<br />未登录时仍可在本地体验，所有数据保存在浏览器里。
        </div>
      </div>
    </div>
  )
}
