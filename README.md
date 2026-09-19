<h1 align="center" style="font-size:72px; margin-bottom:0;">Lumina</h1>

<p align="center"><b>Write a site. Or ask AI. Browser website studio with live preview and Groq AI.</b></p>

## Table of Contents

1. What is Lumina
2. Key Features
3. How It Works
4. Landing Page
5. Editor Workspace
6. AI Assistant Panel
7. Preview and Device Modes
8. Groq API Setup
9. Groq Models
10. Privacy, Run, Deploy, FAQ, License

---

## 1. What is Lumina

Lumina is a client-side website builder. You can write HTML, CSS and JavaScript manually with instant preview, or describe the site in plain words and let AI generate a complete single-file website.

There is no backend and no account system. All editing, preview and saving happen in the browser. The only external request is to `api.groq.com` when you use AI generation.

## 2. Key Features

| Feature | Description |
| --- | --- |
| `Code editor` | Full HTML editing with syntax highlight, line numbers, instant preview |
| `AI generation` | Builds complete responsive page from text description |
| `AI editing` | Rebuilds site from chat instructions |
| `Live preview` | Updates on every keystroke, no reload needed |
| `Devices` | Desktop, Tablet and Mobile viewport switcher |
| `Quick actions` | Bolder design, Animations, Mobile version, Different palette |
| `Templates` | Bakery, Portfolio, Yoga Studio, Application, Restaurant, Event |
| `Save / Export` | Save in browser, download as `index.html` |

## 3. How It Works

1. Start on home page: describe idea or click Write yourself.
2. Build in editor: code in center, AI chat on left, preview on right.
3. Ship: Save in browser or Export file.

## 4. Landing Page

Dark hero screen with animated network background.

| Element | Location | What it does |
| --- | --- | --- |
| `Logo Lumina` | Top left | Branding, back to home |
| `Upload button` | Top right | Loads your `.html` file into editor |
| `Label SITE STUDIO WITH GROQ` | Above headline | Explains stack |
| `Headline Write a site. Or ask AI.` | Center | Manual mode and AI mode |
| `Description` | Under headline | Describe page in own words, Lumina assembles `HTML`, `CSS`, `JS` |
| `Prompt textarea` | Center card | Input for idea, ex. coffee shop landing |
| `Write yourself` | Card button | Opens editor with starter template, no AI call |
| `Create with AI` | Card highlighted button | Sends description to Groq, opens editor with result |
| `Template chips` | Bottom of card | `Bakery`, `Portfolio`, `Yoga Studio`, `Application`, `Restaurant`, `Event` |

## 5. Editor Workspace

Three zones: header toolbar, left AI panel, center code, right preview.

### 5.1 Top Toolbar

| Control | Code | Description |
| --- | --- | --- |
| Title | `My site` | Editable project name |
| Save | `Save` | Saves to `localStorage` |
| Home | `Home` | Back to landing |
| Undo / Redo | `Undo` / `Redo` | Code history |
| Copy | `Copy` | Copies full code to clipboard |
| Open | `Open in new tab` | Preview in separate tab |
| Export | `Export` | Downloads `index.html` |
| Settings | `Gear icon` | Opens Groq API modal |

### 5.2 View Tabs

| Tab | Code | Layout |
| --- | --- | --- |
| Both | `Both` | Code + preview side by side |
| Code | `Code` | Full-width editor |
| Preview | `Preview` | Full-width rendered site |

## 6. AI Assistant Panel

Left sidebar. Helper text: describe idea or edit, assistant rebuilds site.

| Element | Code | Description |
| --- | --- | --- |
| Chat input | `What to change on the site?` | Free instruction, ex. make darker, add price table |
| Send | `Send button` | Sends code + instruction to Groq model |
| Bolder | `Bolder design` | Larger type, stronger contrast |
| Animations | `Animations` | CSS transitions and hover effects |
| Mobile | `Mobile version` | Improves responsive layout |
| Palette | `Different palette` | Regenerates color scheme |

## 7. Preview and Device Modes

Top right of preview area. Changes only preview width.

| Mode | Button | Width | Use case |
| --- | --- | --- | --- |
| Desktop | `Desk` | 100 percent | Laptops and monitors |
| Tablet | `Tab` | `768px` | Collapse check |
| Mobile | `Mob` | `375px` | Phone check |

