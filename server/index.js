import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cookieParser from 'cookie-parser'
import {
  upsertGithubUser,
  createSession,
  userFromSession,
  deleteSession,
  listProjects,
  replaceProjects,
  deleteProject,
} from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function loadEnv() {
  const p = path.join(root, '.env')
  if (!fs.existsSync(p)) return
  for (const raw of fs.readFileSync(p, 'utf8').split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const i = line.indexOf('=')
    if (i < 1) continue
    const key = line.slice(0, i).trim()
    let val = line.slice(i + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (process.env[key] == null) process.env[key] = val
  }
}
loadEnv()

const PORT = Number(process.env.PORT) || 3001
const CLIENT_ID = process.env.GITHUB_CLIENT_ID || ''
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || ''
const isProd = process.env.NODE_ENV === 'production'

function publicBase(req) {
  const proto = (req.headers['x-forwarded-proto'] || req.protocol || 'http').split(',')[0].trim()
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim()
  return `${proto}://${host}`
}

function cookieOpts(req, extra = {}) {
  const secure = publicBase(req).startsWith('https')
  return {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure,
    ...extra,
  }
}

function currentUser(req) {
  return userFromSession(req.cookies.lumina_sid)
}

function requireUser(req, res, next) {
  const user = currentUser(req)
  if (!user) return res.status(401).json({ error: 'Нужно войти' })
  req.user = user
  next()
}

const app = express()
app.set('trust proxy', 1)
app.use(cookieParser())
app.use(express.json({ limit: '8mb' }))

app.get('/api/status', (req, res) => {
  res.json({
    ok: true,
    github: Boolean(CLIENT_ID && CLIENT_SECRET),
    callback: `${publicBase(req)}/api/auth/github/callback`,
  })
})

app.get('/api/me', (req, res) => {
  res.json({ user: currentUser(req) })
})

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim())
}

app.post('/api/auth/register', (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase()
    const password = String(req.body?.password || '')
    const name = String(req.body?.name || '').trim().slice(0, 60)
    if (!validEmail(email)) return res.status(400).json({ error: 'Некорректная почта' })
    if (password.length < 8) return res.status(400).json({ error: 'Пароль от 8 символов' })
    const passwordHash = bcrypt.hashSync(password, 10)
    const user = registerEmailUser({ email, passwordHash, name })
    const session = createSession(user.id)
    res.cookie('lumina_sid', session.id, cookieOpts(req, { maxAge: 30 * 24 * 60 * 60 * 1000 }))
    res.json({ user })
  } catch (err) {
    if (err.code === 'EMAIL_TAKEN' || /уже зарегистрирована/i.test(err.message)) {
      return res.status(409).json({ error: 'Эта почта уже зарегистрирована' })
    }
    console.error(err)
    res.status(500).json({ error: 'Не удалось зарегистрироваться' })
  }
})

app.post('/api/auth/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')
  const row = findByEmail(email)
  if (!row || !row.password_hash || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Неверная почта или пароль' })
  }
  const user = {
    id: row.id,
    githubId: row.github_id,
    login: row.login,
    name: row.name || row.login,
    email: row.email || '',
    avatar: row.avatar || '',
  }
  const session = createSession(user.id)
  res.cookie('lumina_sid', session.id, cookieOpts(req, { maxAge: 30 * 24 * 60 * 60 * 1000 }))
  res.json({ user })
})

app.get('/api/auth/github', (req, res) => {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(503).json({
      error: 'GitHub OAuth не настроен. Добавьте GITHUB_CLIENT_ID и GITHUB_CLIENT_SECRET в .env',
    })
  }
  const state = crypto.randomUUID()
  res.cookie('oauth_state', state, cookieOpts(req, { maxAge: 10 * 60 * 1000 }))
  const redirect = `${publicBase(req)}/api/auth/github/callback`
  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', CLIENT_ID)
  url.searchParams.set('redirect_uri', redirect)
  url.searchParams.set('scope', 'read:user user:email')
  url.searchParams.set('state', state)
  res.redirect(url.toString())
})

app.get('/api/auth/github/callback', async (req, res) => {
  const fail = (msg) => res.redirect(`/?auth=error&reason=${encodeURIComponent(msg)}`)
  try {
    if (!CLIENT_ID || !CLIENT_SECRET) return fail('oauth_unconfigured')
    const { code, state } = req.query
    if (!code || !state || state !== req.cookies.oauth_state) return fail('bad_state')
    res.clearCookie('oauth_state', { path: '/' })

    const redirect = `${publicBase(req)}/api/auth/github/callback`
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: redirect,
      }),
    })
    const tokenJson = await tokenRes.json()
    if (!tokenJson.access_token) return fail('no_token')

    const ghHeaders = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${tokenJson.access_token}`,
      'User-Agent': 'lumina-studio',
    }
    const ghUser = await fetch('https://api.github.com/user', { headers: ghHeaders }).then((r) => r.json())
    if (!ghUser || !ghUser.id) return fail('no_user')

    let email = ghUser.email || ''
    if (!email) {
      const emails = await fetch('https://api.github.com/user/emails', { headers: ghHeaders }).then((r) => r.json())
      if (Array.isArray(emails)) {
        const primary = emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified) || emails[0]
        email = primary?.email || ''
      }
    }

    const user = upsertGithubUser({
      githubId: ghUser.id,
      login: ghUser.login,
      name: ghUser.name || ghUser.login,
      email,
      avatar: ghUser.avatar_url || '',
    })
    const session = createSession(user.id)
    res.cookie('lumina_sid', session.id, cookieOpts(req, { maxAge: 30 * 24 * 60 * 60 * 1000 }))
    res.redirect('/?auth=ok')
  } catch {
    fail('oauth_failed')
  }
})

app.post('/api/auth/logout', (req, res) => {
  deleteSession(req.cookies.lumina_sid)
  res.clearCookie('lumina_sid', { path: '/' })
  res.json({ ok: true })
})

app.get('/api/projects', requireUser, (req, res) => {
  res.json({ projects: listProjects(req.user.id) })
})

app.put('/api/projects', requireUser, (req, res) => {
  const projects = replaceProjects(req.user.id, req.body?.projects)
  res.json({ projects })
})

app.delete('/api/projects/:id', requireUser, (req, res) => {
  deleteProject(req.user.id, req.params.id)
  res.json({ ok: true })
})

if (isProd) {
  const dist = path.join(root, 'dist')
  app.use(express.static(dist))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(dist, 'index.html'))
  })
}

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Ошибка сервера' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Lumina API http://0.0.0.0:${PORT}`)
})
