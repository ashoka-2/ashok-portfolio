import { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import gsap from 'gsap'
import { toggleTheme } from '../../features/preferences/themeSlice.js'

export default function ThemeToggle({ className = '' }) {
  const mode = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()
  const cordRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const dragStartY = useRef(0)
  const currentPull = useRef(0)

  const handlePointerDown = (e) => {
    setDragging(true)
    dragStartY.current = e.clientY
    currentPull.current = 0
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  const handlePointerMove = (e) => {
    const diff = Math.max(0, Math.min(65, e.clientY - dragStartY.current))
    currentPull.current = diff
    if (cordRef.current) {
      gsap.to(cordRef.current, {
        y: diff,
        duration: 0.1,
        ease: 'power1.out',
        overwrite: 'auto',
      })
    }
  }

  const triggerThemeTransition = (e) => {
    const nextMode = mode === 'dark' ? 'light' : 'dark'
    
    // Circular clip-path transition
    const circle = document.createElement('div')
    const x = e?.clientX || window.innerWidth - 60
    const y = e?.clientY || 40
    
    Object.assign(circle.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '99998',
      background: nextMode === 'dark' ? '#090A0F' : '#F4F0EA',
      clipPath: `circle(0px at ${x}px ${y}px)`,
      transition: 'clip-path 0.7s cubic-bezier(0.77, 0, 0.175, 1)',
    })
    
    document.body.appendChild(circle)
    
    requestAnimationFrame(() => {
      circle.style.clipPath = `circle(150% at ${x}px ${y}px)`
    })
    
    setTimeout(() => {
      dispatch(toggleTheme())
    }, 280)
    
    setTimeout(() => {
      circle.remove()
    }, 750)
  }

  const handlePointerUp = (e) => {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerUp)
    setDragging(false)
    
    if (currentPull.current > 32) {
      triggerThemeTransition(e)
    }

    if (cordRef.current) {
      gsap.to(cordRef.current, {
        y: 0,
        duration: 0.85,
        ease: 'elastic.out(1.2, 0.35)',
      })
    }
    currentPull.current = 0
  }

  return (
    <div 
      className={`pull-cord-wrap ${className}`} 
      onPointerDown={handlePointerDown} 
      onClick={(e) => {
        if (currentPull.current <= 5) {
          gsap.fromTo(cordRef.current, 
            { y: 0 }, 
            { y: 38, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.inOut', onComplete: () => triggerThemeTransition(e) }
          )
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          triggerThemeTransition(e)
        }
      }}
      title="Pull cord to toggle dark/light theme"
      role="button"
      tabIndex={0}
      aria-label={`Toggle theme (currently ${mode})`}
    >
      <svg 
        className="pull-cord-svg" 
        width="22" 
        height="64" 
        viewBox="0 0 22 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={cordRef}>
          {/* Top bracket fixture */}
          <rect x="7" y="0" width="8" height="4" rx="1.5" fill="var(--text-tertiary)" />
          {/* Flexible hanging beaded chain */}
          <line x1="11" y1="4" x2="11" y2="44" stroke="var(--text-muted)" strokeWidth="1.5" strokeDasharray="2 3" />
          {/* Weighted handle bead with glowing accent */}
          <circle cx="11" cy="48" r="7" fill="var(--surface-2)" stroke="var(--accent-pink)" strokeWidth="1.5" />
          <circle cx="11" cy="48" r="3.5" fill={mode === 'dark' ? 'var(--accent-pink)' : 'var(--accent-amber)'} />
        </g>
      </svg>
    </div>
  )
}
