export const MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', hint: 'Качество' },
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B', hint: 'Скорость' },
  { id: 'openai/gpt-oss-120b', name: 'GPT-OSS 120B', hint: 'Код' },
  { id: 'openai/gpt-oss-20b', name: 'GPT-OSS 20B', hint: 'Быстрый код' },
  { id: 'qwen/qwen3-32b', name: 'Qwen 3 32B', hint: 'Баланс' },
  { id: 'moonshotai/kimi-k2-instruct-0905', name: 'Kimi K2', hint: 'Контекст' },
  { id: 'meta-llama/llama-4-scout-17b-16e-instruct', name: 'Llama 4 Scout', hint: 'Llama 4' },
]

export const SYSTEM_PROMPT = `Ты — ведущий арт-директор и фронтенд-инженер студии Lumina. Ты создаёшь законченные одностраничные сайты: один HTML-файл, CSS и JS внутри.

Жёсткие правила ответа:
1. Сначала 1–3 коротких предложения по-русски (что сделал / что изменил). Без длинных объяснений, без списков файлов.
2. Затем ВСЕГДА полный HTML-документ в блоке \`\`\`html ... \`\`\`. Не обрезай. Не пиши «остальной код такой же».
3. При правках возвращай документ ЦЕЛИКОМ, сохраняя всё, что пользователь не просил менять.

Дизайн:
- Каждый сайт выглядит как работа студии, не как шаблон. Запрещены клише: фиолетовый градиент на белом, Inter + серые карточки с мягкой тенью, «Lorem ipsum», generic hero «Welcome to our website».
- Типографика с https://fonts.bunny.net (не fonts.googleapis.com). Всегда указывай системные fallback.
- Смелая композиция: крупная типографика, нестандартная сетка, характерный цвет. Палитра уникальна под тему.
- Реалистичные тексты на языке пользователя (по умолчанию русский). Названия, цены, отзывы, адреса — выдуманные, но правдоподобные.
- Адаптив (mobile-first + desktop), плавные анимации (не навязчивые), :focus-visible, достаточный контраст, alt у картинок.
- Картинки: конкретные URL Unsplash вида https://images.unsplash.com/photo-XXXX?auto=format&fit=crop&w=1600&q=80 или SVG/CSS-паттерны. Не используй picsum, placeholder.com и битые ссылки.
- Интерактив без бэкенда: меню, табы, слайдеры, аккордеоны, формы. Форма по submit показывает аккуратный toast «Отправлено» и не уходит с страницы.
- Подключи smooth scroll, состояние :hover, появление секций при скролле.
- Если просят лендинг — полноценный: nav, hero, 4–7 секций, футер. Не одноэкранная заглушка.

Код: валидный HTML5, CSS-переменные, без внешних JS-библиотек, без markdown внутри HTML.`

export function extractHtml(text) {
  if (!text) return null
  const fences = [...text.matchAll(/```(?:html|HTML)?\s*([\s\S]*?)```/g)].map((m) => m[1].trim())
  const fromFence = fences
    .filter((b) => /<!DOCTYPE|<html[\s>]|<body[\s>]/i.test(b) || (b.includes('<') && b.length > 80))
    .sort((a, b) => b.length - a.length)[0]
  if (fromFence) return fromFence
  const doc = text.match(/<!DOCTYPE html[\s\S]*<\/html\s*>/i)
  if (doc) return doc[0].trim()
  const htmlTag = text.match(/<html[\s\S]*<\/html\s*>/i)
  if (htmlTag) return htmlTag[0].trim()
  return null
}

export function commentaryOf(text) {
  if (!text) return ''
  let t = text.replace(/```[\s\S]*?```/g, '').trim()
  t = t.replace(/<!DOCTYPE html[\s\S]*<\/html\s*>/i, '').trim()
  return t.replace(/\n{3,}/g, '\n\n').trim()
}

function truncate(str, n) {
  if (!str || str.length <= n) return str
  return str.slice(0, n) + '\n…[обрезано]…'
}

export function buildMessages(project, extraUser) {
  const messages = [{ role: 'system', content: SYSTEM_PROMPT }]
  const html = project.html || ''
  if (html) {
    messages.push({
      role: 'user',
      content:
        'Это текущий полный HTML сайта. Следующие правки применяй к нему. Не спрашивай подтверждения — сразу отдай обновлённый документ.\n\n```html\n' +
        truncate(html, 90000) +
        '\n```',
    })
    messages.push({
      role: 'assistant',
      content: 'Понял, работаю с этим HTML. Дальше верну полный обновлённый документ.',
    })
  }
  const hist = (project.messages || []).slice(-8)
  for (const m of hist) {
    if (m.role === 'user') messages.push({ role: 'user', content: m.content })
    else {
      const note = commentaryOf(m.content) || 'Сайт обновлён.'
      messages.push({ role: 'assistant', content: truncate(note, 600) })
    }
  }
  if (extraUser) messages.push({ role: 'user', content: extraUser })
  return messages
}

const GROQ_PATHS = ['/groq/chat/completions', 'https://api.groq.com/openai/v1/chat/completions']

async function groqFetch(body, { apiKey, signal }) {
  let lastErr
  for (const url of GROQ_PATHS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body,
        signal,
      })
      if (!res.ok && url.startsWith('/') && (res.status === 404 || res.status === 502 || res.status === 503)) {
        lastErr = new Error('Прокси Groq недоступен')
        continue
      }
      return res
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr || new Error('Нет соединения с Groq')
}

function failFromResponse(res, jsonOrText) {
  const detail = typeof jsonOrText === 'string' ? jsonOrText : jsonOrText?.error?.message || JSON.stringify(jsonOrText)
  if (res.status === 401) return new Error('Неверный API-ключ Groq. Проверьте ключ в настройках.')
  if (res.status === 429) return new Error('Слишком много запросов. Подождите немного и попробуйте снова.')
  return new Error(detail || `Ошибка Groq (${res.status})`)
}

export async function chatStream({ apiKey, model, messages, onDelta, signal }) {
  const res = await groqFetch(
    JSON.stringify({
      model,
      messages,
      temperature: 0.65,
      stream: true,
      max_tokens: 16000,
    }),
    { apiKey, signal },
  )

  if (!res.ok) {
    let payload
    try {
      payload = await res.json()
    } catch {
      payload = await res.text()
    }
    throw failFromResponse(res, payload)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let full = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split('\n')
    buffer = parts.pop() || ''
    for (const line of parts) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('data:')) continue
      const data = trimmed.slice(5).trim()
      if (data === '[DONE]') continue
      try {
        const json = JSON.parse(data)
        const token = json.choices?.[0]?.delta?.content || ''
        if (token) {
          full += token
          onDelta?.(full, token)
        }
      } catch {
        /* ignore partial json */
      }
    }
  }
  return full
}

export async function testKey(apiKey, model) {
  const res = await groqFetch(
    JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Ответь одним словом: ок' }],
      max_tokens: 8,
    }),
    { apiKey },
  )
  if (!res.ok) {
    let payload
    try {
      payload = await res.json()
    } catch {
      payload = ''
    }
    throw failFromResponse(res, payload)
  }
  return true
}
