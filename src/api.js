async function req(path, opts = {}) {
  const res = await fetch(path, {
    credentials: 'include',
    headers: {
      ...(opts.body ? { 'content-type': 'application/json' } : {}),
      ...(opts.headers || {}),
    },
    ...opts,
    body: opts.body && typeof opts.body !== 'string' ? JSON.stringify(opts.body) : opts.body,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error(data.error || 'Ошибка API')
    err.status = res.status
    throw err
  }
  return data
}

export async function apiStatus() {
  return req('/api/status')
}

export async function apiMe() {
  return req('/api/me')
}

export async function apiLogout() {
  return req('/api/auth/logout', { method: 'POST' })
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
