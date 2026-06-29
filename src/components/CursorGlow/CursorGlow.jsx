import { useEffect } from 'react'
import './CursorGlow.scss'

function CursorGlow() {
  useEffect(() => {
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return

    const glow = document.createElement('div')
    glow.className = 'dr-cursor-glow'
    document.body.appendChild(glow)

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let currentX = mouseX
    let currentY = mouseY
    let rafId = null

    function animate() {
      currentX += (mouseX - currentX) * 0.18
      currentY += (mouseY - currentY) * 0.18
      glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`
      rafId = requestAnimationFrame(animate)
    }

    function updateHoverState(target) {
      if (!target || typeof target.closest !== 'function') return
      const hoverable = target.closest('a, button, input, textarea, select, [role="button"]')
      glow.classList.toggle('is-hovering', !!hoverable)
    }

    function onMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY

      glow.classList.add('is-visible')

      if (e.target) {
        updateHoverState(e.target)
      }

      if (!rafId) animate()
    }

    function hide() {
      glow.classList.remove('is-visible')
    }

    document.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
      cancelAnimationFrame(rafId)
      glow.remove()
    }
  }, [])

  return null
}

export default CursorGlow
