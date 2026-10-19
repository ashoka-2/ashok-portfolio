import { flushSync } from 'react-dom'
import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PullCord } from 'pullcord'
import 'pullcord/pullcord.css'
import { toggleTheme } from '../../features/preferences/themeSlice.js'

export default function ThemeToggle({ className = '', isHidden = false }) {
  const mode = useSelector((state) => state.theme.mode)
  const dispatch = useDispatch()
  const pointerDown = useRef(false)
  const releasePending = useRef(false)

  const applyThemeTransition = () => {
    const knob = document.querySelector('.theme-cord-navbar .pullcord-knob')
    const knobRect = knob?.getBoundingClientRect()
    const originX = knobRect ? knobRect.left + knobRect.width / 2 : window.innerWidth - 32
    const originY = knobRect ? knobRect.top + knobRect.height / 2 : 176
    document.documentElement.style.setProperty('--theme-click-x', `${originX}px`)
    document.documentElement.style.setProperty('--theme-click-y', `${originY}px`)

    if (document.startViewTransition) {
      document.startViewTransition(() => flushSync(() => dispatch(toggleTheme())))
      return
    }

    // Keep the same expanding blur transition where View Transitions are unavailable.
    const wave = document.createElement('div')
    wave.className = 'theme-wave-fallback'
    wave.style.setProperty('--theme-click-x', `${originX}px`)
    wave.style.setProperty('--theme-click-y', `${originY}px`)
    document.body.appendChild(wave)
    requestAnimationFrame(() => {
      wave.classList.add('is-visible')
      window.setTimeout(() => flushSync(() => dispatch(toggleTheme())), 220)
      wave.addEventListener('transitionend', () => wave.remove(), { once: true })
    })
  }

  useEffect(() => {
    const onPointerDown = () => { pointerDown.current = true }
    const onPointerUp = () => {
      pointerDown.current = false
      if (releasePending.current) {
        releasePending.current = false
        applyThemeTransition()
      }
    }
    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('pointerup', onPointerUp, true)
    window.addEventListener('pointercancel', onPointerUp, true)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('pointerup', onPointerUp, true)
      window.removeEventListener('pointercancel', onPointerUp, true)
    }
  }, [])

  const onPull = () => {
    // PullCord signals at its detent; wait for the physical release before
    // starting the page-wide theme reveal. Click and keyboard still respond.
    if (pointerDown.current) {
      releasePending.current = true
      return
    }
    applyThemeTransition()
  }

  return (
    <PullCord
      className={`${className}${isHidden ? ' nav-hidden' : ''}`}
      onPull={onPull}
      pulled={mode === 'light'}
      ariaLabel={`Toggle theme (currently ${mode})`}
      config={{ gravity: 1250, damping: 0.94, iterations: 20, stretchMax: 26 }}
    />
  )
}
