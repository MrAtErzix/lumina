async function req(path, opts = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), opts.timeout || 4000)
  try {
    const res = await fetch(path, {
      credentials: 'include',
      headers: {
        ...(opts.body ? { 'content-type': 'application/json' } : {}),
        ...(opts.headers || {}),
      },
      ...opts,
      signal: opts.signal || ctrl.signal,
      body: opts.body && typeof opts.body !== 'string' ? JSON.stringify(opts.body) : opts.body,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = new Error(data.error || 'Ошибка API')
      err.status = res.status
      throw err
    }
    return data
  } finally {
    clearTimeout(t)
  }
}

export async function apiStatus() {
  return req('/api/status', { timeout: 2500 })
}

export async function apiMe() {
  return req('/api/me')
}

export async function apiLogout() {
  return req('/api/auth/logout', { method: 'POST' })
}

export async function apiRegister(body) {
  return req('/api/auth/register', { method: 'POST', body })
}

export async function apiLogin(body) {
  return req('/api/auth/login', { method: 'POST', body })
}

export async function apiGetProjects() {
  const data = await req('/api/projects')
  return data.projects || []
}

export async function apiSaveProjects(projects) {
  const data = await req('/api/projects', { method: 'PUT', body: { projects } })
  return data.projects || []
}

export async function apiDeleteProject(id) {
  return req(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
