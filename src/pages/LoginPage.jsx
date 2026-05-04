import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { PrimaryButton, SecondaryButton } from '../components/Buttons.jsx'

const TabBtn = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-1 py-2 text-center font-medium transition border-b-2 ${
      active ? 'border-rose text-rose' : 'border-transparent text-muted hover:text-ink'
    }`}
  >
    {children}
  </button>
)

export default function LoginPage() {
  const nav = useNavigate()
  const {
    user,
    configured,
    signUp,
    signInWithPassword,
    resetPasswordForEmail
  } = useAuth()

  // Modes: 'login' | 'signup' | 'forgot'
  const [mode, setMode] = useState('login')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [doneState, setDoneState] = useState(null) // 'signup' | 'reset'

  // Already logged in
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

  const switchMode = (next) => {
    setMode(next)
    setError('')
    setInfo('')
    setDoneState(null)
    setPassword('')
    setConfirmPassword('')
  }

  const validateLogin = () => {
    if (!email.trim()) return '填一下邮箱'
    if (!password) return '填一下密码'
    return null
  }
  const validateSignup = () => {
    if (!email.trim()) return '填一下邮箱'
    if (!password) return '设个密码'
    if (password.length < 6) return '密码至少 6 个字符'
    if (password !== confirmPassword) return '两次输入的密码不一样'
    return null
  }
  const validateForgot = () => {
    if (!email.trim()) return '填一下邮箱'
    return null
  }

  const onLogin = async (e) => {
    e?.preventDefault?.()
    const v = validateLogin()
    if (v) return setError(v)
    setBusy(true)
    setError('')
    const { error } = await signInWithPassword(email.trim(), password)
    setBusy(false)
    if (error) setError(error.message)
    // success: AuthProvider's onAuthStateChange will set user and we'll redirect via the user check above
  }

  const onSignup = async (e) => {
    e?.preventDefault?.()
    const v = validateSignup()
    if (v) return setError(v)
    setBusy(true)
    setError('')
    const { data, error } = await signUp(email.trim(), password)
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data?.user && !data.user.email_confirmed_at && !data.session) {
      // email confirmation required
      setDoneState('signup')
    } else {
      // signup succeeded with no confirmation needed → already logged in
      nav('/')
    }
  }

  const onForgot = async (e) => {
    e?.preventDefault?.()
    const v = validateForgot()
    if (v) return setError(v)
    setBusy(true)
    setError('')
    const { error } = await resetPasswordForEmail(email.trim())
    setBusy(false)
    if (error) setError(error.message)
    else setDoneState('reset')
  }

  // Done states (after successful submit of signup or forgot)
  if (doneState === 'signup') {
    return (
      <DonePane
        title="✉️ 验证邮件已发送"
        body={
          <>
            我们给 <span className="text-rose">{email}</span> 发了一封确认邮件。
            <br />打开邮箱点击里面的链接，账号就开通了。
            <br /><span className="text-xs text-muted">没收到？检查垃圾邮件，或一两分钟后重试。</span>
          </>
        }
        onBack={() => switchMode('login')}
      />
    )
  }
  if (doneState === 'reset') {
    return (
      <DonePane
        title="🔑 重置链接已发送"
        body={
          <>
            我们给 <span className="text-rose">{email}</span> 发了一封重置密码的邮件。
            <br />点击邮件里的链接 → 设置新密码。
          </>
        }
        onBack={() => switchMode('login')}
      />
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <button onClick={() => nav('/')} className="btn-ghost mb-3">← 返回首页</button>

      <div className="paper-card p-6 tape">
        <div className="text-4xl text-center mb-2">📬</div>
        <h1 className="font-serifc text-2xl text-center">
          {mode === 'forgot' ? '忘记密码' : '登录 / 注册'}
        </h1>

        {!configured && (
          <div className="mt-4 text-sm text-rose bg-rose/10 px-3 py-2 rounded-md">
            Supabase 还没配置好，登录暂不可用。请先按 <code>SUPABASE_SETUP.md</code> 完成配置。
          </div>
        )}

        {/* tabs (hidden on forgot mode) */}
        {mode !== 'forgot' && (
          <div className="flex mt-5 border-b border-[#efe4cc]">
            <TabBtn active={mode === 'login'} onClick={() => switchMode('login')}>
              已有账号 · 登录
            </TabBtn>
            <TabBtn active={mode === 'signup'} onClick={() => switchMode('signup')}>
              第一次来 · 注册
            </TabBtn>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={onLogin} className="mt-5 space-y-3">
            <Field label="邮箱">
              <input
                type="email"
                autoFocus
                required
                disabled={busy || !configured}
                className="field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="密码">
              <input
                type="password"
                required
                disabled={busy || !configured}
                className="field"
                placeholder="至少 6 个字符"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <ErrorBox text={error} />
            <PrimaryButton
              type="submit"
              className="w-full"
              disabled={busy || !configured}
            >
              {busy ? '登录中…' : '登录'}
            </PrimaryButton>
            <button
              type="button"
              className="w-full text-xs text-muted hover:text-rose pt-1"
              onClick={() => switchMode('forgot')}
            >
              忘记密码？
            </button>
          </form>
        )}

        {mode === 'signup' && (
          <form onSubmit={onSignup} className="mt-5 space-y-3">
            <Field label="邮箱" hint="第一次填的就是你的账号，记好别忘了">
              <input
                type="email"
                autoFocus
                required
                disabled={busy || !configured}
                className="field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="设置密码" hint="至少 6 个字符">
              <input
                type="password"
                required
                disabled={busy || !configured}
                className="field"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Field label="再输一次">
              <input
                type="password"
                required
                disabled={busy || !configured}
                className="field"
                placeholder="••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Field>
            <ErrorBox text={error} />
            <PrimaryButton
              type="submit"
              className="w-full"
              disabled={busy || !configured}
            >
              {busy ? '创建中…' : '注册账号'}
            </PrimaryButton>
            <p className="text-xs text-muted text-center pt-1">
              注册后会发一封确认邮件到你的邮箱，点链接确认即可。
            </p>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={onForgot} className="mt-5 space-y-3">
            <p className="text-sm text-muted">
              输入注册时用的邮箱，我们给你发一封重置密码的链接。
            </p>
            <Field label="邮箱">
              <input
                type="email"
                autoFocus
                required
                disabled={busy || !configured}
                className="field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <ErrorBox text={error} />
            <PrimaryButton
              type="submit"
              className="w-full"
              disabled={busy || !configured}
            >
              {busy ? '发送中…' : '发送重置链接'}
            </PrimaryButton>
            <button
              type="button"
              className="w-full text-xs text-muted hover:text-rose pt-1"
              onClick={() => switchMode('login')}
            >
              ← 返回登录
            </button>
          </form>
        )}

        <div className="text-xs text-muted text-center mt-6 leading-5">
          登录后你的旅行会同步到云端。<br />未登录时仍可在本地体验，所有数据保存在浏览器里。
        </div>
      </div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {hint && <div className="text-xs text-muted mt-1">{hint}</div>}
    </div>
  )
}

function ErrorBox({ text }) {
  if (!text) return null
  return (
    <div className="text-sm text-rose bg-rose/10 px-3 py-2 rounded-md">{text}</div>
  )
}

function DonePane({ title, body, onBack }) {
  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <div className="paper-card p-6 tape">
        <h1 className="font-serifc text-xl text-center">{title}</h1>
        <p className="text-sm text-muted leading-7 mt-4">{body}</p>
        <SecondaryButton className="w-full mt-6" onClick={onBack}>
          返回登录
        </SecondaryButton>
      </div>
    </div>
  )
}
