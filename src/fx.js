const LIFE = 700
const SIZE = 180

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

let started = false

export function startFx() {
  if (started) return
  const wrap = document.querySelector('.holo-wrap')
  if (!wrap) return
  started = true

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
  let lastMx = 0
  let lastMy = 0
  let hasMouse = false
  let lastT = performance.now()
  let anchor = null

  wrap.style.left = '0'
  wrap.style.top = '0'
  wrap.style.margin = '0'
  wrap.style.cursor = 'grab'

  const sticks = []
  const dots = []

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.floor(window.innerWidth * dpr)
    canvas.height = Math.floor(window.innerHeight * dpr)
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  window.addEventListener('resize', resize)

  function addDot(px, py) {
    dots.push({ x: px, y: py, t: performance.now() })
  }
  function addStick(x1, y1, x2, y2) {
    sticks.push({ x1, y1, x2, y2, t: performance.now() })
  }

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

  function tick() {
    const studio = document.body.classList.contains('on-studio')
    wrap.style.visibility = studio ? 'hidden' : 'visible'
    canvas.style.opacity = studio ? '0' : '1'

    if (!studio && !dragging) {
      x += vx
      y += vy
      vx *= 0.994
      vy *= 0.994
      const t = performance.now()
      vx += Math.sin(t / 1400) * 0.032
      vy += Math.cos(t / 1800) * 0.026
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

    const now = performance.now()
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
