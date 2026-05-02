# Supabase 配置清单

按下面六步完成后，告诉我做完了，我就把前端数据层切到 Supabase。

## 1. 创建项目

1. 打开 https://supabase.com 注册（用 GitHub 登录最快）
2. **New project**
3. 名字随便（比如 `trip-memory`），数据库密码自动生成就行
4. **Region** 选 **Southeast Asia (Singapore)** 或 **Northeast Asia (Tokyo)** —— 离你和大陆用户最近
5. 等约 1 分钟项目启动完

## 2. 跑 SQL 建表

1. 左侧 **SQL Editor** → **New query**
2. 把仓库里的 `supabase/schema.sql` 整个复制粘进去
3. 点右上角 **Run**（或 ⌘+Enter）
4. 看到 `Success. No rows returned` 即成功

## 3. 建照片存储桶

1. 左侧 **Storage** → **New bucket**
2. Name: `photos`
3. **Public bucket** 打勾（这样照片 URL 可以直接公开访问）
4. **Save**

> 桶建好后，第 2 步 SQL 里的 storage RLS 策略会自动生效。

## 4. 配置登录回调地址

1. 左侧 **Authentication** → **URL Configuration**
2. **Site URL** 填你的 Vercel 域名，比如 `https://trip-project.vercel.app`
3. **Redirect URLs** 加这几条（每行一个）：
   ```
   http://localhost:5173/**
   http://localhost:5174/**
   http://localhost:5175/**
   https://你的项目.vercel.app/**
   https://*.vercel.app/**
   ```
   通配 `*.vercel.app` 是为了让 Vercel 的 PR 预览部署也能登录

## 5. 拿到密钥

1. 左侧 **Project Settings → API**
2. 复制两个值：
   - **Project URL**：`https://xxxxxxxx.supabase.co`
   - **anon public** 那个 key（不是 `service_role`！service_role 永远不要给前端）

## 6. 把密钥加到环境变量

### 本地开发
仓库根目录新建 `.env.local`（参考 `.env.example`）：
```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```
> `.env.local` 已经在 `.gitignore` 里，不会提交到 GitHub。

### Vercel
项目 → **Settings → Environment Variables** 加同样两条：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

加完点 **Redeploy** 让新变量生效。

---

## 验证

完成上面六步后，运行 `npm run dev`，访问首页应该能看到右上角「登录」按钮。点进去输邮箱，收到 magic link 邮件点进来 → 回到首页应该看到你的邮箱已登录。

> 如果没收到邮件：Supabase 免费档默认每小时 2 封，连续测试要等。可以在 **Authentication → Logs** 看是否真发出了。

确认这一步通过后，告诉我「Supabase 通了」，我开始把数据存储切过去。
