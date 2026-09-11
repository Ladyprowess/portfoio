const colours = ['#2563EB', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#FACC15', '#507B80']

type Piece = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  spin: number
  colour: string
  round: boolean
  life: number
}

// A party-popper burst from both sides of an element, drawn on a temporary canvas.
export function launchConfetti(origin: HTMLElement) {
  if (typeof window === 'undefined') return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const width = window.innerWidth
  const height = window.innerHeight
  const ratio = Math.min(window.devicePixelRatio || 1, 2)
  const canvas = document.createElement('canvas')
  canvas.width = width * ratio
  canvas.height = height * ratio
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '10000' })
  const context = canvas.getContext('2d')
  if (!context) return
  document.body.appendChild(canvas)
  context.scale(ratio, ratio)

  const rect = origin.getBoundingClientRect()
  const originY = Math.min(Math.max(rect.top + rect.height * 0.4, 80), height - 40)
  const pieces: Piece[] = Array.from({ length: 170 }, (_, index) => {
    const fromLeft = index % 2 === 0
    const angle = ((fromLeft ? -60 : -120) + (Math.random() - 0.5) * 50) * (Math.PI / 180)
    const speed = 9 + Math.random() * 10
    return {
      x: Math.min(Math.max(fromLeft ? rect.left + 24 : rect.right - 24, 16), width - 16),
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 6,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.35,
      colour: colours[index % colours.length],
      round: Math.random() < 0.3,
      life: 150 + Math.random() * 70,
    }
  })

  let frame = 0
  const draw = () => {
    frame += 1
    context.clearRect(0, 0, width, height)
    let alive = 0
    for (const piece of pieces) {
      if (frame > piece.life || piece.y > height + 20) continue
      alive += 1
      piece.vx *= 0.985
      piece.vy = piece.vy * 0.985 + 0.32
      piece.x += piece.vx
      piece.y += piece.vy
      piece.rotation += piece.spin
      context.globalAlpha = Math.min(1, (piece.life - frame) / 40)
      context.fillStyle = piece.colour
      context.save()
      context.translate(piece.x, piece.y)
      context.rotate(piece.rotation)
      if (piece.round) {
        context.beginPath()
        context.arc(0, 0, piece.size / 2.4, 0, Math.PI * 2)
        context.fill()
      } else {
        context.fillRect(-piece.size / 2, -piece.size / 4, piece.size, piece.size / 2)
      }
      context.restore()
    }
    if (alive) window.requestAnimationFrame(draw)
    else canvas.remove()
  }
  window.requestAnimationFrame(draw)
}
