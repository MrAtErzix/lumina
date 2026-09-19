import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Database from 'better-sqlite3'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(__dirname, '..', 'data')
fs.mkdirSync(dataDir, { recursive: true })

const db = new Database(path.join(dataDir, 'lumina.db'))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  github_id INTEGER UNIQUE,
  login TEXT NOT NULL,
  name TEXT,
  email TEXT,
  avatar TEXT,
  password_hash TEXT,
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  html TEXT NOT NULL DEFAULT '',
  messages TEXT NOT NULL DEFAULT '[]',
  versions TEXT NOT NULL DEFAULT '[]',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
`)

function migrateUsers() {
  const cols = db.prepare('PRAGMA table_info(users)').all()
  const names = new Set(cols.map((c) => c.name))
  if (!names.has('password_hash')) {
    try {
      db.exec('ALTER TABLE users ADD COLUMN password_hash TEXT')
    } catch {
      /* already */
    }
  }
  const gh = cols.find((c) => c.name === 'github_id')
  if (gh && gh.notnull) {
    db.pragma('foreign_keys = OFF')
    db.exec(`
      CREATE TABLE users_v2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        github_id INTEGER UNIQUE,
        login TEXT NOT NULL,
        name TEXT,
        email TEXT,
        avatar TEXT,
        password_hash TEXT,
        created_at INTEGER NOT NULL
      );
      INSERT INTO users_v2 (id, github_id, login, name, email, avatar, password_hash, created_at)
        SELECT id, github_id, login, name, email, avatar, NULL, created_at FROM users;
      DROP TABLE users;
      ALTER TABLE users_v2 RENAME TO users;
    `)
    db.pragma('foreign_keys = ON')
  }
  db.exec(
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL AND email != ''`,
  )
}
migrateUsers()

function publicUser(row) {
  if (!row) return null
  return {
    id: row.id,
    githubId: row.github_id,
    login: row.login,
    name: row.name || row.login,
    email: row.email || '',
    avatar: row.avatar || '',
  }
}

function parseProject(row) {
  let messages = []
  let versions = []
  try {
    messages = JSON.parse(row.messages || '[]')
  } catch {
    messages = []
  }
  try {
    versions = JSON.parse(row.versions || '[]')
  } catch {
    versions = []
  }
  return {
    id: row.id,
    name: row.name,
    html: row.html || '',
    messages: Array.isArray(messages) ? messages : [],
    versions: Array.isArray(versions) ? versions : [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function upsertGithubUser({ githubId, login, name, email, avatar }) {
  const now = Date.now()
  const existing = db.prepare('SELECT * FROM users WHERE github_id = ?').get(githubId)
  if (existing) {
    db.prepare('UPDATE users SET login = ?, name = ?, email = ?, avatar = ? WHERE id = ?').run(
      login,
      name || login,
      email || existing.email || '',
      avatar || '',
      existing.id,
    )
    return publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(existing.id))
  }
  const info = db
    .prepare(
      'INSERT INTO users (github_id, login, name, email, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .run(githubId, login, name || login, email || '', avatar || '', now)
  return publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid))
}

export function findByEmail(email) {
  const emailNorm = String(email || '').trim().toLowerCase()
  if (!emailNorm) return null
  return db.prepare('SELECT * FROM users WHERE lower(email) = ?').get(emailNorm)
}

export function registerEmailUser({ email, passwordHash, name }) {
  const emailNorm = String(email || '').trim().toLowerCase()
  if (findByEmail(emailNorm)) {
    const err = new Error('Эта почта уже зарегистрирована')
    err.code = 'EMAIL_TAKEN'
    throw err
  }
  const login = emailNorm.split('@')[0].slice(0, 32) || 'user'
  const display = String(name || login).trim().slice(0, 60) || login
  const info = db
    .prepare(
      'INSERT INTO users (github_id, login, name, email, avatar, password_hash, created_at) VALUES (NULL, ?, ?, ?, ?, ?, ?)',
    )
    .run(login, display, emailNorm, '', passwordHash, Date.now())
  return publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid))
}

export function createSession(userId) {
  const id = crypto.randomUUID()
  const now = Date.now()
  const expires = now + 1000 * 60 * 60 * 24 * 30
  db.prepare('INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)').run(
    id,
    userId,
    now,
    expires,
  )
  return { id, expiresAt: expires }
}

export function userFromSession(sessionId) {
  if (!sessionId) return null
  const row = db
    .prepare(
      `SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.id = ? AND s.expires_at > ?`,
    )
    .get(sessionId, Date.now())
  return publicUser(row)
}

export function deleteSession(sessionId) {
  if (!sessionId) return
  db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId)
}

export function listProjects(userId) {
  const rows = db
    .prepare('SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC')
    .all(userId)
  return rows.map(parseProject)
}

export function replaceProjects(userId, projects) {
  const list = Array.isArray(projects) ? projects : []
  const del = db.prepare('DELETE FROM projects WHERE user_id = ?')
  const ins = db.prepare(
    `INSERT INTO projects (id, user_id, name, html, messages, versions, created_at, updated_at)
     VALUES (@id, @user_id, @name, @html, @messages, @versions, @created_at, @updated_at)`,
  )
  const tx = db.transaction((items) => {
    del.run(userId)
    const now = Date.now()
    for (const p of items) {
      if (!p || !p.id) continue
      ins.run({
        id: String(p.id).slice(0, 80),
        user_id: userId,
        name: String(p.name || 'Без названия').slice(0, 120),
        html: String(p.html || '').slice(0, 2_000_000),
        messages: JSON.stringify(Array.isArray(p.messages) ? p.messages : []).slice(0, 2_000_000),
        versions: JSON.stringify(Array.isArray(p.versions) ? p.versions.slice(-20) : []),
        created_at: Number(p.createdAt) || now,
        updated_at: Number(p.updatedAt) || now,
      })
    }
  })
  tx(list)
  return listProjects(userId)
}

export function deleteProject(userId, id) {
  db.prepare('DELETE FROM projects WHERE user_id = ? AND id = ?').run(userId, id)
}

export { db }
