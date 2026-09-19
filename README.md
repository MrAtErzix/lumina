# Lumina

Студия сайтов с ИИ (Groq): пишете HTML сами или описываете страницу словами — сразу видите превью.

**Сайт (статика):** https://mraterzix.github.io/lumina/

Аккаунты и база на GitHub Pages не работают — нужен сервер.

## Запуск с аккаунтами

```bash
npm install
cp .env.example .env
```

Создайте [OAuth App](https://github.com/settings/developers):

- Homepage URL: `http://localhost:5173`
- Authorization callback URL: `http://localhost:5173/api/auth/github/callback`

В `.env`:

```
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
PORT=3001
```

Два процесса:

```bash
npm run server
npm run dev
```

Или после сборки один процесс (Express раздаёт UI и API):

```bash
npm run build
npm start
```

Войдите по **почте и паролю** (или через GitHub, если OAuth настроен). На GitHub Pages аккаунт хранится в браузере; при `npm start` — в SQLite `data/lumina.db`. Ключ Groq по-прежнему только в браузере.

## Стек

- Express — API и сессии
- SQLite (`better-sqlite3`) — пользователи, сессии, проекты
- GitHub OAuth — вход
- Vite — интерфейс
