import {
  loadSettings,
  saveSettings,
  loadProjects,
  saveProjects,
  loadCurrentId,
  saveCurrentId,
  createProject,
} from './storage.js'
import {
  MODELS,
  DEFAULT_MODEL,
  extractHtml,
  commentaryOf,
  buildMessages,
  chatStream,
  testKey,
  isDeadModel,
  isMissingModelError,
} from './groq.js'
import { startFx } from './fx.js'

const EXAMPLES = [
  { t: 'Пекарня', p: 'Лендинг ремесленной пекарни «Два зерна» в Новосибирске: тёплый хлеб, витрина, предзаказ, история пекаря. Уютный редакционный стиль, кремовые тона, крупная типографика.' },
  { t: 'Портфолио', p: 'Сайт-портфолио архитектора: минимализм, много воздуха, сетка проектов, кейсы с цифрами, тёмная тема, ощущение дорогого журнала.' },
  { t: 'Йога-студия', p: 'Сайт йога-студии у реки: расписание, абонементы, преподаватели, запись на занятие. Спокойные природные цвета, мягкие анимации, не стерильный wellness-шаблон.' },
  { t: 'Приложение', p: 'Лендинг запуска финтех-приложения для подростков: дерзкий, яркий, мемный, но понятный. Hero с телефоном из CSS, тарифы, FAQ, waitlist-форма.' },
  { t: 'Ресторан', p: 'Одностраничник ресторана современной сибирской кухни: меню с ценами, атмосфера, бронирование стола, карта, галерея блюд. Тёмное дерево и медь.' },
  { t: 'Ивент', p: 'Сайт музыкального фестиваля на три дня: лайнап, сцена, билеты, таймер до старта, мерч. Неоновые акценты, гранж, энергия афиши.' },
]

