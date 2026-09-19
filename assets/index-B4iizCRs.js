(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const a of i)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function n(i){const a={};return i.integrity&&(a.integrity=i.integrity),i.referrerPolicy&&(a.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?a.credentials="include":i.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function s(i){if(i.ep)return;i.ep=!0;const a=n(i);fetch(i.href,a)}})();const ee="modulepreload",ne=function(t){return"/lumina/"+t},It={},oe=function(e,n,s){let i=Promise.resolve();if(n&&n.length>0){let r=function(l){return Promise.all(l.map(b=>Promise.resolve(b).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};document.getElementsByTagName("link");const u=document.querySelector("meta[property=csp-nonce]"),g=(u==null?void 0:u.nonce)||(u==null?void 0:u.getAttribute("nonce"));i=r(n.map(l=>{if(l=ne(l),l in It)return;It[l]=!0;const b=l.endsWith(".css"),v=b?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${l}"]${v}`))return;const T=document.createElement("link");if(T.rel=b?"stylesheet":ee,b||(T.as="script"),T.crossOrigin="",T.href=l,g&&T.setAttribute("nonce",g),document.head.appendChild(T),b)return new Promise((P,O)=>{T.addEventListener("load",P),T.addEventListener("error",()=>O(new Error(`Unable to preload CSS for ${l}`)))})}))}function a(r){const u=new Event("vite:preloadError",{cancelable:!0});if(u.payload=r,window.dispatchEvent(u),!u.defaultPrevented)throw r}return i.then(r=>{for(const u of r||[])u.status==="rejected"&&a(u.reason);return e().catch(a)})},ut="openai/gpt-oss-120b",se=new Set(["llama-3.3-70b-versatile","llama-3.1-8b-instant","llama3-70b-8192","llama3-8b-8192","qwen/qwen3-32b","qwen-qwq-32b","moonshotai/kimi-k2-instruct-0905","moonshotai/kimi-k2-instruct","meta-llama/llama-4-scout-17b-16e-instruct","meta-llama/llama-4-maverick-17b-128e-instruct"]),ae=[{id:"openai/gpt-oss-120b",name:"GPT-OSS 120B",hint:"Качество"},{id:"openai/gpt-oss-20b",name:"GPT-OSS 20B",hint:"Скорость"},{id:"qwen/qwen3.8-27b",name:"Qwen 3.8 27B",hint:"Баланс"},{id:"qwen/qwen3.6-27b",name:"Qwen 3.6 27B",hint:"Альтернатива"},{id:"groq/compound",name:"Groq Compound",hint:"Агент"},{id:"minimaxai/minimax-m2.7",name:"MiniMax M2.7",hint:"Preview"}];function ct(t){return!t||se.has(t)}const ie=`Ты — ведущий арт-директор и фронтенд-инженер студии Lumina. Ты создаёшь законченные одностраничные сайты: один HTML-файл, CSS и JS внутри.

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

Код: валидный HTML5, CSS-переменные, без внешних JS-библиотек, без markdown внутри HTML.`;function et(t){if(!t)return null;const n=[...t.matchAll(/```(?:html|HTML)?\s*([\s\S]*?)```/g)].map(a=>a[1].trim()).filter(a=>/<!DOCTYPE|<html[\s>]|<body[\s>]/i.test(a)||a.includes("<")&&a.length>80).sort((a,r)=>r.length-a.length)[0];if(n)return n;const s=t.match(/<!DOCTYPE html[\s\S]*<\/html\s*>/i);if(s)return s[0].trim();const i=t.match(/<html[\s\S]*<\/html\s*>/i);return i?i[0].trim():null}function mt(t){if(!t)return"";let e=t.replace(/```[\s\S]*?```/g,"").trim();return e=e.replace(/<!DOCTYPE html[\s\S]*<\/html\s*>/i,"").trim(),e.replace(/\n{3,}/g,`

`).trim()}function Tt(t,e){return!t||t.length<=e?t:t.slice(0,e)+`
…[обрезано]…`}function re(t,e){const n=[{role:"system",content:ie}],s=t.html||"";s&&(n.push({role:"user",content:"Это текущий полный HTML сайта. Следующие правки применяй к нему. Не спрашивай подтверждения — сразу отдай обновлённый документ.\n\n```html\n"+Tt(s,9e4)+"\n```"}),n.push({role:"assistant",content:"Понял, работаю с этим HTML. Дальше верну полный обновлённый документ."}));const i=(t.messages||[]).slice(-8);for(const a of i)if(a.role==="user")n.push({role:"user",content:a.content});else{const r=mt(a.content)||"Сайт обновлён.";n.push({role:"assistant",content:Tt(r,600)})}return e&&n.push({role:"user",content:e}),n}function ce(){const t="https://api.groq.com/openai/v1/chat/completions";return typeof location<"u"&&/github\.io$/i.test(location.hostname)?[t]:["/groq/chat/completions",t]}async function Ot(t,{apiKey:e,signal:n}){let s;for(const i of ce())try{const a=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`},body:t,signal:n});if(!a.ok&&i.startsWith("/")&&(a.status===404||a.status===502||a.status===503)){s=new Error("Прокси Groq недоступен");continue}return a}catch(a){s=a}throw s||new Error("Нет соединения с Groq")}function jt(t,e){var s;const n=typeof e=="string"?e:((s=e==null?void 0:e.error)==null?void 0:s.message)||JSON.stringify(e);return t.status===401?new Error("Неверный API-ключ Groq. Проверьте ключ в настройках."):t.status===429?new Error("Слишком много запросов. Подождите немного и попробуйте снова."):/does not exist|do not have access|model_not_found/i.test(String(n||""))?new Error("Эта модель Groq больше недоступна. Откройте настройки и выберите GPT-OSS 120B."):new Error(n||`Ошибка Groq (${t.status})`)}async function le({apiKey:t,model:e,messages:n,onDelta:s,signal:i}){var b,v,T;const a=await Ot(JSON.stringify({model:e,messages:n,temperature:.65,stream:!0,max_tokens:16e3}),{apiKey:t,signal:i});if(!a.ok){let P;try{P=await a.json()}catch{P=await a.text()}throw jt(a,P)}const r=a.body.getReader(),u=new TextDecoder;let g="",l="";for(;;){const{value:P,done:O}=await r.read();if(O)break;g+=u.decode(P,{stream:!0});const A=g.split(`
`);g=A.pop()||"";for(const q of A){const N=q.trim();if(!N.startsWith("data:"))continue;const J=N.slice(5).trim();if(J!=="[DONE]")try{const D=((T=(v=(b=JSON.parse(J).choices)==null?void 0:b[0])==null?void 0:v.delta)==null?void 0:T.content)||"";D&&(l+=D,s==null||s(l,D))}catch{}}}return l}async function de(t,e){const n=await Ot(JSON.stringify({model:e,messages:[{role:"user",content:"Ответь одним словом: ок"}],max_tokens:8}),{apiKey:t});if(!n.ok){let s;try{s=await n.json()}catch{s=""}throw jt(n,s)}return!0}const At="lumina.settings.v1",qt="lumina.projects.v1",lt="lumina.current.v1";const Bt=()=>({apiKey:"",model:ut,autoApply:!0,customModel:""});function ue(){try{const t={...Bt(),...JSON.parse(localStorage.getItem(At)||"{}")};return ct(t.model)&&(t.model=ut),ct(t.customModel)&&(t.customModel=""),t}catch{return Bt()}}function Ht(t){localStorage.setItem(At,JSON.stringify(t))}function V(){try{const t=JSON.parse(localStorage.getItem(qt)||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function me(t){localStorage.setItem(qt,JSON.stringify(t))}function ht(){return localStorage.getItem(lt)}function he(t){t?localStorage.setItem(lt,t):localStorage.removeItem(lt)}function pe(){return crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2)}function dt(t={}){const e=Date.now();return{id:pe(),name:"Новый сайт",html:"",messages:[],versions:[],createdAt:e,updatedAt:e,...t}}const X=700,Z=180,it=180,fe=168;function ge(t){const e=document.createElement("div");e.style.cssText=`position:absolute;left:-9999px;top:0;width:${t}cm;height:1px`,document.body.appendChild(e);const n=e.getBoundingClientRect().width;return e.remove(),n>1?n:t*37.7952755906}function ve(t){return!!(t&&t.closest&&t.closest("button, a, input, textarea, select, label, .hero-glass, .catalog, .topbar, .overlay, .studio, .modal, .toast"))}function ye(t,e){const n=(e-t.t)/t.life;return n<=0||n>=1?0:Math.min(n/.14,(1-n)/.26,1)}let Ct=!1;function we(){if(Ct)return;const t=document.querySelector(".holo-wrap"),e=document.querySelector(".holo");if(!t||!e)return;Ct=!0;const n=document.createElement("canvas");n.className="star-canvas",e.insertBefore(n,t);const s=n.getContext("2d"),i=document.createElement("canvas");i.className="trail-canvas",document.body.appendChild(i);const a=i.getContext("2d"),r=ge(2),u=Z*.78;let g=Math.max(Z,window.innerWidth*.72),l=Math.max(Z,window.innerHeight*.38),b=1.25,v=-.7,T=!1,P=!1,O=window.innerWidth*.5,A=window.innerHeight*.45,q=!1,N=performance.now(),J=N,B=null,D=0,Y=0;t.style.left="0",t.style.top="0",t.style.margin="0",t.style.cursor="grab";const _=[],K=[],C=[];function wt(c,m){const M=Math.min(2,window.devicePixelRatio||1);c.width=Math.floor(window.innerWidth*M),c.height=Math.floor(window.innerHeight*M),c.style.width=`${window.innerWidth}px`,c.style.height=`${window.innerHeight}px`,m.setTransform(M,0,0,M,0,0)}function bt(){wt(i,a),wt(n,s)}bt(),window.addEventListener("resize",bt);function at(c,m){K.push({x:c,y:m,t:performance.now()})}function Yt(c,m,M,p){_.push({x1:c,y1:m,x2:M,y2:p,t:performance.now()})}function W(c){if(C.length>=it)return;const m=window.innerWidth,M=window.innerHeight;let p,y;if(c&&q){const E=Math.random()*Math.PI*2,j=Math.pow(Math.random(),.45)*fe;p=O+Math.cos(E)*j,y=A+Math.sin(E)*j}else p=Math.random()*m,y=Math.random()*M;const h=c?.22+Math.random()*.85:.06+Math.random()*.32,$=Math.random()*Math.PI*2;let d=Math.cos($)*h,x=Math.sin($)*h;if(c&&q){const E=$+Math.PI/2;d+=Math.cos(E)*.18,x+=Math.sin(E)*.18}C.push({x:p,y,vx:d,vy:x,t:performance.now(),life:c?1200+Math.random()*1800:2600+Math.random()*3400,r:c?1.15+Math.random()*1.9:.65+Math.random()*1.45,near:c})}for(let c=0;c<48;c++)W(!1);function Xt(c,m){if(document.body.classList.contains("on-studio")){B=null;return}if(!B){B={x:c,y:m},at(c,m);return}if(Math.hypot(c-B.x,m-B.y)>r*6){B={x:c,y:m},at(c,m);return}for(;;){const p=c-B.x,y=m-B.y,h=Math.hypot(p,y);if(h<r)break;const $=p/h,d=y/h,x=B.x+$*r,E=B.y+d*r;Yt(B.x,B.y,x,E),at(x,E),B={x,y:E}}}function Zt(c){const m=c.clientX,M=c.clientY,p=performance.now(),y=q?Math.hypot(m-O,M-A):0;Xt(m,M);const h=m-g,$=M-l,d=Math.hypot(h,$);if(T){const x=Math.max(8,p-N);b=(m-O)/x*16,v=(M-A)/x*16,g=m,l=M}else if(d<u&&!document.body.classList.contains("on-studio")){if(!P){const x=h/(d||1),E=$/(d||1),j=q?Math.hypot(m-O,M-A):10,H=14+Math.min(36,j*1.15);b-=x*H*.4,v-=E*H*.4,q&&(b+=(m-O)*.4,v+=(M-A)*.4)}P=!0}else P=!1;y>6&&(W(!0),y>14&&W(!0)),O=m,A=M,N=p,q=!0}window.addEventListener("pointermove",Zt,{passive:!0}),window.addEventListener("pointerdown",c=>{c.button!=null&&c.button!==0||ve(c.target)||document.body.classList.contains("on-studio")||Math.hypot(c.clientX-g,c.clientY-l)<u&&(T=!0,t.style.cursor="grabbing",document.body.style.userSelect="none")});function Mt(){T=!1,t.style.cursor="grab",document.body.style.userSelect=""}window.addEventListener("pointerup",Mt),window.addEventListener("pointercancel",Mt);function Qt(c){const m=window.innerWidth,M=window.innerHeight;s.clearRect(0,0,m,M);const p=C.length;if(!p)return;const y=new Array(p);for(let h=0;h<p;h++)y[h]=ye(C[h],c);s.lineCap="round",s.lineWidth=1;for(let h=0;h<p;h++){const $=y[h];if($<=.04)continue;const d=C[h];let x=0;const E=d.near?132:98,j=E*E;for(let H=h+1;H<p&&x<3;H++){const F=y[H];if(F<=.04)continue;const z=C[H],$t=d.x-z.x,xt=d.y-z.y,kt=$t*$t+xt*xt,Et=d.near||z.near?j*1.15:j;if(kt>=Et)continue;const te=Math.sqrt(kt),Lt=Math.min($,F)*(1-te/(Math.sqrt(Et)||1))*.7;Lt<.03||(s.strokeStyle=`rgba(110, 180, 255, ${Lt})`,s.beginPath(),s.moveTo(d.x,d.y),s.lineTo(z.x,z.y),s.stroke(),x++)}}for(let h=0;h<p;h++){const $=y[h];if($<=0)continue;const d=C[h],x=.82+.18*Math.sin(c/180+d.x*.04);s.beginPath(),s.arc(d.x,d.y,d.r*2.6,0,Math.PI*2),s.fillStyle=`rgba(70, 140, 255, ${$*.22*x})`,s.fill(),s.beginPath(),s.arc(d.x,d.y,d.r*x,0,Math.PI*2),s.fillStyle=`rgba(220, 236, 255, ${$*.95})`,s.fill()}}function St(){const c=document.body.classList.contains("on-studio");t.style.visibility=c?"hidden":"visible",i.style.opacity=c?"0":"1",n.style.opacity=c?"0":"1";const m=performance.now(),M=Math.min(48,m-J);if(J=m,!c&&!T){g+=b,l+=v,b*=.994,v*=.994,b+=Math.sin(m/1400)*.032,v+=Math.cos(m/1800)*.026;const p=.5,y=Math.hypot(b,v);y<p&&(b=b/(y||1)*p,v=v/(y||1)*p);const h=Z/2+24;g<h&&(g=h,b=Math.abs(b)),l<h&&(l=h,v=Math.abs(v)),g>window.innerWidth-h&&(g=window.innerWidth-h,b=-Math.abs(b)),l>window.innerHeight-h&&(l=window.innerHeight-h,v=-Math.abs(v))}if(t.style.transform=`translate3d(${g}px, ${l}px, 0) translate(-50%, -50%)`,c)C.length=0,D=0,Y=0,s.clearRect(0,0,window.innerWidth,window.innerHeight);else{for(D+=M,Y+=M;D>95&&C.length<it;)W(!1),D-=95;const p=q?26:400;for(;Y>p&&C.length<it;)W(!0),Y-=p;const y=window.innerWidth,h=window.innerHeight;for(let $=C.length-1;$>=0;$--){const d=C[$];if(m-d.t>d.life){C.splice($,1);continue}if(q){const x=O-d.x,E=A-d.y,j=x*x+E*E;if(j<57600&&j>16){const H=Math.sqrt(j),F=d.near?.012:.0045;d.vx+=x/H*F,d.vy+=E/H*F}}d.vx*=.995,d.vy*=.995,d.x+=d.vx*(M/16),d.y+=d.vy*(M/16),(d.x<-40||d.y<-40||d.x>y+40||d.y>h+40)&&C.splice($,1)}Qt(m)}if(a.clearRect(0,0,window.innerWidth,window.innerHeight),c)_.length=0,K.length=0,B=null;else{a.lineCap="round",a.lineJoin="round";for(const p of _){const y=1-(m-p.t)/X;y<=0||(a.strokeStyle=`rgba(150, 210, 255, ${y*.95})`,a.shadowColor=`rgba(70, 150, 255, ${y})`,a.shadowBlur=12,a.lineWidth=2.8,a.beginPath(),a.moveTo(p.x1,p.y1),a.lineTo(p.x2,p.y2),a.stroke())}a.shadowBlur=0;for(const p of K){const y=1-(m-p.t)/X;y<=0||(a.fillStyle=`rgba(220, 240, 255, ${y})`,a.beginPath(),a.arc(p.x,p.y,3.8,0,Math.PI*2),a.fill())}}for(;_.length&&m-_[0].t>X;)_.shift();for(;K.length&&m-K[0].t>X;)K.shift();requestAnimationFrame(St)}requestAnimationFrame(St)}async function U(t,e={}){const n=new AbortController,s=setTimeout(()=>n.abort(),e.timeout||4e3);try{const i=await fetch(t,{credentials:"include",headers:{...e.body?{"content-type":"application/json"}:{},...e.headers||{}},...e,signal:e.signal||n.signal,body:e.body&&typeof e.body!="string"?JSON.stringify(e.body):e.body}),a=await i.json().catch(()=>({}));if(!i.ok){const r=new Error(a.error||"Ошибка API");throw r.status=i.status,r}return a}finally{clearTimeout(s)}}async function be(){return U("/api/status",{timeout:2500})}async function Me(){return U("/api/me")}async function Se(){return U("/api/auth/logout",{method:"POST"})}async function $e(t){return U("/api/auth/register",{method:"POST",body:t})}async function xe(t){return U("/api/auth/login",{method:"POST",body:t})}async function Dt(){return(await U("/api/projects")).projects||[]}async function pt(t){return(await U("/api/projects",{method:"PUT",body:{projects:t}})).projects||[]}const Rt="lumina.accounts.v1",nt="lumina.localSession.v1";function ft(){try{const t=JSON.parse(localStorage.getItem(Rt)||"[]");return Array.isArray(t)?t:[]}catch{return[]}}function ke(t){localStorage.setItem(Rt,JSON.stringify(t))}async function Ut(t,e){const n=new TextEncoder,s=await crypto.subtle.importKey("raw",n.encode(t),"PBKDF2",!1,["deriveBits"]),i=await crypto.subtle.deriveBits({name:"PBKDF2",salt:n.encode(e),iterations:12e4,hash:"SHA-256"},s,256);return[...new Uint8Array(i)].map(a=>a.toString(16).padStart(2,"0")).join("")}function gt(t){return{id:t.id,login:t.login,name:t.name,email:t.email,avatar:"",local:!0}}function Ee(){try{const t=JSON.parse(localStorage.getItem(nt)||"null");if(!(t!=null&&t.id))return null;const e=ft().find(n=>n.id===t.id);return e?gt(e):null}catch{return null}}function Le(){localStorage.removeItem(nt)}async function Ie({email:t,password:e,name:n}){const s=String(t||"").trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s))throw new Error("Некорректная почта");if(String(e||"").length<8)throw new Error("Пароль от 8 символов");const i=ft();if(i.some(l=>l.email===s))throw new Error("Эта почта уже зарегистрирована");const a=crypto.randomUUID(),r=await Ut(e,a),u=s.split("@")[0].slice(0,32),g={id:"local-"+(crypto.randomUUID?crypto.randomUUID():String(Date.now())),email:s,login:u,name:String(n||u).trim().slice(0,60)||u,salt:a,passwordHash:r,createdAt:Date.now()};return i.push(g),ke(i),localStorage.setItem(nt,JSON.stringify({id:g.id})),gt(g)}async function Te({email:t,password:e}){const n=String(t||"").trim().toLowerCase(),s=ft().find(a=>a.email===n);if(!s)throw new Error("Неверная почта или пароль");if(await Ut(e,s.salt)!==s.passwordHash)throw new Error("Неверная почта или пароль");return localStorage.setItem(nt,JSON.stringify({id:s.id})),gt(s)}function Nt(){return typeof window<"u"&&window.matchMedia("(max-width: 720px)").matches}const _t=[{t:"Пекарня",p:"Лендинг ремесленной пекарни «Два зерна» в Новосибирске: тёплый хлеб, витрина, предзаказ, история пекаря. Уютный редакционный стиль, кремовые тона, крупная типографика."},{t:"Портфолио",p:"Сайт-портфолио архитектора: минимализм, много воздуха, сетка проектов, кейсы с цифрами, тёмная тема, ощущение дорогого журнала."},{t:"Йога-студия",p:"Сайт йога-студии у реки: расписание, абонементы, преподаватели, запись на занятие. Спокойные природные цвета, мягкие анимации, не стерильный wellness-шаблон."},{t:"Приложение",p:"Лендинг запуска финтех-приложения для подростков: дерзкий, яркий, мемный, но понятный. Hero с телефоном из CSS, тарифы, FAQ, waitlist-форма."},{t:"Ресторан",p:"Одностраничник ресторана современной сибирской кухни: меню с ценами, атмосфера, бронирование стола, карта, галерея блюд. Тёмное дерево и медь."},{t:"Ивент",p:"Сайт музыкального фестиваля на три дня: лайнап, сцена, билеты, таймер до старта, мерч. Неоновые акценты, гранж, энергия афиши."}],Be=`<!DOCTYPE html>
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
</html>`,Ce=[{t:"Смелее дизайн",p:"Пересобери визуальный язык: смелее композиция, другая палитра, крупнее тип. Контент и структуру сохрани."},{t:"Анимации",p:"Добавь тонкие, дорогие анимации: появление секций, hover, плавный скролл. Без визуального шума."},{t:"Мобильная версия",p:"Усиль адаптив: идеально на 390px и 768px, удобное меню, читаемые размеры."},{t:"Другая палитра",p:"Полностью смени цветовую схему и настроение, сохранив структуру и тексты."}],Pe={spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1"/><circle cx="12" cy="12" r="3.2"/></svg>',gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"/></svg>',folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2.5h7.5A2.5 2.5 0 0 1 21 10v7.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z"/></svg>',download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 4v12m0 0 4.5-4.5M12 16l-4.5-4.5M5 20h14"/></svg>',send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>',x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6 6 18"/></svg>',eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',code:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m8 8-4 4 4 4M16 8l4 4-4 4"/></svg>',split:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/></svg>',copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M4 16V6a2 2 0 0 1 2-2h10"/></svg>',undo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 10h11a5 5 0 1 1 0 10H9"/><path d="M8 6 4 10l4 4"/></svg>',external:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6v6M10 14 20 4"/></svg>',chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 18.5 4 21l3.2-1.2A9 9 0 1 0 5 18.5Z"/></svg>',key:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="8" cy="12" r="4"/><path d="M12 12h9m-4-3v6"/></svg>',trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 7h14M10 7V5h4v2m-7 0 1 13h8l1-13"/></svg>',check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 5 5 9-10"/></svg>',home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11 12 4l8 7"/><path d="M6 10.5V20h12v-9.5"/></svg>',save:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 5h11l3 3v11H5V5Z"/><path d="M8 5v5h8V5M8 19v-6h8v6"/></svg>',upload:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 16V6m0 0 4.5 4.5M12 6 7.5 10.5M5 20h14"/></svg>',user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="3.2"/><path d="M5 19.2c1.6-3 4-4.5 7-4.5s5.4 1.5 7 4.5"/></svg>',github:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.58 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.03 10.03 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"/></svg>'},G=document.getElementById("app"),o={settings:ue(),projects:V(),currentId:ht(),view:"split",device:"desktop",chatOpen:!0,screen:"home",settingsOpen:!1,projectsOpen:!1,streaming:!1,abort:null,editor:null,previewTimer:0,saveTimer:0,toastTimer:0,cloudTimer:0,user:null,authOpen:!1,authTab:"login",authBusy:!1,apiOnline:!1,githubReady:!1};function I(){return o.projects.find(t=>t.id===o.currentId)||null}function L(){me(o.projects),he(o.currentId),Ht(o.settings),o.user&&!o.user.local&&Oe()}function Q(t,{projects:e}={}){o.user=t,t==null||t.id,e?o.projects=e:o.projects=V(),o.currentId=ht()}async function Pt(t){var i,a,r;if(o.authBusy)return;const e=((i=document.getElementById("auth-email"))==null?void 0:i.value)||"",n=((a=document.getElementById("auth-password"))==null?void 0:a.value)||"",s=((r=document.getElementById("auth-name"))==null?void 0:r.value)||"";o.authBusy=!0,S();try{let u;if(o.apiOnline){u=(t==="register"?await $e({email:e,password:n,name:s}):await xe({email:e,password:n})).user;let l=[];try{l=await Dt()}catch{}Q(u,{projects:l.length?l:V()}),!l.length&&o.projects.length&&await pt(o.projects)}else u=t==="register"?await Ie({email:e,password:n,name:s}):await Te({email:e,password:n}),Q(u);o.authOpen=!1,o.authBusy=!1,L(),S(),w(t==="register"?"Аккаунт создан":"Вы вошли")}catch(u){o.authBusy=!1,S(),w(u.message||"Не удалось войти","err")}}function Oe(){clearTimeout(o.cloudTimer),o.cloudTimer=setTimeout(()=>{pt(o.projects).catch(()=>{})},450)}function R(t){t.updatedAt=Date.now()}function je(t){return new Date(t).toLocaleString("ru-RU",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}function k(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function f(t){return Pe[t]||""}function w(t,e="ok"){let n=document.querySelector(".toast");n||(n=document.createElement("div"),n.className="toast",document.body.appendChild(n)),n.className=`toast toast-${e} show`,n.textContent=t,clearTimeout(o.toastTimer),o.toastTimer=setTimeout(()=>n.classList.remove("show"),2800)}function Ae(){return[...o.projects].filter(t=>t.html||t.messages&&t.messages.length).sort((t,e)=>(e.updatedAt||0)-(t.updatedAt||0))}function ot(t="Новый сайт"){const e=dt({name:t});return o.projects.unshift(e),o.currentId=e.id,L(),e}function Kt(){I()||ot()}function qe(){L(),o.screen="home",o.projectsOpen=!1,S()}function Gt(){Kt();const t=I();if(!t)return;const e=document.getElementById("proj-name");if(e&&(t.name=e.value.trim()||t.name),!t.name||t.name==="Новый сайт"){const n=window.prompt("Название проекта в каталоге",t.name||"Мой сайт");if(n===null)return;t.name=n.trim()||"Мой сайт"}R(t),L(),w(o.user?`Сохранено в аккаунт: ${t.name}`:`Сохранено в каталог: ${t.name}`)}function He(t){if(!o.projects.find(n=>n.id===t))return w("Проект не найден","warn");o.currentId=t,o.screen="studio",o.projectsOpen=!1,L(),S()}function De(t){if(!t)return;const e=new FileReader;e.onload=()=>{try{const n=String(e.result||"");let s;if(/\.json$/i.test(t.name)||n.trim().startsWith("{")){const i=JSON.parse(n);s=dt({name:i.name||t.name.replace(/\.json$/i,""),html:i.html||"",messages:Array.isArray(i.messages)?i.messages:[]})}else s=dt({name:t.name.replace(/\.html?$/i,"")||"Импорт",html:n});o.projects.unshift(s),L(),w(`В каталоге: ${s.name}`),S()}catch{w("Не удалось прочитать файл","err")}},e.readAsText(t)}function vt(t,{snapshot:e=!0}={}){const n=I();n&&(e&&n.html&&n.html!==t&&(n.versions=[...n.versions||[],n.html].slice(-20)),n.html=t,R(n),L(),o.editor&&o.editor.setValue(t),st())}function st(){const t=document.getElementById("preview-frame");if(!t)return;const e=I(),n=(e==null?void 0:e.html)||"",s=document.getElementById("preview-empty");if(!n){t.removeAttribute("srcdoc"),t.src="about:blank",s&&(s.hidden=!1);return}s&&(s.hidden=!0),t.srcdoc=n}function Re(){clearTimeout(o.previewTimer),o.previewTimer=setTimeout(st,280)}function Jt(){clearTimeout(o.saveTimer),o.saveTimer=setTimeout(()=>L(),400)}function Ue(){const t=I();if(!(t!=null&&t.html))return w("Пока нечего скачивать","warn");const e=new Blob([t.html],{type:"text/html;charset=utf-8"}),n=document.createElement("a"),s=(t.name||"site").replace(/[^\wа-яё\- ]+/gi,"").trim()||"site";n.href=URL.createObjectURL(e),n.download=`${s}.html`,n.click(),URL.revokeObjectURL(n.href),w("HTML сохранён")}function Ne(){const t=I();if(!(t!=null&&t.html))return w("Нет кода","warn");navigator.clipboard.writeText(t.html).then(()=>w("Код скопирован"),()=>w("Не удалось скопировать","err"))}function Wt(){const t=I();if(!(t!=null&&t.html))return w("Сначала создайте сайт","warn");const e=window.open("","_blank");if(!e)return w("Браузер заблокировал окно","warn");e.document.open(),e.document.write(t.html),e.document.close()}function _e(){var n;const t=I();if(!((n=t==null?void 0:t.versions)!=null&&n.length))return w("Нечего откатывать","warn");const e=t.versions.pop();t.html=e,R(t),L(),o.editor&&o.editor.setValue(e),st(),w("Откатил к предыдущей версии")}function Ke(){ot(),o.screen="studio",o.projectsOpen=!1,L(),S()}function Ge(t){const e=o.projects.findIndex(n=>n.id===t);e<0||(o.projects.splice(e,1),o.currentId===t&&(o.currentId=null),L(),S())}function Je(t){He(t)}function We(){const t=o.settings.customModel.trim()||o.settings.model;return ct(t)?ut:t}function yt(){return!o.settings.apiKey.trim()}async function tt(t,{fromWelcome:e=!1}={}){var g;const n=(t||"").trim();if(!n){w("Опишите сайт в поле выше","warn"),(g=document.getElementById("welcome-input"))==null||g.focus();return}if(yt()){o.settingsOpen=!0,S(),w("Добавьте API-ключ Groq","warn");return}if(o.streaming)return;if(e||o.screen==="home"){const l=n.split(/[.!?\n]/)[0].slice(0,42);ot(l.length>3?l:"Новый сайт"),o.screen="studio"}else Kt();const s=I();s.messages.push({role:"user",content:n,at:Date.now()});const i={role:"assistant",content:"",at:Date.now(),pending:!0};s.messages.push(i),R(s),L(),o.streaming=!0,S();const a=new AbortController;o.abort=a;const r=document.getElementById("chat-input"),u=document.getElementById("welcome-input");r&&(r.value=""),u&&(u.value=""),Ft(r);try{const l=await le({apiKey:o.settings.apiKey.trim(),model:We(),messages:re({...s,messages:s.messages.slice(0,-1)},n),signal:a.signal,onDelta:v=>{i.content=v,en(v)}});i.content=l,i.pending=!1;const b=et(l);if(b&&(i.applied=!0,o.settings.autoApply?vt(b):i.applied=!1),!s.name||s.name==="Новый сайт"||s.name==="Мой сайт"){const v=n.split(/[.!?\n]/)[0].slice(0,42);v.length>3&&(s.name=v)}R(s),L()}catch(l){l.name==="AbortError"?i.content=i.content||"Остановлено.":(i.content="",i.error=l.message||"Не удалось обратиться к Groq",w(i.error,"err")),i.pending=!1,L()}finally{o.streaming=!1,o.abort=null,S()}}function Fe(t){const e=I(),n=e==null?void 0:e.messages[t];if(!n)return;const s=et(n.content);if(!s)return w("В ответе нет HTML","warn");vt(s),n.applied=!0,L(),nn(),w("Сайт обновлён")}function ze(){var t;(t=o.abort)==null||t.abort()}function Ft(t){t&&(t.style.height="auto",t.style.height=Math.min(t.scrollHeight,160)+"px")}function Ve(){const t=I(),e=o.screen==="home";return`
    <header class="topbar">
      <div class="brand" data-act="home">
        <span class="logo">${f("spark")}</span>
        <span class="brand-text">Lumina</span>
      </div>
      <div class="top-center">
        ${e?"":t?`<input class="proj-name" id="proj-name" value="${k(t.name)}" spellcheck="false" />`:""}
      </div>
      <div class="top-actions">
        ${e?`
          <button class="btn ghost" data-act="import">${f("upload")}<span>Загрузить</span></button>
          <input id="import-file" type="file" accept=".html,.htm,.json" hidden />
        `:`
          <button class="btn primary" data-act="save">${f("save")}<span>Сохранить</span></button>
          <button class="btn ghost" data-act="home">${f("home")}<span>На главную</span></button>
          <button class="icon-btn desk-only" data-act="undo" title="Откатить">${f("undo")}</button>
          <button class="icon-btn desk-only" data-act="copy" title="Копировать код">${f("copy")}</button>
          <button class="icon-btn desk-only" data-act="open" title="Открыть в новой вкладке">${f("external")}</button>
          <button class="btn ghost desk-only" data-act="download">${f("download")}<span>Экспорт</span></button>
        `}
        ${Ye()}
        <button class="icon-btn ${yt()?"warn-dot":""}" data-act="settings" title="Настройки">${f("gear")}</button>
      </div>
    </header>

    ${e?Ze():tn()}
    ${o.settingsOpen?on():""}
    ${o.authOpen?Xe():""}
  `}function Ye(){if(o.user){const t=k(o.user.login||o.user.name||"аккаунт"),e=o.user.avatar?`<img class="avatar" src="${k(o.user.avatar)}" alt="" />`:f("user");return`<button class="account-chip" data-act="auth" title="${t}">${e}<span>${t}</span></button>`}return`<button class="btn ghost" data-act="auth">${f("user")}<span>Войти</span></button>`}function Xe(){const t=o.user;if(t)return`
      <div class="overlay" data-close="auth">
        <div class="modal" role="dialog" aria-labelledby="auth-title">
          <div class="modal-head">
            <h2 id="auth-title">${f("user")} Аккаунт</h2>
            <button class="icon-btn" data-act="close-auth">${f("x")}</button>
          </div>
          <div class="account-card">
            ${t.avatar?`<img class="avatar lg" src="${k(t.avatar)}" alt="" />`:""}
            <strong>${k(t.name||t.login)}</strong>
            <span class="muted">${t.email?k(t.email):"@"+k(t.login)}</span>
          </div>
          <p class="modal-lead">${t.local?"Аккаунт сохранён в этом браузере.":"Проекты синхронизируются с сервером."}</p>
          <div class="modal-actions">
            <button class="btn ghost" type="button" data-act="logout">Выйти</button>
          </div>
        </div>
      </div>
    `;const e=o.authTab==="register"?"register":"login",n=o.authBusy?"disabled":"";return`
    <div class="overlay" data-close="auth">
      <div class="modal" role="dialog" aria-labelledby="auth-title">
        <div class="modal-head">
          <h2 id="auth-title">${f("user")} ${e==="register"?"Регистрация":"Вход"}</h2>
          <button class="icon-btn" data-act="close-auth">${f("x")}</button>
        </div>
        <div class="auth-tabs">
          <button type="button" class="${e==="login"?"on":""}" data-act="auth-tab-login">Вход</button>
          <button type="button" class="${e==="register"?"on":""}" data-act="auth-tab-register">Регистрация</button>
        </div>
        <form id="${e==="register"?"auth-register":"auth-login"}" class="auth-form">
          ${e==="register"?'<label class="field"><span>Имя</span><input id="auth-name" autocomplete="name" placeholder="Как к вам обращаться" /></label>':""}
          <label class="field">
            <span>Почта</span>
            <input id="auth-email" type="email" autocomplete="email" required placeholder="you@mail.com" />
          </label>
          <label class="field">
            <span>Пароль</span>
            <input id="auth-password" type="password" autocomplete="${e==="register"?"new-password":"current-password"}" required minlength="8" placeholder="минимум 8 символов" />
          </label>
          <div class="modal-actions">
            <button class="btn primary wide" type="submit" ${n}>${e==="register"?"Создать аккаунт":"Войти"}</button>
          </div>
        </form>
        ${o.githubReady?`<a class="btn ghost wide auth-gh" href="/api/auth/github">${f("github")} Войти через GitHub</a>`:""}
        ${o.apiOnline?"":'<p class="modal-lead">На GitHub Pages аккаунт хранится в этом браузере.</p>'}
      </div>
    </div>
  `}function Ze(){const t=Ae();return`
    <main class="home">
      <div class="home-hero">
        <div class="hero-glass">
          <p class="eyebrow">Студия сайтов с Groq</p>
          <h1>Напишите сайт.<br><em>Или попросите ИИ.</em></h1>
          <p class="lede">Опишите страницу своими словами — Lumina соберёт полный HTML, CSS и JS. Код можно править руками и сразу смотреть превью.</p>
          ${yt()?`<button class="banner" data-act="settings">${f("key")} Сначала вставьте API-ключ Groq в настройках</button>`:""}
          <form class="welcome-form" id="welcome-form">
            <textarea id="welcome-input" rows="3" placeholder="Например: лендинг кофейни на ОбьГЭС, тёмное дерево, меню, запись на каппинг…"></textarea>
            <div class="welcome-actions">
              <button class="btn ghost big" type="button" data-act="blank">${f("code")} Писать самому</button>
              <button class="btn primary big" type="button" data-act="create-ai">${f("spark")} Создать с ИИ</button>
            </div>
          </form>
          <div class="chips">
            ${_t.map((e,n)=>`<button class="chip" data-ex="${n}">${k(e.t)}</button>`).join("")}
          </div>
        </div>
      </div>
      <section class="catalog">
        <div class="catalog-inner">
          <div class="catalog-head">
            <h2>${f("folder")} Каталог проектов</h2>
            <span class="muted">${t.length?t.length:"пусто"}</span>
          </div>
          ${t.length?`<div class="grid">${t.map(Qe).join("")}</div>`:'<p class="catalog-empty">Пока пусто. Создайте сайт и нажмите «Сохранить» — он появится здесь.</p>'}
        </div>
      </section>
    </main>
  `}function Qe(t){const e=(t.name||"?").trim().charAt(0).toUpperCase();return`
    <article class="pcard">
      <button type="button" class="pcard-hit" data-open="${t.id}" title="Открыть">
        <div class="pcard-thumb"><span>${k(e)}</span></div>
        <div class="pcard-body">
          <strong>${k(t.name||"Без названия")}</strong>
          <span>${je(t.updatedAt)}</span>
        </div>
      </button>
      <button type="button" class="icon-btn sm pcard-del" data-del="${t.id}" title="Удалить">${f("trash")}</button>
    </article>
  `}function tn(){const t=I();return`
    <main class="studio ${o.chatOpen?"":"chat-collapsed"}">
      <aside class="chat">
        <div class="chat-head">
          <span>${f("chat")} ИИ-ассистент</span>
          <button class="icon-btn sm" data-act="toggle-chat" title="Скрыть">${f("x")}</button>
        </div>
        <div class="chat-log" id="chat-log">${zt(t)}</div>
        <div class="quick">
          ${Ce.map(e=>`<button class="chip sm" data-quick="${k(e.p)}">${k(e.t)}</button>`).join("")}
        </div>
        <form class="composer" id="chat-form">
          <textarea id="chat-input" rows="1" placeholder="Что изменить на сайте?" ${o.streaming?"disabled":""}></textarea>
          ${o.streaming?'<button class="btn danger" type="button" data-act="stop">Стоп</button>':`<button class="btn primary icon-only" type="submit" title="Отправить">${f("send")}</button>`}
        </form>
      </aside>
      <section class="stage">
        <div class="stage-bar">
          ${o.chatOpen?"":`<button class="icon-btn sm" data-act="toggle-chat" title="Чат">${f("chat")}</button>`}
          <div class="seg" role="tablist">
            <button class="${o.view==="split"?"on":""}" data-view="split">${f("split")} Оба</button>
            <button class="${o.view==="code"?"on":""}" data-view="code">${f("code")} Код</button>
            <button class="${o.view==="preview"?"on":""}" data-view="preview">${f("eye")} Превью</button>
          </div>
          <div class="seg devices">
            <button class="${o.device==="desktop"?"on":""}" data-device="desktop" title="Десктоп">Desk</button>
            <button class="${o.device==="tablet"?"on":""}" data-device="tablet" title="Планшет">Tab</button>
            <button class="${o.device==="mobile"?"on":""}" data-device="mobile" title="Телефон">Mob</button>
          </div>
        </div>
        <div class="stage-body view-${o.view}">
          <div class="pane editor-pane">
            <div id="editor-root"></div>
          </div>
          <div class="resizer" id="resizer"></div>
          <div class="pane preview-pane">
            <div class="device device-${o.device}">
              <iframe id="preview-frame" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin" title="Превью сайта"></iframe>
              <div id="preview-empty" class="preview-empty">
                <div>
                  ${f("eye")}
                  <p>Превью появится, когда будет HTML</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `}function zt(t){var e;return(e=t==null?void 0:t.messages)!=null&&e.length?t.messages.map((n,s)=>{if(n.role==="user")return`<div class="bubble user"><div class="bubble-body">${k(n.content)}</div></div>`;if(n.error)return`<div class="bubble ai err"><div class="bubble-body">${k(n.error)}</div></div>`;const i=et(n.content),a=mt(n.content),r=n.pending;return`
        <div class="bubble ai ${r?"stream":""}">
          <div class="bubble-body" data-stream="${s}">${r?Vt(n.content):k(a||(i?"Сайт готов.":n.content||"…"))}</div>
          ${i&&!r?`
            <div class="code-card">
              <span>HTML · ${i.length.toLocaleString("ru-RU")} симв.</span>
              <button class="btn ghost xs" data-apply="${s}">${n.applied?f("check")+" Применён":"Применить"}</button>
            </div>`:""}
        </div>`}).join(""):'<div class="chat-empty">Опишите идею или правку — ассистент пересоберёт сайт. Можно писать и код вручную справа.</div>'}function Vt(t){const e=et(t),n=mt(t);return e?`${k(n||"Собираю страницу…")}<div class="stream-bar">Пишу HTML · ${e.length.toLocaleString("ru-RU")}</div>`:k(t||"Думаю…")}function en(t){const e=document.getElementById("chat-log");if(!e)return;const n=e.querySelectorAll("[data-stream]"),s=n[n.length-1];s&&(s.innerHTML=Vt(t)),e.scrollTop=e.scrollHeight}function nn(){const t=document.getElementById("chat-log");t&&(t.innerHTML=zt(I()),t.scrollTop=t.scrollHeight)}function on(){const t=o.settings;return`
    <div class="overlay" data-close="settings">
      <div class="modal" role="dialog" aria-labelledby="set-title">
        <div class="modal-head">
          <h2 id="set-title">${f("key")} Groq API</h2>
          <button class="icon-btn" data-act="close-settings">${f("x")}</button>
        </div>
        <p class="modal-lead">Ключ хранится только в этом браузере и уходит на api.groq.com. Создайте его на <a href="https://console.groq.com/keys" target="_blank" rel="noopener">console.groq.com/keys</a>. Llama 3.3 Groq снял — по умолчанию <b>GPT-OSS 120B</b>.</p>
        <label class="field">
          <span>API-ключ</span>
          <input id="set-key" type="password" autocomplete="off" placeholder="gsk_…" value="${k(t.apiKey)}" />
        </label>
        <label class="field">
          <span>Модель</span>
          <select id="set-model">
            ${ae.map(e=>`<option value="${e.id}" ${t.model===e.id?"selected":""}>${e.name} — ${e.hint}</option>`).join("")}
          </select>
        </label>
        <label class="field">
          <span>Своя модель (необязательно)</span>
          <input id="set-custom" placeholder="id модели Groq" value="${k(t.customModel)}" />
        </label>
        <label class="check">
          <input type="checkbox" id="set-auto" ${t.autoApply?"checked":""} />
          <span>Сразу применять HTML из ответа ИИ</span>
        </label>
        <div class="modal-actions">
          <button class="btn ghost" type="button" id="set-test">Проверить ключ</button>
          <button class="btn primary" type="button" data-act="save-settings">Сохранить</button>
        </div>
      </div>
    </div>
  `}let rt=null;async function sn(){const t=document.getElementById("editor-root");if(!t){o.editor=null;return}if(rt||(rt=await oe(()=>import("./editor-XDEXaPkz.js"),[])),!document.getElementById("editor-root"))return;const e=I();o.editor=rt.createEditor(t,{doc:(e==null?void 0:e.html)||"",onChange:n=>{const s=I();s&&(s.html=n,R(s),Jt(),Re())}}),st()}function an(){const t=document.getElementById("resizer"),e=document.querySelector(".stage-body");if(!t||!e)return;let n=!1;t.addEventListener("pointerdown",i=>{n=!0,t.setPointerCapture(i.pointerId),document.body.classList.add("resizing")}),t.addEventListener("pointermove",i=>{if(!n)return;const a=e.getBoundingClientRect(),r=i.clientX-a.left,u=Math.min(75,Math.max(25,r/a.width*100));e.style.setProperty("--split",u+"%")});const s=()=>{n=!1,document.body.classList.remove("resizing")};t.addEventListener("pointerup",s),t.addEventListener("pointercancel",s)}function rn(){document.body.classList.toggle("on-studio",o.screen==="studio"),sn(),an();const t=document.getElementById("chat-log");t&&(t.scrollTop=t.scrollHeight);const e=document.getElementById("chat-input"),n=document.getElementById("welcome-input");e==null||e.addEventListener("input",()=>Ft(e)),n&&!Nt()&&n.focus();const s=document.getElementById("import-file");s==null||s.addEventListener("change",i=>{const a=i.target.files&&i.target.files[0];i.target.value="",a&&De(a)})}function S(){o.editor&&(o.editor.destroy(),o.editor=null),G.innerHTML=Ve(),rn()}G.addEventListener("click",t=>{var s,i;const e=t.target.closest("[data-act],[data-view],[data-device],[data-ex],[data-quick],[data-apply],[data-open],[data-del]");if(!e){t.target.classList.contains("overlay")&&(o.settingsOpen=!1,o.projectsOpen=!1,o.authOpen=!1,S());return}const n=e.dataset.act;if(n==="settings"?(o.settingsOpen=!0,S()):n==="auth"?(o.authOpen=!0,S()):n==="close-auth"?(o.authOpen=!1,S()):n==="logout"?(Se().catch(()=>{}),Le(),L(),o.user=null,o.projects=V(),o.currentId=ht(),o.authOpen=!1,w("Вы вышли"),S()):n==="auth-tab-login"?(o.authTab="login",S()):n==="auth-tab-register"?(o.authTab="register",S()):n==="create-ai"?tt((s=document.getElementById("welcome-input"))==null?void 0:s.value,{fromWelcome:!0}):n==="close-settings"?(o.settingsOpen=!1,S()):n==="save-settings"?(o.settings.apiKey=document.getElementById("set-key").value.trim(),o.settings.model=document.getElementById("set-model").value,o.settings.customModel=document.getElementById("set-custom").value.trim(),o.settings.autoApply=document.getElementById("set-auto").checked,L(),o.settingsOpen=!1,S(),w("Настройки сохранены")):n==="save"?Gt():n==="import"?(i=document.getElementById("import-file"))==null||i.click():n==="new-project"?Ke():n==="download"?Ue():n==="copy"?Ne():n==="open"?Wt():n==="undo"?_e():n==="toggle-chat"?(o.chatOpen=!o.chatOpen,S()):n==="stop"?ze():n==="home"?qe():n==="blank"&&(ot("Мой сайт"),o.screen="studio",vt(Be,{snapshot:!1}),S()),e.dataset.view&&(o.view=e.dataset.view,S()),e.dataset.device){o.device=e.dataset.device,document.querySelectorAll("[data-device]").forEach(r=>r.classList.toggle("on",r.dataset.device===o.device));const a=document.querySelector(".device");a&&(a.className=`device device-${o.device}`)}if(e.dataset.ex!=null){const a=_t[Number(e.dataset.ex)],r=document.getElementById("welcome-input");r&&a&&(r.value=a.p,r.focus())}e.dataset.quick&&tt(e.dataset.quick),e.dataset.apply!=null&&Fe(Number(e.dataset.apply)),e.dataset.open&&Je(e.dataset.open),e.dataset.del&&confirm("Удалить этот сайт?")&&Ge(e.dataset.del)});G.addEventListener("submit",t=>{t.target.id==="welcome-form"&&(t.preventDefault(),tt(document.getElementById("welcome-input").value,{fromWelcome:!0})),t.target.id==="chat-form"&&(t.preventDefault(),tt(document.getElementById("chat-input").value)),t.target.id==="auth-login"&&(t.preventDefault(),Pt("login")),t.target.id==="auth-register"&&(t.preventDefault(),Pt("register"))});G.addEventListener("keydown",t=>{var e;(t.target.id==="chat-input"||t.target.id==="welcome-input")&&t.key==="Enter"&&!t.shiftKey&&(t.preventDefault(),(e=t.target.form)==null||e.requestSubmit())});G.addEventListener("change",t=>{if(t.target.id==="proj-name"){const e=I();e&&(e.name=t.target.value.trim()||"Без названия",R(e),L())}});G.addEventListener("input",t=>{if(t.target.id==="proj-name"){const e=I();e&&(e.name=t.target.value,R(e),Jt())}});document.addEventListener("click",async t=>{var e,n,s,i,a;if(t.target.id==="set-test"||(n=(e=t.target).closest)!=null&&n.call(e,"#set-test")){const r=(s=document.getElementById("set-key"))==null?void 0:s.value.trim(),u=((i=document.getElementById("set-custom"))==null?void 0:i.value.trim())||((a=document.getElementById("set-model"))==null?void 0:a.value);if(!r)return w("Вставьте ключ","warn");const g=document.getElementById("set-test");g.disabled=!0,g.textContent="Проверяю…";try{await de(r,u),w("Ключ работает")}catch(l){w(l.message,"err")}finally{g.disabled=!1,g.textContent="Проверить ключ"}}});document.addEventListener("keydown",t=>{(t.metaKey||t.ctrlKey)&&t.key.toLowerCase()==="s"&&(t.preventDefault(),o.screen==="studio"&&Gt()),(t.metaKey||t.ctrlKey)&&t.key.toLowerCase()==="e"&&(t.preventDefault(),Wt())});async function cn(){Ht(o.settings),Nt()&&(o.chatOpen=!1,o.view="preview");const t=Ee();t&&Q(t),S(),we();const n=new URLSearchParams(location.search).get("auth");n&&history.replaceState({},"",location.pathname);try{const s=await be();o.apiOnline=!!s.ok,o.githubReady=!!s.github;const i=await Me();if(i.user){let a=[];try{a=await Dt()}catch{}Q(i.user,{projects:a.length?a:V()}),!a.length&&o.projects.length&&await pt(o.projects),S()}}catch{o.apiOnline=!1}n==="ok"?w("Вход выполнен"):n==="error"&&w("Не удалось войти","err")}cn();
