const LIFE = 700
const SIZE = 180
const HIT = 118

function cmPx(n) {
  const el = document.createElement('div')
  el.style.cssText = `position:absolute;visibility:hidden;width:${n}cm;height:0`
  document.body.appendChild(el)
  const px = el.offsetWidth
  el.remove()
  return px || n * 37.795
}

export function startFx() {
  const wrap = document.querySelector('.holo-wrap')
  if (!wrap) return

  const canvas = document.createElement('canvas')
  canvas.className = 'trail-canvas'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  const stickLen = cmPx(2)

  let x = window.innerWidth * 0.62
  let y = window.innerHeight * 0.4
  let vx = 0.55
  let vy = -0.28
  let dragging = false
  let inside = false
  let lastMx = x
  let lastMy = y
  let lastT = performance.now()
  let anchor = null

  wrap.style.animation = 'none'
  wrap.style.left = '0'
  wrap.style.top = '0'
  wrap.style.cursor = 'grab'

  const sticks = []
  const dots = []

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.floor(window.innerWidth * dpr)
    canvas.height = Math.floor(window.innerHeight * dpr)
    canvas.style.width = window.innerWidth + 'px'
    canvas.style.height = window.innerHeight + 'px'
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
    if (!anchor) {
      anchor = { x: mx, y: my }
      addDot(mx, my)
      return
    }
    const jump = Math.hypot(mx - lastMx, my - lastMy)
    if (jump > stickLen * 4) {
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
      vx = ((mx - lastMx) / dt) * 18
      vy = ((my - lastMy) / dt) * 18
      x = mx
      y = my
    } else if (d < HIT) {
      if (!inside) {
        const nx = dx / (d || 1)
        const ny = dy / (d || 1)
        const speed = Math.hypot(mx - lastMx, my - lastMy)
        const impulse = 10 + Math.min(28, speed * 0.9)
        vx -= nx * impulse
        vy -= ny * impulse
      }
      inside = true
    } else {
      inside = false
    }

    lastMx = mx
    lastMy = my
    lastT = now
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', (e) => {
    if (Math.hypot(e.clientX - x, e.clientY - y) < HIT) {
      dragging = true
      wrap.style.cursor = 'grabbing'
    }
  })
  window.addEventListener('pointerup', () => {
    dragging = false
    wrap.style.cursor = 'grab'
  })
  window.addEventListener('pointerleave', () => {
    dragging = false
    anchor = null
  })

  function tick() {
    const studio = document.body.classList.contains('on-studio')
    if (!dragging) {
      x += vx
      y += vy
      vx *= 0.991
      vy *= 0.991
      vx += Math.sin(performance.now() / 1600) * 0.018
      vy += Math.cos(performance.now() / 2100) * 0.012
      const m = SIZE / 2 + 16
      if (x < m) {
        x = m
        vx = Math.abs(vx) * 0.86
      }
      if (y < m) {
        y = m
        vy = Math.abs(vy) * 0.86
      }
      if (x > window.innerWidth - m) {
        x = window.innerWidth - m
        vx = -Math.abs(vx) * 0.86
      }
      if (y > window.innerHeight - m) {
        y = window.innerHeight - m
        vy = -Math.abs(vy) * 0.86
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
        ctx.strokeStyle = `rgba(120, 190, 255, ${a * 0.92})`
        ctx.shadowColor = 'rgba(80, 160, 255, 0.8)'
        ctx.shadowBlur = 8
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.moveTo(s.x1, s.y1)
        ctx.lineTo(s.x2, s.y2)
        ctx.stroke()
      }
      ctx.shadowBlur = 0
      for (const d of dots) {
        const a = 1 - (now - d.t) / LIFE
        if (a <= 0) continue
        ctx.fillStyle = `rgba(180, 220, 255, ${a})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, 3.4, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    while (sticks.length && now - sticks[0].t > LIFE) sticks.shift()
    while (dots.length && now - dots[0].t > LIFE) dots.shift()
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}