const BLANK_HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Мой сайт</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: Georgia, 'Times New Roman', serif;
      background: #f4efe6;
      color: #161513;
    }
    main { padding: 32px; text-align: center; }
    h1 { font-weight: 500; letter-spacing: -0.04em; font-size: clamp(32px, 6vw, 56px); margin: 0 0 12px; }
    p { margin: 0; color: #5c564c; font-size: 18px; }
  </style>
</head>
<body>
  <main>
    <h1>Начните писать свой сайт</h1>
    <p>Этот HTML можно править слева — превью обновится сразу.</p>
  </main>
</body>
</html>`

const QUICK = [
  { t: 'Смелее дизайн', p: 'Пересобери визуальный язык: смелее композиция, другая палитра, крупнее тип. Контент и структуру сохрани.' },
  { t: 'Анимации', p: 'Добавь тонкие, дорогие анимации: появление секций, hover, плавный скролл. Без визуального шума.' },
  { t: 'Мобильная версия', p: 'Усиль адаптив: идеально на 390px и 768px, удобное меню, читаемые размеры.' },
  { t: 'Другая палитра', p: 'Полностью смени цветовую схему и настроение, сохранив структуру и тексты.' },
]

const ICONS = {
  spark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1"/><circle cx="12" cy="12" r="3.2"/></svg>`,
  gear: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/></svg>`,
  folder: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.5h7.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4v12m0 0 4.5-4.5M12 16l-4.5-4.5M5 20h14"/></svg>`,
  send: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m8 8-4 4 4 4M16 8l4 4-4 4"/></svg>`,
  split: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>`,
  undo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 10h11a5 5 0 1 1 0 10H9"/><path d="M8 6 4 10l4 4"/></svg>`,
  external: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6v6M10 14 20 4"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 18.5 4 21l3.2-1.2A9 9 0 1 0 5 18.5Z"/></svg>`,
  key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="12" r="4"/><path d="M12 12h9m-4-3v6"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 7h14M10 7V5h4v2m-7 0 1 13h8l1-13"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 5 5 9-10"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11 12 4l8 7"/><path d="M6 10.5V20h12v-9.5"/></svg>`,
  save: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5h11l3 3v11H5V5Z"/><path d="M8 5v5h8V5M8 19v-6h8v6"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V6m0 0 4.5 4.5M12 6 7.5 10.5M5 20h14"/></svg>`,
}

const appEl = document.getElementById('app')

const state = {
  settings: loadSettings(),
  projects: loadProjects(),
  currentId: loadCurrentId(),
  view: 'split',
  device: 'desktop',
  chatOpen: true,
  screen: 'home',
  settingsOpen: false,
  projectsOpen: false,
  streaming: false,
  abort: null,
  editor: null,
  previewTimer: 0,
  saveTimer: 0,
  toastTimer: 0,
}

function current() {
  return state.projects.find((p) => p.id === state.currentId) || null
}

function persist() {
  saveProjects(state.projects)
  saveCurrentId(state.currentId)
  saveSettings(state.settings)
}

function touch(p) {
  p.updatedAt = Date.now()
}

function fmtDate(ts) {
  return new Date(ts).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function icon(name) {
  return ICONS[name] || ''
}

function toast(msg, kind = 'ok') {
  let el = document.querySelector('.toast')
  if (!el) {
    el = document.createElement('div')
    el.className = 'toast'
    document.body.appendChild(el)
  }
  el.className = `toast toast-${kind} show`
  el.textContent = msg
  clearTimeout(state.toastTimer)
  state.toastTimer = setTimeout(() => el.classList.remove('show'), 2800)
}

function catalogProjects() {
  return [...state.projects]
    .filter((p) => p.html || (p.messages && p.messages.length))
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
}

function startFreshProject(name = 'Новый сайт') {
  const p = createProject({ name })
  state.projects.unshift(p)
  state.currentId = p.id
  persist()
  return p
}

function ensureProject() {
  if (!current()) startFreshProject()
}

function goHome() {
  persist()
  state.screen = 'home'
  state.projectsOpen = false
  render()
}

function saveToCatalog() {
  ensureProject()
  const p = current()
  if (!p) return
  const nameEl = document.getElementById('proj-name')
  if (nameEl) p.name = nameEl.value.trim() || p.name
  if (!p.name || p.name === 'Новый сайт') {
    const typed = window.prompt('Название проекта в каталоге', p.name || 'Мой сайт')
    if (typed === null) return
    p.name = typed.trim() || 'Мой сайт'
  }
  touch(p)
  persist()
  toast(`Сохранено в каталог: ${p.name}`)
}

function openProject(id) {
  const p = state.projects.find((x) => x.id === id)
  if (!p) return toast('Проект не найден', 'warn')
  state.currentId = id
  state.screen = 'studio'
  state.projectsOpen = false
  persist()
  render()
}

function importProjectFile(file) {
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    try {
      const text = String(reader.result || '')
      let p
      if (/\.json$/i.test(file.name) || text.trim().startsWith('{')) {
        const data = JSON.parse(text)
        p = createProject({
          name: data.name || file.name.replace(/\.json$/i, ''),
          html: data.html || '',
          messages: Array.isArray(data.messages) ? data.messages : [],
        })
      } else {
        p = createProject({
          name: file.name.replace(/\.html?$/i, '') || 'Импорт',
          html: text,
        })
      }
      state.projects.unshift(p)
      persist()
      toast(`В каталоге: ${p.name}`)
      render()
    } catch {
      toast('Не удалось прочитать файл', 'err')
    }
  }
  reader.readAsText(file)
}

function setHtml(html, { snapshot = true } = {}) {
  const p = current()
  if (!p) return
  if (snapshot && p.html && p.html !== html) {
    p.versions = [...(p.versions || []), p.html].slice(-20)
  }
  p.html = html
  touch(p)
  persist()
  if (state.editor) state.editor.setValue(html)
  refreshPreview()
}

function refreshPreview() {
  const iframe = document.getElementById('preview-frame')
  if (!iframe) return
  const p = current()
  const html = p?.html || ''
  const empty = document.getElementById('preview-empty')
  if (!html) {
    iframe.removeAttribute('srcdoc')
    iframe.src = 'about:blank'
    if (empty) empty.hidden = false
    return
  }
  if (empty) empty.hidden = true
  iframe.srcdoc = html
}

function schedulePreview() {
  clearTimeout(state.previewTimer)
  state.previewTimer = setTimeout(refreshPreview, 280)
}

function scheduleSave() {
  clearTimeout(state.saveTimer)
  state.saveTimer = setTimeout(() => persist(), 400)
}

function downloadHtml() {
  const p = current()
  if (!p?.html) return toast('Пока нечего скачивать', 'warn')
  const blob = new Blob([p.html], { type: 'text/html;charset=utf-8' })
  const a = document.createElement('a')
  const name = (p.name || 'site').replace(/[^\wа-яё\- ]+/gi, '').trim() || 'site'
  a.href = URL.createObjectURL(blob)
  a.download = `${name}.html`
  a.click()
  URL.revokeObjectURL(a.href)
  toast('HTML сохранён')
}

function copyHtml() {
  const p = current()
  if (!p?.html) return toast('Нет кода', 'warn')
  navigator.clipboard.writeText(p.html).then(
    () => toast('Код скопирован'),
    () => toast('Не удалось скопировать', 'err'),
  )
}

function openPreviewTab() {
  const p = current()
  if (!p?.html) return toast('Сначала создайте сайт', 'warn')
  const w = window.open('', '_blank')
  if (!w) return toast('Браузер заблокировал окно', 'warn')
  w.document.open()
  w.document.write(p.html)
  w.document.close()
}

function undoHtml() {
  const p = current()
  if (!p?.versions?.length) return toast('Нечего откатывать', 'warn')
  const prev = p.versions.pop()
  p.html = prev
  touch(p)
  persist()
  if (state.editor) state.editor.setValue(prev)
  refreshPreview()
  toast('Откатил к предыдущей версии')
}

function newProject() {
  startFreshProject()
  state.screen = 'studio'
  state.projectsOpen = false
  persist()
  render()
}

function deleteProject(id) {
  const i = state.projects.findIndex((x) => x.id === id)
  if (i < 0) return
  state.projects.splice(i, 1)
  if (state.currentId === id) state.currentId = null
  persist()
  render()
}

function switchProject(id) {
  openProject(id)
}

function activeModel() {
  const id = state.settings.customModel.trim() || state.settings.model
  return isDeadModel(id) ? DEFAULT_MODEL : id
}

function needsKey() {
  return !state.settings.apiKey.trim()
}

async function sendPrompt(text, { fromWelcome = false } = {}) {
  const prompt = (text || '').trim()
  if (!prompt) return
  if (needsKey()) {
    state.settingsOpen = true
    render()
    toast('Добавьте API-ключ Groq', 'warn')
    return
  }
  if (state.streaming) return
  if (fromWelcome || state.screen === 'home') {
    const guess = prompt.split(/[.!?\n]/)[0].slice(0, 42)
    startFreshProject(guess.length > 3 ? guess : 'Новый сайт')
    state.screen = 'studio'
  } else {
    ensureProject()
  }
  const p = current()

  p.messages.push({ role: 'user', content: prompt, at: Date.now() })
  const assistant = { role: 'assistant', content: '', at: Date.now(), pending: true }
  p.messages.push(assistant)
  touch(p)
  persist()
  state.streaming = true
  render()

  const controller = new AbortController()
  state.abort = controller

  const input = document.getElementById('chat-input')
  const welcomeInput = document.getElementById('welcome-input')
  if (input) input.value = ''
  if (welcomeInput) welcomeInput.value = ''
  autosize(input)

  try {
    const full = await chatStream({
      apiKey: state.settings.apiKey.trim(),
      model: activeModel(),
      messages: buildMessages({ ...p, messages: p.messages.slice(0, -1) }, prompt),
      signal: controller.signal,
      onDelta: (all) => {
        assistant.content = all
        paintStreaming(all)
      },
    })
    assistant.content = full
    assistant.pending = false
    const html = extractHtml(full)
    if (html) {
      assistant.applied = true
      if (state.settings.autoApply) setHtml(html)
      else assistant.applied = false
    }
    if (!p.name || p.name === 'Новый сайт' || p.name === 'Мой сайт') {
      const guess = prompt.split(/[.!?\n]/)[0].slice(0, 42)
      if (guess.length > 3) p.name = guess
    }
    touch(p)
    persist()
  } catch (err) {
    if (err.name === 'AbortError') {
      assistant.content = assistant.content || 'Остановлено.'
    } else {
      assistant.content = ''
      assistant.error = err.message || 'Не удалось обратиться к Groq'
      toast(assistant.error, 'err')
    }
    assistant.pending = false
    persist()
  } finally {
    state.streaming = false
    state.abort = null
    render()
  }
}

function applyFromMessage(index) {
  const p = current()
  const m = p?.messages[index]
  if (!m) return
  const html = extractHtml(m.content)
  if (!html) return toast('В ответе нет HTML', 'warn')
  setHtml(html)
  m.applied = true
  persist()
  paintChat()
  toast('Сайт обновлён')
}

function stopStream() {
  state.abort?.abort()
}

function autosize(el) {
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 160) + 'px'
}

function shell() {
  const p = current()
  const onHome = state.screen === 'home'

  return `
    <header class="topbar">
      <div class="brand" data-act="home">
        <span class="logo">${icon('spark')}</span>
        <span class="brand-text">Lumina</span>
      </div>
      <div class="top-center">
        ${onHome ? '' : p ? `<input class="proj-name" id="proj-name" value="${escapeHtml(p.name)}" spellcheck="false" />` : ''}
      </div>
      <div class="top-actions">
        ${onHome ? `
          <button class="btn ghost" data-act="import">${icon('upload')}<span>Загрузить</span></button>
          <input id="import-file" type="file" accept=".html,.htm,.json" hidden />
        ` : `
          <button class="btn primary" data-act="save">${icon('save')}<span>Сохранить</span></button>
          <button class="btn ghost" data-act="home">${icon('home')}<span>На главную</span></button>
          <button class="icon-btn" data-act="undo" title="Откатить">${icon('undo')}</button>
          <button class="icon-btn" data-act="copy" title="Копировать код">${icon('copy')}</button>
          <button class="icon-btn" data-act="open" title="Открыть в новой вкладке">${icon('external')}</button>
          <button class="btn ghost" data-act="download">${icon('download')}<span>Экспорт</span></button>
        `}
        <button class="icon-btn ${needsKey() ? 'warn-dot' : ''}" data-act="settings" title="Настройки">${icon('gear')}</button>
      </div>
    </header>

    ${onHome ? homeView() : studioView()}
    ${state.settingsOpen ? settingsModal() : ''}
  `
}

function homeView() {
  const items = catalogProjects()
  return `
    <main class="home">
      <div class="home-hero">
        <div class="hero-glass">
          <p class="eyebrow">Студия сайтов с Groq</p>
          <h1>Напишите сайт.<br><em>Или попросите ИИ.</em></h1>
          <p class="lede">Опишите страницу своими словами — Lumina соберёт полный HTML, CSS и JS. Код можно править руками и сразу смотреть превью.</p>
          ${needsKey() ? `<button class="banner" data-act="settings">${icon('key')} Сначала вставьте API-ключ Groq в настройках</button>` : ''}
          <form class="welcome-form" id="welcome-form">
            <textarea id="welcome-input" rows="3" placeholder="Например: лендинг кофейни на ОбьГЭС, тёмное дерево, меню, запись на каппинг…"></textarea>
            <div class="welcome-actions">
              <button class="btn ghost big" type="button" data-act="blank">${icon('code')} Писать самому</button>
              <button class="btn primary big" type="submit">${icon('spark')} Создать с ИИ</button>
            </div>
          </form>
          <div class="chips">
            ${EXAMPLES.map((e, i) => `<button class="chip" data-ex="${i}">${escapeHtml(e.t)}</button>`).join('')}
          </div>
        </div>
      </div>
      <section class="catalog">
        <div class="catalog-inner">
          <div class="catalog-head">
            <h2>${icon('folder')} Каталог проектов</h2>
            <span class="muted">${items.length ? items.length : 'пусто'}</span>
          </div>
          ${items.length ? `<div class="grid">${items.map(projectCard).join('')}</div>` : `<p class="catalog-empty">Пока пусто. Создайте сайт и нажмите «Сохранить» — он появится здесь.</p>`}
        </div>
      </section>
    </main>
  `
}

function projectCard(p) {
  const letter = (p.name || '?').trim().charAt(0).toUpperCase()
  return `
    <article class="pcard">
      <button type="button" class="pcard-hit" data-open="${p.id}" title="Открыть">
        <div class="pcard-thumb"><span>${escapeHtml(letter)}</span></div>
        <div class="pcard-body">
          <strong>${escapeHtml(p.name || 'Без названия')}</strong>
          <span>${fmtDate(p.updatedAt)}</span>
        </div>
      </button>
      <button type="button" class="icon-btn sm pcard-del" data-del="${p.id}" title="Удалить">${icon('trash')}</button>
    </article>
  `
}

function studioView() {
  const p = current()
  return `
    <main class="studio ${state.chatOpen ? '' : 'chat-collapsed'}">
      <aside class="chat">
        <div class="chat-head">
          <span>${icon('chat')} ИИ-ассистент</span>
          <button class="icon-btn sm" data-act="toggle-chat" title="Скрыть">${icon('x')}</button>
        </div>
        <div class="chat-log" id="chat-log">${chatMessages(p)}</div>
        <div class="quick">
          ${QUICK.map((q) => `<button class="chip sm" data-quick="${escapeHtml(q.p)}">${escapeHtml(q.t)}</button>`).join('')}
        </div>
        <form class="composer" id="chat-form">
          <textarea id="chat-input" rows="1" placeholder="Что изменить на сайте?" ${state.streaming ? 'disabled' : ''}></textarea>
          ${state.streaming
            ? `<button class="btn danger" type="button" data-act="stop">Стоп</button>`
            : `<button class="btn primary icon-only" type="submit" title="Отправить">${icon('send')}</button>`}
        </form>
      </aside>
      <section class="stage">
        <div class="stage-bar">
          ${!state.chatOpen ? `<button class="icon-btn sm" data-act="toggle-chat" title="Чат">${icon('chat')}</button>` : ''}
          <div class="seg" role="tablist">
            <button class="${state.view === 'split' ? 'on' : ''}" data-view="split">${icon('split')} Оба</button>
            <button class="${state.view === 'code' ? 'on' : ''}" data-view="code">${icon('code')} Код</button>
            <button class="${state.view === 'preview' ? 'on' : ''}" data-view="preview">${icon('eye')} Превью</button>
          </div>
          <div class="seg devices">
            <button class="${state.device === 'desktop' ? 'on' : ''}" data-device="desktop" title="Десктоп">Desk</button>
            <button class="${state.device === 'tablet' ? 'on' : ''}" data-device="tablet" title="Планшет">Tab</button>
            <button class="${state.device === 'mobile' ? 'on' : ''}" data-device="mobile" title="Телефон">Mob</button>
          </div>
        </div>
        <div class="stage-body view-${state.view}">
          <div class="pane editor-pane">
            <div id="editor-root"></div>
          </div>
          <div class="resizer" id="resizer"></div>
          <div class="pane preview-pane">
            <div class="device device-${state.device}">
              <iframe id="preview-frame" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin" title="Превью сайта"></iframe>
              <div id="preview-empty" class="preview-empty">
                <div>
                  ${icon('eye')}
                  <p>Превью появится, когда будет HTML</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `
}

function chatMessages(p) {
  if (!p?.messages?.length) {
    return `<div class="chat-empty">Опишите идею или правку — ассистент пересоберёт сайт. Можно писать и код вручную справа.</div>`
  }
  return p.messages
    .map((m, i) => {
      if (m.role === 'user') {
        return `<div class="bubble user"><div class="bubble-body">${escapeHtml(m.content)}</div></div>`
      }
      if (m.error) {
        return `<div class="bubble ai err"><div class="bubble-body">${escapeHtml(m.error)}</div></div>`
      }
      const html = extractHtml(m.content)
      const note = commentaryOf(m.content)
      const streaming = m.pending
      return `
        <div class="bubble ai ${streaming ? 'stream' : ''}">
          <div class="bubble-body" data-stream="${i}">${streaming ? renderStream(m.content) : escapeHtml(note || (html ? 'Сайт готов.' : m.content || '…'))}</div>
          ${html && !streaming ? `
            <div class="code-card">
              <span>HTML · ${html.length.toLocaleString('ru-RU')} симв.</span>
              <button class="btn ghost xs" data-apply="${i}">${m.applied ? icon('check') + ' Применён' : 'Применить'}</button>
            </div>` : ''}
        </div>`
    })
    .join('')
}

function renderStream(text) {
  const html = extractHtml(text)
  const note = commentaryOf(text)
  if (html) {
    return `${escapeHtml(note || 'Собираю страницу…')}<div class="stream-bar">Пишу HTML · ${html.length.toLocaleString('ru-RU')}</div>`
  }
  return escapeHtml(text || 'Думаю…')
}

function paintStreaming(all) {
  const log = document.getElementById('chat-log')
  if (!log) return
  const nodes = log.querySelectorAll('[data-stream]')
  const last = nodes[nodes.length - 1]
  if (last) last.innerHTML = renderStream(all)
  log.scrollTop = log.scrollHeight
}

function paintChat() {
  const log = document.getElementById('chat-log')
  if (!log) return
  log.innerHTML = chatMessages(current())
  log.scrollTop = log.scrollHeight
}

function settingsModal() {
  const s = state.settings
  return `
    <div class="overlay" data-close="settings">
      <div class="modal" role="dialog" aria-labelledby="set-title">
        <div class="modal-head">
          <h2 id="set-title">${icon('key')} Groq API</h2>
          <button class="icon-btn" data-act="close-settings">${icon('x')}</button>
        </div>
        <p class="modal-lead">Ключ хранится только в этом браузере и уходит на api.groq.com. Создайте его на <a href="https://console.groq.com/keys" target="_blank" rel="noopener">console.groq.com/keys</a>. Llama 3.3 Groq снял — по умолчанию <b>GPT-OSS 120B</b>.</p>
        <label class="field">
          <span>API-ключ</span>
          <input id="set-key" type="password" autocomplete="off" placeholder="gsk_…" value="${escapeHtml(s.apiKey)}" />
        </label>
        <label class="field">
          <span>Модель</span>
          <select id="set-model">
            ${MODELS.map((m) => `<option value="${m.id}" ${s.model === m.id ? 'selected' : ''}>${m.name} — ${m.hint}</option>`).join('')}
          </select>
        </label>
        <label class="field">
          <span>Своя модель (необязательно)</span>
          <input id="set-custom" placeholder="id модели Groq" value="${escapeHtml(s.customModel)}" />
        </label>
        <label class="check">
          <input type="checkbox" id="set-auto" ${s.autoApply ? 'checked' : ''} />
          <span>Сразу применять HTML из ответа ИИ</span>
        </label>
        <div class="modal-actions">
          <button class="btn ghost" type="button" id="set-test">Проверить ключ</button>
          <button class="btn primary" type="button" data-act="save-settings">Сохранить</button>
        </div>
      </div>
    </div>
  `
}

function projectsDrawer() {
  return `
    <div class="overlay" data-close="projects">
      <div class="drawer" role="dialog">
        <div class="modal-head">
          <h2>${icon('folder')} Проекты</h2>
          <button class="icon-btn" data-act="close-projects">${icon('x')}</button>
        </div>
        <button class="btn primary wide" data-act="new-project">${icon('plus')} Новый сайт</button>
        <div class="proj-list">
          ${state.projects.length ? state.projects.map((p) => `
            <div class="proj-item ${p.id === state.currentId ? 'current' : ''}">
              <button class="proj-open" data-open="${p.id}">
                <strong>${escapeHtml(p.name)}</strong>
                <span>${fmtDate(p.updatedAt)} · ${(p.html || '').length.toLocaleString('ru-RU')} симв.</span>
              </button>
              <button class="icon-btn sm" data-del="${p.id}" title="Удалить">${icon('trash')}</button>
            </div>
          `).join('') : `<p class="muted">Пока пусто</p>`}
        </div>
      </div>
    </div>
  `
}

let editorMod = null

async function mountEditor() {
  const root = document.getElementById('editor-root')
  if (!root) {
    state.editor = null
    return
  }
  if (!editorMod) editorMod = await import('./editor.js')
  if (!document.getElementById('editor-root')) return
  const p = current()
  state.editor = editorMod.createEditor(root, {
    doc: p?.html || '',
    onChange: (value) => {
      const proj = current()
      if (!proj) return
      proj.html = value
      touch(proj)
      scheduleSave()
      schedulePreview()
    },
  })
  refreshPreview()
}

function bindResizer() {
  const handle = document.getElementById('resizer')
  const body = document.querySelector('.stage-body')
  if (!handle || !body) return
  let dragging = false
  handle.addEventListener('pointerdown', (e) => {
    dragging = true
    handle.setPointerCapture(e.pointerId)
    document.body.classList.add('resizing')
  })
  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return
    const rect = body.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = Math.min(75, Math.max(25, (x / rect.width) * 100))
    body.style.setProperty('--split', pct + '%')
  })
  const stop = () => {
    dragging = false
    document.body.classList.remove('resizing')
  }
  handle.addEventListener('pointerup', stop)
  handle.addEventListener('pointercancel', stop)
}

function afterRender() {
  document.body.classList.toggle('on-studio', state.screen === 'studio')
  mountEditor()
  bindResizer()
  const log = document.getElementById('chat-log')
  if (log) log.scrollTop = log.scrollHeight
  const chat = document.getElementById('chat-input')
  const welcome = document.getElementById('welcome-input')
  chat?.addEventListener('input', () => autosize(chat))
  welcome?.focus()
  const file = document.getElementById('import-file')
  file?.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0]
    e.target.value = ''
    if (f) importProjectFile(f)
  })
}

function render() {
  if (state.editor) {
    state.editor.destroy()
    state.editor = null
  }
  appEl.innerHTML = shell()
  afterRender()
}

appEl.addEventListener('click', (e) => {
  const t = e.target.closest('[data-act],[data-view],[data-device],[data-ex],[data-quick],[data-apply],[data-open],[data-del]')
  if (!t) {
    if (e.target.classList.contains('overlay')) {
      state.settingsOpen = false
      state.projectsOpen = false
      render()
    }
    return
  }
  const act = t.dataset.act
  if (act === 'settings') {
    state.settingsOpen = true
    render()
  } else if (act === 'close-settings') {
    state.settingsOpen = false
    render()
  } else if (act === 'save-settings') {
    state.settings.apiKey = document.getElementById('set-key').value.trim()
    state.settings.model = document.getElementById('set-model').value
    state.settings.customModel = document.getElementById('set-custom').value.trim()
    state.settings.autoApply = document.getElementById('set-auto').checked
    persist()
    state.settingsOpen = false
    render()
    toast('Настройки сохранены')
  } else if (act === 'save') {
    saveToCatalog()
  } else if (act === 'import') {
    document.getElementById('import-file')?.click()
  } else if (act === 'new-project') {
    newProject()
  } else if (act === 'download') {
    downloadHtml()
  } else if (act === 'copy') {
    copyHtml()
  } else if (act === 'open') {
    openPreviewTab()
  } else if (act === 'undo') {
    undoHtml()
  } else if (act === 'toggle-chat') {
    state.chatOpen = !state.chatOpen
    render()
  } else if (act === 'stop') {
    stopStream()
  } else if (act === 'home') {
    goHome()
  } else if (act === 'blank') {
    startFreshProject('Мой сайт')
    state.screen = 'studio'
    setHtml(BLANK_HTML, { snapshot: false })
    render()
  }

  if (t.dataset.view) {
    state.view = t.dataset.view
    render()
  }
  if (t.dataset.device) {
    state.device = t.dataset.device
    document.querySelectorAll('[data-device]').forEach((b) => b.classList.toggle('on', b.dataset.device === state.device))
    const pane = document.querySelector('.device')
    if (pane) pane.className = `device device-${state.device}`
  }
  if (t.dataset.ex != null) {
    const ex = EXAMPLES[Number(t.dataset.ex)]
    const input = document.getElementById('welcome-input')
    if (input && ex) {
      input.value = ex.p
      input.focus()
    }
  }
  if (t.dataset.quick) sendPrompt(t.dataset.quick)
  if (t.dataset.apply != null) applyFromMessage(Number(t.dataset.apply))
  if (t.dataset.open) switchProject(t.dataset.open)
  if (t.dataset.del) {
    if (confirm('Удалить этот сайт?')) deleteProject(t.dataset.del)
  }
})

appEl.addEventListener('submit', (e) => {
  if (e.target.id === 'welcome-form') {
    e.preventDefault()
    sendPrompt(document.getElementById('welcome-input').value, { fromWelcome: true })
  }
  if (e.target.id === 'chat-form') {
    e.preventDefault()
    sendPrompt(document.getElementById('chat-input').value)
  }
})

appEl.addEventListener('keydown', (e) => {
  if (e.target.id === 'chat-input' || e.target.id === 'welcome-input') {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      e.target.form?.requestSubmit()
    }
  }
})

appEl.addEventListener('change', (e) => {
  if (e.target.id === 'proj-name') {
    const p = current()
    if (p) {
      p.name = e.target.value.trim() || 'Без названия'
      touch(p)
      persist()
    }
  }
})

appEl.addEventListener('input', (e) => {
  if (e.target.id === 'proj-name') {
    const p = current()
    if (p) {
      p.name = e.target.value
      touch(p)
      scheduleSave()
    }
  }
})

document.addEventListener('click', async (e) => {
  if (e.target.id === 'set-test' || e.target.closest?.('#set-test')) {
    const key = document.getElementById('set-key')?.value.trim()
    const model = document.getElementById('set-custom')?.value.trim() || document.getElementById('set-model')?.value
    if (!key) return toast('Вставьте ключ', 'warn')
    const btn = document.getElementById('set-test')
    btn.disabled = true
    btn.textContent = 'Проверяю…'
    try {
      await testKey(key, model)
      toast('Ключ работает')
    } catch (err) {
      toast(err.message, 'err')
    } finally {
      btn.disabled = false
      btn.textContent = 'Проверить ключ'
    }
  }
})

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
    e.preventDefault()
    if (state.screen === 'studio') saveToCatalog()
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
    e.preventDefault()
    openPreviewTab()
  }
})

saveSettings(state.settings)
render()
