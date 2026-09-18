const LIFE = 700
const SIZE = 180
const STAR_MAX = 180
const CURSOR_R = 168

function cmPx(n) {
  const el = document.createElement('div')
  el.style.cssText = `position:absolute;left:-9999px;top:0;width:${n}cm;height:1px`
  document.body.appendChild(el)
  const px = el.getBoundingClientRect().width
  el.remove()
  return px > 1 ? px : n * 37.7952755906
}

function isUi(el) {
  return !!(
    el &&
    el.closest &&
    el.closest(
      'button, a, input, textarea, select, label, .hero-glass, .catalog, .topbar, .overlay, .studio, .modal, .toast',
    )
  )
}

function starAlpha(s, now) {
  const p = (now - s.t) / s.life
  if (p <= 0 || p >= 1) return 0
  return Math.min(p / 0.14, (1 - p) / 0.26, 1)
}

let started = false

export function startFx() {
  if (started) return
  const wrap = document.querySelector('.holo-wrap')
  const holo = document.querySelector('.holo')
  if (!wrap || !holo) return
  started = true

  const starCanvas = document.createElement('canvas')
  starCanvas.className = 'star-canvas'
  holo.insertBefore(starCanvas, wrap)
  const sctx = starCanvas.getContext('2d')

  const canvas = document.createElement('canvas')
  canvas.className = 'trail-canvas'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  const stickLen = cmPx(2)
  const hitR = SIZE * 0.78

  let x = Math.max(SIZE, window.innerWidth * 0.72)
  let y = Math.max(SIZE, window.innerHeight * 0.38)
  let vx = 1.25
  let vy = -0.7
  let dragging = false
  let inside = false
  let lastMx = window.innerWidth * 0.5
  let lastMy = window.innerHeight * 0.45
  let hasMouse = false
  let lastT = performance.now()
  let lastTick = lastT
  let anchor = null
  let accAmb = 0
  let accCur = 0

  wrap.style.left = '0'
  wrap.style.top = '0'
  wrap.style.margin = '0'
  wrap.style.cursor = 'grab'

  const sticks = []
  const dots = []
  const stars = []

  function fitCanvas(c, cctx) {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = Math.floor(window.innerWidth * dpr)
    c.height = Math.floor(window.innerHeight * dpr)
    c.style.width = `${window.innerWidth}px`
    c.style.height = `${window.innerHeight}px`
    cctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  function resize() {
    fitCanvas(canvas, ctx)
    fitCanvas(starCanvas, sctx)
  }
  resize()
  window.addEventListener('resize', resize)

  function addDot(px, py) {
    dots.push({ x: px, y: py, t: performance.now() })
  }
  function addStick(x1, y1, x2, y2) {
    sticks.push({ x1, y1, x2, y2, t: performance.now() })
  }

  function spawnStar(near) {
    if (stars.length >= STAR_MAX) return
    const w = window.innerWidth
    const h = window.innerHeight
    let sx
    let sy
    if (near && hasMouse) {
      const ang = Math.random() * Math.PI * 2
      const r = Math.pow(Math.random(), 0.45) * CURSOR_R
      sx = lastMx + Math.cos(ang) * r
      sy = lastMy + Math.sin(ang) * r
    } else {
      sx = Math.random() * w
      sy = Math.random() * h
    }
    const speed = near ? 0.22 + Math.random() * 0.85 : 0.06 + Math.random() * 0.32
    const dir = Math.random() * Math.PI * 2
    let ovx = Math.cos(dir) * speed
    let ovy = Math.sin(dir) * speed
    if (near && hasMouse) {
      const tang = dir + Math.PI / 2
      ovx += Math.cos(tang) * 0.18
      ovy += Math.sin(tang) * 0.18
    }
    stars.push({
      x: sx,
      y: sy,
      vx: ovx,
      vy: ovy,
      t: performance.now(),
      life: near ? 1200 + Math.random() * 1800 : 2600 + Math.random() * 3400,
      r: near ? 1.15 + Math.random() * 1.9 : 0.65 + Math.random() * 1.45,
      near,
    })
  }

  for (let i = 0; i < 48; i++) spawnStar(false)

  function trailTo(mx, my) {
    if (document.body.classList.contains('on-studio')) {
      anchor = null
      return
    }
    if (!anchor) {
      anchor = { x: mx, y: my }
      addDot(mx, my)
      return
    }
    const jump = Math.hypot(mx - anchor.x, my - anchor.y)
    if (jump > stickLen * 6) {
      anchor = { x: mx, y: my }
      addDot(mx, my)
      return
    }
    for (;;) {
      const dx = mx - anchor.x
      const dy = my - anchor.y
      const len = Math.hypot(dx, dy)
      if (len < stickLen) break
      const ux = dx / len
      const uy = dy / len
      const nx = anchor.x + ux * stickLen
      const ny = anchor.y + uy * stickLen
      addStick(anchor.x, anchor.y, nx, ny)
      addDot(nx, ny)
      anchor = { x: nx, y: ny }
    }
  }

  function onMove(e) {
    const mx = e.clientX
    const my = e.clientY
    const now = performance.now()
    const moved = hasMouse ? Math.hypot(mx - lastMx, my - lastMy) : 0
    trailTo(mx, my)

    const dx = mx - x
    const dy = my - y
    const d = Math.hypot(dx, dy)

    if (dragging) {
      const dt = Math.max(8, now - lastT)
      vx = ((mx - lastMx) / dt) * 16
      vy = ((my - lastMy) / dt) * 16
      x = mx
      y = my
    } else if (d < hitR && !document.body.classList.contains('on-studio')) {
      if (!inside) {
        const nx = dx / (d || 1)
        const ny = dy / (d || 1)
        const speed = hasMouse ? Math.hypot(mx - lastMx, my - lastMy) : 10
        const impulse = 14 + Math.min(36, speed * 1.15)
        vx -= nx * impulse * 0.4
        vy -= ny * impulse * 0.4
        if (hasMouse) {
          vx += (mx - lastMx) * 0.4
          vy += (my - lastMy) * 0.4
        }
      }
      inside = true
    } else {
      inside = false
    }

    if (moved > 6) {
      spawnStar(true)
      if (moved > 14) spawnStar(true)
    }

    lastMx = mx
    lastMy = my
    lastT = now
    hasMouse = true
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', (e) => {
    if (e.button != null && e.button !== 0) return
    if (isUi(e.target)) return
    if (document.body.classList.contains('on-studio')) return
    if (Math.hypot(e.clientX - x, e.clientY - y) < hitR) {
      dragging = true
      wrap.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
    }
  })
  function endDrag() {
    dragging = false
    wrap.style.cursor = 'grab'
    document.body.style.userSelect = ''
  }
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)

  function drawStars(now) {
    const w = window.innerWidth
    const h = window.innerHeight
    sctx.clearRect(0, 0, w, h)
    const n = stars.length
    if (!n) return

    const alphas = new Array(n)
    for (let i = 0; i < n; i++) alphas[i] = starAlpha(stars[i], now)

    sctx.lineCap = 'round'
    sctx.lineWidth = 1
    for (let i = 0; i < n; i++) {
      const a = alphas[i]
      if (a <= 0.04) continue
      const si = stars[i]
      let linked = 0
      const maxD = si.near ? 132 : 98
      const maxD2 = maxD * maxD
      for (let j = i + 1; j < n && linked < 3; j++) {
        const b = alphas[j]
        if (b <= 0.04) continue
        const sj = stars[j]
        const dx = si.x - sj.x
        const dy = si.y - sj.y
        const d2 = dx * dx + dy * dy
        const lim = si.near || sj.near ? maxD2 * 1.15 : maxD2
        if (d2 >= lim) continue
        const d = Math.sqrt(d2)
        const la = Math.min(a, b) * (1 - d / (Math.sqrt(lim) || 1)) * 0.7
        if (la < 0.03) continue
        sctx.strokeStyle = `rgba(110, 180, 255, ${la})`
        sctx.beginPath()
        sctx.moveTo(si.x, si.y)
        sctx.lineTo(sj.x, sj.y)
        sctx.stroke()
        linked++
      }
    }

    for (let i = 0; i < n; i++) {
      const a = alphas[i]
      if (a <= 0) continue
      const s = stars[i]
      const tw = 0.82 + 0.18 * Math.sin(now / 180 + s.x * 0.04)
      sctx.beginPath()
      sctx.arc(s.x, s.y, s.r * 2.6, 0, Math.PI * 2)
      sctx.fillStyle = `rgba(70, 140, 255, ${a * 0.22 * tw})`
      sctx.fill()
      sctx.beginPath()
      sctx.arc(s.x, s.y, s.r * tw, 0, Math.PI * 2)
      sctx.fillStyle = `rgba(220, 236, 255, ${a * 0.95})`
      sctx.fill()
    }
  }

  function tick() {
    const studio = document.body.classList.contains('on-studio')
    wrap.style.visibility = studio ? 'hidden' : 'visible'
    canvas.style.opacity = studio ? '0' : '1'
    starCanvas.style.opacity = studio ? '0' : '1'

    const now = performance.now()
    const dt = Math.min(48, now - lastTick)
    lastTick = now

    if (!studio && !dragging) {
      x += vx
      y += vy
      vx *= 0.994
      vy *= 0.994
      vx += Math.sin(now / 1400) * 0.032
      vy += Math.cos(now / 1800) * 0.026
      const minSp = 0.5
      const sp = Math.hypot(vx, vy)
      if (sp < minSp) {
        vx = (vx / (sp || 1)) * minSp
        vy = (vy / (sp || 1)) * minSp
      }
      const m = SIZE / 2 + 24
      if (x < m) {
        x = m
        vx = Math.abs(vx)
      }
      if (y < m) {
        y = m
        vy = Math.abs(vy)
      }
      if (x > window.innerWidth - m) {
        x = window.innerWidth - m
        vx = -Math.abs(vx)
      }
      if (y > window.innerHeight - m) {
        y = window.innerHeight - m
        vy = -Math.abs(vy)
      }
    }
    wrap.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`

    if (!studio) {
      accAmb += dt
      accCur += dt
      while (accAmb > 95 && stars.length < STAR_MAX) {
        spawnStar(false)
        accAmb -= 95
      }
      const curEvery = hasMouse ? 26 : 400
      while (accCur > curEvery && stars.length < STAR_MAX) {
        spawnStar(true)
        accCur -= curEvery
      }

      const w = window.innerWidth
      const h = window.innerHeight
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i]
        if (now - s.t > s.life) {
          stars.splice(i, 1)
          continue
        }
        if (hasMouse) {
          const dx = lastMx - s.x
          const dy = lastMy - s.y
          const d2 = dx * dx + dy * dy
          if (d2 < 240 * 240 && d2 > 16) {
            const d = Math.sqrt(d2)
            const pull = s.near ? 0.012 : 0.0045
            s.vx += (dx / d) * pull
            s.vy += (dy / d) * pull
          }
        }
        s.vx *= 0.995
        s.vy *= 0.995
        s.x += s.vx * (dt / 16)
        s.y += s.vy * (dt / 16)
        if (s.x < -40 || s.y < -40 || s.x > w + 40 || s.y > h + 40) {
          stars.splice(i, 1)
        }
      }
      drawStars(now)
    } else {
      stars.length = 0
      accAmb = 0
      accCur = 0
      sctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    if (!studio) {
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (const s of sticks) {
        const a = 1 - (now - s.t) / LIFE
        if (a <= 0) continue
        ctx.strokeStyle = `rgba(150, 210, 255, ${a * 0.95})`
        ctx.shadowColor = `rgba(70, 150, 255, ${a})`
        ctx.shadowBlur = 12
        ctx.lineWidth = 2.8
        ctx.beginPath()
        ctx.moveTo(s.x1, s.y1)
        ctx.lineTo(s.x2, s.y2)
        ctx.stroke()
      }
      ctx.shadowBlur = 0
      for (const d of dots) {
        const a = 1 - (now - d.t) / LIFE
        if (a <= 0) continue
        ctx.fillStyle = `rgba(220, 240, 255, ${a})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, 3.8, 0, Math.PI * 2)
        ctx.fill()
      }
    } else {
      sticks.length = 0
      dots.length = 0
      anchor = null
    }
    while (sticks.length && now - sticks[0].t > LIFE) sticks.shift()
    while (dots.length && now - dots[0].t > LIFE) dots.shift()
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