Starter preview shows heading `Start writing your site` and text `This HTML can be edited on the left, preview updates instantly`.

## 8. Groq API Setup - Where and How to Get API Key

AI requires a personal Groq API key. Free to create.

### 8.1 Links

| Resource | URL | Purpose |
| --- | --- | --- |
| API Keys page | `https://console.groq.com/keys` | Create and copy keys |
| Console home | `https://console.groq.com` | Dashboard and usage |
| Models docs | `https://console.groq.com/docs/models` | List of model IDs |
| Main docs | `https://console.groq.com/docs` | API reference |
| Groq site | `https://groq.com` | Official site |

Full URLs for copy:

- https://console.groq.com/keys
- https://console.groq.com
- https://console.groq.com/docs/models
- https://console.groq.com/docs

### 8.2 Step by step

1. Go to https://console.groq.com/keys
2. Sign up or Sign in with Google, GitHub or email.
3. Open `API Keys` section in left menu.
4. Click `Create API Key`, name it `lumina`, click Submit.
5. Copy key starting with `gsk_`. It shows only once.
6. In Lumina click gear icon, paste key into `API-KEY` field.
7. Choose model, click `Check key`, then `Save`.

### 8.3 Groq API modal fields

| Field | Code | Description |
| --- | --- | --- |
| API key | `API-KEY` | Password field, stored only in browser |
| Model list | `MODEL` | Dropdown, default `GPT-OSS 120B - Quality` |
| Custom model | `Custom model (optional)` | Manual ID input, overrides dropdown |
| Auto apply | `Apply HTML immediately` | Checkbox, replace editor at once |
| Check | `Check key` | Test request to Groq |
| Save | `Save` | Saves locally, closes modal |

## 9. Groq Models - Where and How to Get Model IDs

Model ID is exact string for API, ex. `llama-3.3-70b-versatile`.

How to get:

1. Open https://console.groq.com/docs/models
2. Copy value from `Model ID` column exactly.
3. In Lumina paste into `Custom model` field, click Save.

### Recommended models

| Name in Lumina | Model ID code | Strengths | Use for |
| --- | --- | --- | --- |
| GPT-OSS 120B Quality | `openai/gpt-oss-120b` | Best layout quality | Full site generation, default |
| Llama 3.3 70B | `llama-3.3-70b-versatile` | Fast, versatile | Daily edits |
| Llama 3.1 8B Instant | `llama-3.1-8b-instant` | Very fast | Small changes |
| Mixtral 8x7B | `mixtral-8x7b-32768` | `32k` context | Long pages |
| Gemma 2 9B | `gemma2-9b-it` | Lightweight | Simple prototypes |

If you see `model_not_found`, ID is outdated. Take fresh ID from docs page.

## 10. Privacy and Storage

| Data | Where | Sent to |
| --- | --- | --- |
| `API key` | `localStorage` only | Only to `api.groq.com` |
| `Model ID` | `localStorage` only | Only as `model` param |
| `Project HTML` | `localStorage` + file | To Groq only on Generate |

Clear site storage to delete all data. No server copy exists.

## 11. Run Locally

```
git clone https://github.com/YOUR_USERNAME/lumina.git
cd lumina
# open index.html in browser, no build needed
```

Need: Chrome, Edge, Firefox or Safari. Internet needed only for Groq calls.

## 12. Deploy to GitHub Pages

1. Push to public GitHub repo.
2. Settings - Pages - Deploy from branch - `main` - `root`.
3. Open `https://YOUR_USERNAME.github.io/lumina/` and enter key in settings.

## 13. FAQ

| Question | Answer |
| --- | --- |
| AI does nothing? | Check key is saved, `Check key` passes, check 401 error |
| Invalid model? | Copy fresh ID from https://console.groq.com/docs/models |
| Blank preview? | Check unclosed tags in `Code` tab |
| Where is project? | In `localStorage`, use `Export` for backup |
| Free? | Lumina free, Groq has free tier with limits |
| Without AI? | Yes, `Write yourself` needs no key |

## 14. License

MIT License. You can use, modify and host Lumina. Generated sites belong to you.

**Lumina - describe it, generate it, edit it, ship it.**
