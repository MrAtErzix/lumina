const SETTINGS_KEY = 'lumina.settings.v1'
const PROJECTS_KEY = 'lumina.projects.v1'
const CURRENT_KEY = 'lumina.current.v1'

let projectsKey = PROJECTS_KEY
let currentKey = CURRENT_KEY

export function setUserScope(userId) {
  if (userId) {
    projectsKey = `${PROJECTS_KEY}.${userId}`
    currentKey = `${CURRENT_KEY}.${userId}`
  } else {
    projectsKey = PROJECTS_KEY
    currentKey = CURRENT_KEY
  }
}

import { DEFAULT_MODEL, isDeadModel } from './groq.js'

const defaultSettings = () => ({
  apiKey: '',
  model: DEFAULT_MODEL,
  autoApply: true,
  customModel: '',
})

export function loadSettings() {
  try {
    const s = { ...defaultSettings(), ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }
    if (isDeadModel(s.model)) s.model = DEFAULT_MODEL
    if (isDeadModel(s.customModel)) s.customModel = ''
    return s
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
