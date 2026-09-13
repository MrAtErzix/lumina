const SETTINGS_KEY = 'lumina.settings.v1'
const PROJECTS_KEY = 'lumina.projects.v1'
const CURRENT_KEY = 'lumina.current.v1'

const defaultSettings = () => ({
  apiKey: '',
  model: 'llama-3.3-70b-versatile',
  autoApply: true,
  customModel: '',
})

export function loadSettings() {
  try {
    return { ...defaultSettings(), ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }
  } catch {
    return defaultSettings()
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadProjects() {
  try {
    const list = JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]')
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function loadCurrentId() {
  return localStorage.getItem(CURRENT_KEY)
}

export function saveCurrentId(id) {
  if (id) localStorage.setItem(CURRENT_KEY, id)
  else localStorage.removeItem(CURRENT_KEY)
}

export function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2)
}

export function createProject(partial = {}) {
  const now = Date.now()
  return {
    id: uid(),
    name: 'Новый сайт',
    html: '',
    messages: [],
    versions: [],
    createdAt: now,
    updatedAt: now,
    ...partial,
  }
}
