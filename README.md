Вот готовый HTML для `README.md`. Весь текст на английском, без смайликов, с таблицами. Можешь вставить это прямо в файл на GitHub:

```html
<h1 align="center" style="font-size:72px; margin-bottom:0;">Lumina</h1>
<p align="center"><b>Write a site. Or ask AI. Browser-based website studio with live preview and Groq AI integration.</b></p>
<p align="center">
<a href="https://console.groq.com/keys">Get Groq API Key</a> |
<a href="https://console.groq.com/docs/models">Groq Models Docs</a> |
<a href="https://groq.com">Groq Official Site</a>
</p>
<hr>

<h2>Table of Contents</h2>
<ol>
<li><a href="#what-is-lumina">What is Lumina</a></li>
<li><a href="#key-features">Key Features</a></li>
<li><a href="#how-it-works">How It Works</a></li>
<li><a href="#landing-page">Landing Page</a></li>
<li><a href="#editor-workspace">Editor Workspace</a></li>
<li><a href="#ai-assistant">AI Assistant Panel</a></li>
<li><a href="#preview-modes">Preview and Device Modes</a></li>
<li><a href="#groq-api-setup">Groq API Setup - Where and How to Get API Key</a></li>
<li><a href="#groq-models">Groq Models - Where and How to Get Model IDs</a></li>
<li><a href="#privacy-and-storage">Privacy and Storage</a></li>
<li><a href="#run-locally">Run Locally</a></li>
<li><a href="#deploy-to-github-pages">Deploy to GitHub Pages</a></li>
<li><a href="#faq">FAQ</a></li>
<li><a href="#license">License</a></li>
</ol>
<hr>

<h2 id="what-is-lumina">1. What is Lumina</h2>
<p><b>Lumina</b> is a client-side website builder and editor. You can write HTML, CSS and JavaScript manually with instant visual preview, or describe the site in plain words and let built-in AI generate a complete single-file website for you. You provide your own Groq API key, Lumina sends your prompt to Groq and inserts the generated code into the editor.</p>
<p>Lumina is a static web app. There is no backend, no database and no account system. All code editing, preview rendering and project saving happen in the browser. The only external request is to <code>api.groq.com</code> when you use AI generation.</p>
<p>Target audience: beginners who want a landing page fast, freelancers who prototype for clients, developers who want a clean sandbox for HTML/CSS/JS with AI help.</p>

<h2 id="key-features">2. Key Features</h2>
<table>
<tr><th>Feature</th><th>Description</th></tr>
<tr><td><b>Manual code editor</b></td><td>Full HTML document editing with syntax highlighting, line numbers and instant error-free preview. You own the code.</td></tr>
<tr><td><b>AI website generation</b></td><td>Type a description on the home screen or in the editor, AI builds a complete responsive page with styles and scripts.</td></tr>
<tr><td><b>AI iterative editing</b></td><td>Ask for changes in chat: redesign, animations, new palette, mobile adaptation. AI rebuilds the code keeping your idea.</td></tr>
<tr><td><b>Live preview</b></td><td>Right-side iframe preview updates immediately on every keystroke. No build, no reload button needed.</td></tr>
<tr><td><b>Desktop / Tablet / Mobile views</b></td><td>One-click viewport switcher to test responsive layout at different widths.</td></tr>
<tr><td><b>Quick prompt chips</b></td><td>One-click actions: Bolder design, Animations, Mobile version, Different palette.</td></tr>
<tr><td><b>Template starters</b></td><td>Ready ideas for Bakery, Portfolio, Yoga Studio, Application, Restaurant, Event.</td></tr>
<tr><td><b>Save, Upload, Export</b></td><td>Save project in browser, upload your HTML file, export result as a standalone .html file.</td></tr>
<tr><td><b>Custom Groq model support</b></td><td>Use preset list or paste any Groq model ID manually.</td></tr>
</table>

<h2 id="how-it-works">3. How It Works</h2>
<ol>
<li><b>Start:</b> On the home page describe your site or click Write yourself to start from a blank template. You can also click a template chip to preload an idea.</li>
<li><b>Build:</b> In the editor you work with code in the center, AI chat on the left and live site on the right. Switch between Code, Preview or Both modes.</li>
<li><b>Ship:</b> Click Save to keep it in the browser, or Export to download a single HTML file you can host anywhere.</li>
</ol>

<h2 id="landing-page">4. Landing Page</h2>
<p>The first screen is a dark hero section with animated network background. Structure from top to bottom:</p>
<table>
<tr><th>Element</th><th>Location</th><th>What it does</th></tr>
<tr><td><b>Lumina logo</b></td><td>Top left</td><td>Project branding, returns to home.</td></tr>
<tr><td><b>Upload button</b></td><td>Top right</td><td>Loads your existing .html file into the editor.</td></tr>
<tr><td><b>Label: SITE STUDIO WITH GROQ</b></td><td>Above headline</td><td>Explains the core stack.</td></tr>
<tr><td><b>Headline: Write a site. Or ask AI.</b></td><td>Center</td><td>Main value proposition. First line is manual mode, second line is AI mode.</td></tr>
<tr><td><b>Description text</b></td><td>Under headline</td><td>Explains: describe the page in your own words, Lumina assembles full HTML, CSS and JS, code can be edited by hand with instant preview.</td></tr>
<tr><td><b>Prompt textarea</b></td><td>Center card</td><td>Input for your idea. Placeholder example: coffee shop landing, dark wood, menu, booking form. The text is sent to Groq on generation.</td></tr>
<tr><td><b>Write yourself button</b></td><td>Inside prompt card</td><td>Opens editor with default starter template for manual coding, no AI call.</td></tr>
<tr><td><b>Create with AI button</b></td><td>Inside prompt card, highlighted</td><td>Sends your description to Groq API and opens editor with generated site.</td></tr>
<tr><td><b>Template chips</b></td><td>Bottom of card</td><td>Preset categories: Bakery, Portfolio, Yoga Studio, Application, Restaurant, Event. Click fills the prompt with a starter idea.</td></tr>
</table>

<h2 id="editor-workspace">5. Editor Workspace</h2>
<p>The editor has three zones: header toolbar, left AI panel, center code, right preview. On narrow screens panels collapse into tabs.</p>
<h3>5.1 Top Toolbar</h3>
<table>
<tr><th>Control</th><th>Description</th></tr>
<tr><td><b>Project title: My site</b></td><td>Editable name of current project, shown in the center of the header.</td></tr>
<tr><td><b>Save</b></td><td>Saves current HTML to browser localStorage.</td></tr>
<tr><td><b>Home</b></td><td>Back to landing page. Unsaved changes stay in memory for current session.</td></tr>
<tr><td><b>Undo / Redo</b></td><td>Step back and forward through code history.</td></tr>
<tr><td><b>Copy</b></td><td>Copies full code to clipboard.</td></tr>
<tr><td><b>Open in new tab</b></td><td>Opens rendered preview in a separate browser tab.</td></tr>
<tr><td><b>Export</b></td><td>Downloads current project as index.html file.</td></tr>
<tr><td><b>Settings gear</b></td><td>Opens Groq API modal for key and model configuration.</td></tr>
</table>
<h3>5.2 View Tabs</h3>
<table>
<tr><th>Tab</th><th>Layout</th></tr>
<tr><td><b>Both</b></td><td>Code editor on the left/center, live preview on the right. Best for active building.</td></tr>
<tr><td><b>Code</b></td><td>Full-width editor, preview hidden. Best for large edits.</td></tr>
<tr><td><b>Preview</b></td><td>Full-width rendered site, editor hidden. Best for presentation and testing.</td></tr>
</table>

<h2 id="ai-assistant">6. AI Assistant Panel</h2>
<p>Left sidebar titled AI-assistant. Helper text: describe an idea or edit, assistant will rebuild the site. You can also write code manually on the right.</p>
<table>
<tr><th>Element</th><th>Description</th></tr>
<tr><td><b>Chat input: What to change on the site?</b></td><td>Free-form instruction field. Example: Make it darker, add hero with photo, add price table, translate to English.</td></tr>
<tr><td><b>Send button</b></td><td>Sends current code plus your instruction to selected Groq model.</td></tr>
<tr><td><b>Bolder design</b></td><td>Quick action that asks AI to make typography larger, stronger contrast and more expressive layout.</td></tr>
<tr><td><b>Animations</b></td><td>Quick action that asks AI to add CSS transitions, hover effects and scroll animations.</td></tr>
<tr><td><b>Mobile version</b></td><td>Quick action that asks AI to improve responsiveness and mobile layout.</td></tr>
<tr><td><b>Different palette</b></td><td>Quick action that asks AI to regenerate the color scheme while keeping structure.</td></tr>
</table>
<p>Flow: you send a message, model returns a full HTML document, Lumina extracts code and replaces editor content and preview. If auto-apply is disabled in settings, you confirm before apply.</p>

<h2 id="preview-modes">7. Preview and Device Modes</h2>
<p>Top right of preview area has a device switcher. It only changes preview width, not your code.</p>
<table>
<tr><th>Mode</th><th>Button label</th><th>Use case</th></tr>
<tr><td><b>Desktop</b></td><td>Desk</td><td>Full-width check for laptops and monitors.</td></tr>
<tr><td><b>Tablet</b></td><td>Tab</td><td>Medium width around 768px, checks two-column to one-column collapse.</td></tr>
<tr><td><b>Mobile</b></td><td>Mob</td><td>Narrow phone frame around 375px, checks text size, buttons and stacking.</td></tr>
</table>
<p>Default starter content in preview: heading Start writing your site with subtext This HTML can be edited on the left, preview updates instantly. This confirms live binding works.</p>

<h2 id="groq-api-setup">8. Groq API Setup - Where and How to Get API Key</h2>
<p>AI generation requires a personal Groq API key. It is free to create, with generous free limits. Lumina never sees your key, it stays in your browser and goes directly to Groq.</p>
<h3>8.1 Links you need</h3>
<table>
<tr><th>Resource</th><th>URL</th><th>Purpose</th></tr>
<tr><td><b>API Keys page</b></td><td><a href="https://console.groq.com/keys">https://console.groq.com/keys</a></td><td>Create, copy and delete your keys.</td></tr>
<tr><td><b>Groq Console home</b></td><td><a href="https://console.groq.com">https://console.groq.com</a></td><td>Dashboard, usage and billing.</td></tr>
<tr><td><b>Models documentation</b></td><td><a href="https://console.groq.com/docs/models">https://console.groq.com/docs/models</a></td><td>Official list of model IDs.</td></tr>
<tr><td><b>Groq Docs</b></td><td><a href="https://console.groq.com/docs">https://console.groq.com/docs</a></td><td>API reference and rate limits.</td></tr>
</table>
<h3>8.2 Step by step to get the key</h3>
<ol>
<li>Go to <a href="https://console.groq.com/keys">console.groq.com/keys</a>.</li>
<li>Create account or Sign in. You can use Google, GitHub or email.</li>
<li>After login you will see GroqCloud Console. Open API Keys section from left menu.</li>
<li>Click Create API Key, enter a name like lumina, click Submit.</li>
<li>Copy the key starting with gsk_. It is shown only once. Store it safely.</li>
<li>Open Lumina, click gear icon in top right to open Groq API modal.</li>
<li>Paste key into API-KEY field, choose model, click Check key to verify, then click Save.</li>
</ol>
<h3>8.3 Groq API modal fields</h3>
<table>
<tr><th>Field</th><th>Description</th></tr>
<tr><td><b>API-KEY</b></td><td>Password field for gsk_ key. Stored only in this browser via localStorage.</td></tr>
<tr><td><b>MODEL dropdown</b></td><td>Preset list, default is GPT-OSS 120B - Quality. Pick speed vs quality tradeoff.</td></tr>
<tr><td><b>Custom model (optional)</b></td><td>Text input for any Groq model ID, for example id model Groq. Overrides dropdown if filled.</td></tr>
<tr><td><b>Apply HTML from AI response immediately</b></td><td>Checkbox. If enabled, generated code replaces editor at once. If disabled, you review first.</td></tr>
<tr><td><b>Check key</b></td><td>Sends a tiny test request to Groq to confirm key is valid.</td></tr>
<tr><td><b>Save</b></td><td>Saves key and model choice locally and closes modal.</td></tr>
</table>

<h2 id="groq-models">9. Groq Models - Where and How to Get Model IDs</h2>
<p>Model ID is the exact string Groq API expects, for example <code>llama-3.3-70b-versatile</code>. You can select from Lumina dropdown or use any current ID from official docs.</p>
<h3>9.1 Where to find IDs</h3>
<ol>
<li>Open <a href="https://console.groq.com/docs/models">console.groq.com/docs/models</a>.</li>
<li>Find table with Model ID, developer, context window and notes.</li>
<li>Copy the ID column exactly, including dashes and slashes.</li>
<li>In Lumina settings paste it into Custom model field and Save.</li>
</ol>
<h3>9.2 Recommended models for Lumina</h3>
<table>
<tr><th>Display name in Lumina</th><th>Model ID to copy</th><th>Strengths</th><th>When to use</th></tr>
<tr><td><b>GPT-OSS 120B - Quality</b></td><td><code>openai/gpt-oss-120b</code></td><td>Best layout quality, follows long instructions, clean Tailwind-like CSS</td><td>Default choice for full site generation</td></tr>
<tr><td><b>Llama 3.3 70B</b></td><td><code>llama-3.3-70b-versatile</code></td><td>Fast and versatile, good balance</td><td>Daily edits and rebuilds</td></tr>
<tr><td><b>Llama 3.1 8B Instant</b></td><td><code>llama-3.1-8b-instant</code></td><td>Very fast, low latency</td><td>Small text changes, quick ideas</td></tr>
<tr><td><b>Mixtral 8x7B</b></td><td><code>mixtral-8x7b-32768</code></td><td>Large 32k context, multilingual</td><td>Long pages with lots of code</td></tr>
<tr><td><b>Gemma 2 9B</b></td><td><code>gemma2-9b-it</code></td><td>Lightweight Google model</td><td>Simple prototypes</td></tr>
</table>
<p>Note: Groq deprecates old models over time. If Check key returns model_not_found, return to Models Docs page and pick an active ID.</p>

<h2 id="privacy-and-storage">10. Privacy and Storage</h2>
<table>
<tr><th>Data</th><th>Where stored</th><th>Sent to network</th></tr>
<tr><td><b>Groq API key</b></td><td>Browser localStorage only</td><td>Only to api.groq.com as Bearer token</td></tr>
<tr><td><b>Selected model ID</b></td><td>Browser localStorage only</td><td>Only as model parameter to Groq</td></tr>
<tr><td><b>Project HTML</b></td><td>Browser localStorage and exported file</td><td>Sent to Groq only as context when you press Generate</td></tr>
</table>
<p>To remove all data, clear site storage in browser settings. There is no server copy to delete.</p>

<h2 id="run-locally">11. Run Locally</h2>
<pre><code>git clone https://github.com/YOUR_USERNAME/lumina.git
cd lumina
# just open index.html in browser, no build required
</code></pre>
<p>Requirements: modern Chrome, Edge, Firefox or Safari. Internet needed only for Groq AI calls and CDN fonts if used in generated code.</p>

<h2 id="deploy-to-github-pages">12. Deploy to GitHub Pages</h2>
<ol>
<li>Push project to public GitHub repository.</li>
<li>Go to Settings - Pages - Deploy from branch - main - root.</li>
<li>Open https://YOUR_USERNAME.github.io/lumina/ and paste your Groq key in settings.</li>
</ol>

<h2 id="faq">13. FAQ</h2>
<table>
<tr><th>Question</th><th>Answer</th></tr>
<tr><td><b>AI button does nothing?</b></td><td>Open settings, ensure API key is saved and Check key passes. Check browser console for 401 or rate limit errors.</td></tr>
<tr><td><b>Invalid model error?</b></td><td>Model was removed by Groq. Copy fresh ID from Models Docs page into custom model field.</td></tr>
<tr><td><b>Preview is blank?</b></td><td>Check for unclosed tags in code. Switch to Code tab, validate HTML structure.</td></tr>
<tr><td><b>Where is my project saved?</b></td><td>In localStorage of the same browser and domain. Use Export to get a file backup.</td></tr>
<tr><td><b>Is it free?</b></td><td>Lumina code is free. Groq has a free tier with rate limits. Check Groq pricing for details.</td></tr>
<tr><td><b>Can I use without AI?</b></td><td>Yes. Click Write yourself and code fully manually. No key needed.</td></tr>
</table>

<h2 id="license">14. License</h2>
<p>MIT License. You can use, modify and host Lumina for personal and commercial projects. Generated sites belong to you.</p>
<hr>
<p align="center"><b>Lumina - describe it, generate it, edit it, ship it.</b></p>
```
