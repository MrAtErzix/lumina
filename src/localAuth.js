const ACC_KEY = 'lumina.accounts.v1'
const SESS_KEY = 'lumina.localSession.v1'

function loadAccounts() {
  try {
    const a = JSON.parse(localStorage.getItem(ACC_KEY) || '[]')
    return Array.isArray(a) ? a : []
  } catch {
    return []
  }
}

function saveAccounts(list) {
  localStorage.setItem(ACC_KEY, JSON.stringify(list))
}

async function pbkdf(password, salt) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: enc.encode(salt), iterations: 120000, hash: 'SHA-256' },
    key,
    256,
  )
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function publicUser(a) {
  return { id: a.id, login: a.login, name: a.name, email: a.email, avatar: '', local: true }
}

export function getLocalSession() {
  try {
    const s = JSON.parse(localStorage.getItem(SESS_KEY) || 'null')
    if (!s?.id) return null
    const acc = loadAccounts().find((a) => a.id === s.id)
    return acc ? publicUser(acc) : null
  } catch {
    return null
  }
}

export function clearLocalSession() {
  localStorage.removeItem(SESS_KEY)
}

export async function localRegister({ email, password, name }) {
  const emailNorm = String(email || '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) throw new Error('Некорректная почта')
  if (String(password || '').length < 8) throw new Error('Пароль от 8 символов')
  const list = loadAccounts()
  if (list.some((a) => a.email === emailNorm)) throw new Error('Эта почта уже зарегистрирована')
  const salt = crypto.randomUUID()
  const passwordHash = await pbkdf(password, salt)
  const login = emailNorm.split('@')[0].slice(0, 32)
  const acc = {
    id: 'local-' + (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
    email: emailNorm,
    login,
    name: String(name || login).trim().slice(0, 60) || login,
    salt,
    passwordHash,
    createdAt: Date.now(),
  }
  list.push(acc)
  saveAccounts(list)
  localStorage.setItem(SESS_KEY, JSON.stringify({ id: acc.id }))
  return publicUser(acc)
}

export async function localLogin({ email, password }) {
  const emailNorm = String(email || '').trim().toLowerCase()
  const acc = loadAccounts().find((a) => a.email === emailNorm)
  if (!acc) throw new Error('Неверная почта или пароль')
  const hash = await pbkdf(password, acc.salt)
  if (hash !== acc.passwordHash) throw new Error('Неверная почта или пароль')
  localStorage.setItem(SESS_KEY, JSON.stringify({ id: acc.id }))
  return publicUser(acc)
}
