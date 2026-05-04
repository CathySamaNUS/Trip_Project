import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { PrimaryButton, SecondaryButton } from '../components/Buttons.jsx'

export default function ResetPasswordPage() {
  const nav = useNavigate()
  const { user, updatePassword, configured } = useAuth()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  // When user arrives via reset email, Supabase establishes a temp session.
  // If they land here without one, there's nothing they can change.
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    setHasSession(Boolean(user))
  }, [user])

  const submit = async (e) => {
    e?.preventDefault?.()
    if (!password) return setError('设个新密码')
    if (password.length < 6) return setError('密码至少 6 个字符')
    if (password !== confirmPassword) return setError('两次输入的密码不一样')

    setBusy(true)
    setError('')
    const { error } = await updatePassword(password)
    setBusy(false)
    if (error) setError(error.message)
    else setDone(true)
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="paper-card p-6 tape text-center">
          <div className="text-4xl mb-3">✅</div>
          <h1 className="font-serifc text-xl">新密码已设置</h1>
          <p className="text-sm text-muted mt-3">下次登录请用这个新密码。</p>
          <PrimaryButton className="w-full mt-6" onClick={() => nav('/')}>
            回到首页
          </PrimaryButton>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <button onClick={() => nav('/')} className="btn-ghost mb-3">← 返回首页</button>
      <div className="paper-card p-6 tape">
        <div className="text-4xl text-center mb-2">🔑</div>
        <h1 className="font-serifc text-2xl text-center">设置新密码</h1>

        {!configured && (
          <div className="mt-4 text-sm text-rose bg-rose/10 px-3 py-2 rounded-md">
            Supabase 还没配置好。
          </div>
        )}

        {!hasSession ? (
          <div className="mt-5">
            <p className="text-sm text-muted leading-7">
              这个页面要从邮件里的「重置密码」链接打开才能用。
              <br />如果你点过链接还看到这条提示，可能是链接过期了（默认 1 小时有效），重新走一次「忘记密码」即可。
            </p>
            <SecondaryButton className="w-full mt-6" onClick={() => nav('/login')}>
              去登录页
            </SecondaryButton>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-3">
            <div>
              <label className="label">新密码</label>
              <input
                type="password"
                autoFocus
                required
                disabled={busy}
                className="field"
                placeholder="至少 6 个字符"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="label">再输一次</label>
              <input
                type="password"
                required
                disabled={busy}
                className="field"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && (
              <div className="text-sm text-rose bg-rose/10 px-3 py-2 rounded-md">
                {error}
              </div>
            )}
            <PrimaryButton type="submit" className="w-full" disabled={busy}>
              {busy ? '保存中…' : '设置新密码'}
            </PrimaryButton>
          </form>
        )}
      </div>
    </div>
  )
}
