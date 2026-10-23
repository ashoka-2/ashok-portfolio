import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { brandIcons } from '../../utils/brandIcons.js'
import {
  crossedMarqueeConfig,
  defaultBackMarqueeItems,
  defaultFrontMarqueeItems,
} from '../../utils/crossedMarqueeData.js'

/**
 * Normalizes identifier strings to find matching brand keys
 */
function normalizeKey(str = '') {
  return String(str).toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Extracts 1-2 character monogram initials when no icon is available
 */
function getInitials(label = '') {
  const parts = String(label).trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return label.slice(0, 2).toUpperCase()
}

/**
 * Renders an icon from SVG path/data, React Node, or brand icon lookup
 */
function MarqueeIcon({ icon, label, tileColor, bandInk, accentColor }) {
  // If icon is already a valid React Element (JSX), render directly
  if (icon && typeof icon === 'object' && !('body' in icon)) {
    return (
      <span className="grid size-full place-items-center text-current" aria-hidden="true">
        {icon}
      </span>
    )
  }

  // Look up icon in brandIcons if a string or object was passed
  const iconKey = typeof icon === 'string' ? normalizeKey(icon) : normalizeKey(label)
  const iconData = (typeof icon === 'object' && icon?.body) ? icon : brandIcons[iconKey]

  if (iconData?.body) {
    return (
      <svg
        viewBox={`0 0 ${iconData.width || 24} ${iconData.height || 24}`}
        className="size-5 sm:size-5.5 md:size-6 transition-transform duration-300 group-hover:scale-110"
        fill="currentColor"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: iconData.body }}
      />
    )
  }

  // Fallback: Elegant typographic monogram tile
  return (
    <span
      className="font-mono text-[10px] sm:text-[11px] md:text-xs font-bold tracking-tight text-text-primary"
      aria-hidden="true"
    >
      {getInitials(label)}
    </span>
  )
}

/**
 * Crossed Marquee Component
 * 
 * Two tilted bands crossing in an X shape, scrolling infinitely in opposite directions.
 * Accelerates forward when scrolling down and smoothly reverses when scrolling up,
 * before gently damping back to cruise speed on the GSAP ticker.
 */
export default function CrossedMarquee({
  items = defaultFrontMarqueeItems,
  backItems = defaultBackMarqueeItems,
  duration = crossedMarqueeConfig.duration,
  tilt = crossedMarqueeConfig.tilt,
  accentColor = crossedMarqueeConfig.colors.accentColor,
  bandInk = crossedMarqueeConfig.colors.frontInk,
  frontColor = crossedMarqueeConfig.colors.frontBg,
  backColor = crossedMarqueeConfig.colors.backBg,
  tileColor = crossedMarqueeConfig.colors.tileBg,
  showBackBand = true,
  reactToScroll = crossedMarqueeConfig.reactToScroll,
  pauseOnHover = crossedMarqueeConfig.pauseOnHover,
  className = '',
}) {
  const containerRef = useRef(null)
  const frontTrackRef = useRef(null)
  const backTrackRef = useRef(null)
  const regionId = useId()

  const [isHovered, setIsHovered] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Normalize front band items
  const normalizedFrontItems = useMemo(() => {
    return (items || []).map((item, idx) => {
      if (typeof item === 'string') {
        return { id: `item-${idx}`, label: item, badge: null, icon: item, highlight: false }
      }
      return {
        id: item.id || `item-${idx}`,
        label: item.label || '',
        badge: item.badge || null,
        icon: item.icon || item.label,
        highlight: Boolean(item.highlight),
      }
    })
  }, [items])

  // Normalize back band items
  const normalizedBackItems = useMemo(() => {
    return (backItems || []).map((item, idx) => {
      if (typeof item === 'string') {
        return { id: `back-${idx}`, text: item, accent: false }
      }
      return {
        id: item.id || `back-${idx}`,
        text: item.text || '',
        accent: Boolean(item.accent),
      }
    })
  }, [backItems])

  // Duplicate items 3x for a mathematically seamless -50% GSAP wrapping loop
  const frontLoop = useMemo(
    () => [...normalizedFrontItems, ...normalizedFrontItems, ...normalizedFrontItems],
    [normalizedFrontItems]
  )

  const backLoop = useMemo(
    () => [...normalizedBackItems, ...normalizedBackItems, ...normalizedBackItems],
    [normalizedBackItems]
  )

  // Check prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    const listener = (e) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  // Animation & Scroll reaction using GSAP Ticker
  useEffect(() => {
    if (reducedMotion) return

    const frontTrack = frontTrackRef.current
    const backTrack = backTrackRef.current
    if (!frontTrack) return

    // Position state tracked in percentage
    let frontXPercent = 0
    let backXPercent = -50

    // Velocity state
    let scrollVelocity = 0
    let lastScrollY = window.scrollY
    let isTicking = true

    // Scroll listener for direction and burst response
    const handleScroll = () => {
      if (!reactToScroll) return
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollY
      lastScrollY = currentScrollY

      // Down-scroll (delta > 0) boosts forward
      // Up-scroll (delta < 0) reverses the direction
      const burst = delta * crossedMarqueeConfig.scrollBurstMultiplier
      scrollVelocity += burst

      // Clamp max burst to avoid disorienting speed
      const maxV = crossedMarqueeConfig.maxScrollVelocity
      if (scrollVelocity > maxV) scrollVelocity = maxV
      if (scrollVelocity < -maxV) scrollVelocity = -maxV
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Base loop speeds (% per second)
    const baseSpeedFront = 100 / Math.max(duration, 10)
    const baseSpeedBack = 100 / Math.max(duration * crossedMarqueeConfig.backDurationMultiplier, 10)

    // Ticker callback
    const tick = (time, deltaTime) => {
      if (!isTicking) return

      const dt = Math.min(deltaTime / 1000, 0.1) // clamp delta time for tab switching

      // Friction decay on scroll velocity
      scrollVelocity *= crossedMarqueeConfig.scrollDecayFriction
      if (Math.abs(scrollVelocity) < 0.001) scrollVelocity = 0

      // Hover damping factor
      const hoverFactor = isHovered && pauseOnHover ? 0 : 1

      // Net velocity calculations
      // Front moves leftward (negative X) by default
      const netFrontSpeed = (baseSpeedFront * hoverFactor) + (scrollVelocity * 0.14)
      frontXPercent -= netFrontSpeed * dt

      // Back moves rightward (positive X) by default
      const netBackSpeed = (baseSpeedBack * hoverFactor) + (scrollVelocity * 0.14 * 0.8)
      backXPercent += netBackSpeed * dt

      // Wrap continuously from -50% to 0% so it never hits an edge
      const wrappedFront = gsap.utils.wrap(-50, 0, frontXPercent)
      gsap.set(frontTrack, { xPercent: wrappedFront, force3D: true })

      if (backTrack) {
        const wrappedBack = gsap.utils.wrap(-50, 0, backXPercent)
        gsap.set(backTrack, { xPercent: wrappedBack, force3D: true })
      }
    }

    gsap.ticker.add(tick)

    return () => {
      isTicking = false
      gsap.ticker.remove(tick)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [duration, reactToScroll, pauseOnHover, isHovered, reducedMotion])

  // Mouse hover handlers
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsHovered(true)
  }, [pauseOnHover])

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsHovered(false)
  }, [pauseOnHover])

  return (
    <section
      ref={containerRef}
      aria-label="Crossed Marquee — Specializations and Creative Engineering"
      id={regionId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`crossed-marquee-section relative w-full overflow-hidden isolate py-16 sm:py-20 md:py-28 select-none ${className}`}
      style={{
        '--cm-accent': accentColor,
        '--cm-front-ink': bandInk,
        '--cm-front-bg': frontColor,
        '--cm-back-bg': backColor,
        '--cm-tile-bg': tileColor,
      }}
    >
      {/* Edge gradient vignettes for smooth bleed into page background */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 md:w-40 z-30 bg-gradient-to-r from-base-bg via-base-bg/80 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 md:w-40 z-30 bg-gradient-to-l from-base-bg via-base-bg/80 to-transparent"
        aria-hidden="true"
      />

      {/* Center atmospheric spotlight accent glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[700px] aspect-[4/1] rounded-full bg-[radial-gradient(ellipse,color-mix(in_srgb,var(--cm-accent)_16%,transparent),transparent_70%)] blur-[28px] -z-10"
        aria-hidden="true"
      />

      {/* ===================================================================== */}
      {/* BACK BAND (Crossing in reverse direction, tilted at -tilt)           */}
      {/* ===================================================================== */}
      {showBackBand && (
        <div
          className="back-band-wrapper relative z-10 w-[150vw] -left-[25vw] my-[-1.5rem] sm:my-[-2rem] origin-center pointer-events-auto"
          style={{
            transform: `rotate(${-tilt}deg)`,
            transformOrigin: '50% 50%',
          }}
        >
          <div
            className="back-band relative flex h-[3.25rem] sm:h-[3.75rem] md:h-[4.25rem] items-center border-y border-border-subtle bg-surface-2/90 backdrop-blur-md shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]"
            style={{
              backgroundColor: 'var(--cm-back-bg)',
            }}
          >
            <div
              ref={backTrackRef}
              className="back-marquee-track flex w-max items-center whitespace-nowrap will-change-transform"
            >
              {backLoop.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="inline-flex items-center gap-6 sm:gap-8 md:gap-10 px-4 sm:px-6 md:px-8 font-mono text-[11px] sm:text-xs md:text-[13px] tracking-[0.14em] uppercase font-medium text-text-secondary transition-colors duration-200"
                >
                  <span
                    className={
                      item.accent
                        ? 'text-accent font-semibold drop-shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                        : 'text-text-secondary'
                    }
                  >
                    {item.text}
                  </span>
                  <span
                    className="inline-block size-1.5 rounded-full bg-accent/40 shadow-[0_0_8px_var(--cm-accent)]"
                    aria-hidden="true"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* FRONT BAND (Hero track, crossing at +tilt, in front with rich tiles)   */}
      {/* ===================================================================== */}
      <div
        className="front-band-wrapper relative z-20 w-[150vw] -left-[25vw] origin-center pointer-events-auto"
        style={{
          transform: `rotate(${tilt}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        <div
          className="front-band relative flex h-[4.25rem] sm:h-[4.85rem] md:h-[5.5rem] items-center border-y border-border-default bg-surface-1/95 backdrop-blur-xl shadow-[0_22px_50px_-10px_rgba(0,0,0,0.85)]"
          style={{
            backgroundColor: 'var(--cm-front-bg)',
            color: 'var(--cm-front-ink)',
            boxShadow:
              '0 24px 60px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.4)',
          }}
        >
          <div
            ref={frontTrackRef}
            className="front-marquee-track flex w-max items-center whitespace-nowrap will-change-transform"
          >
            {frontLoop.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="group inline-flex items-center gap-3 sm:gap-4 md:gap-5 px-5 sm:px-7 md:px-9 transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Brand / Tool Squircle Icon Tile */}
                <div
                  className="flex size-10 sm:size-11 md:size-12 items-center justify-center rounded-[12px] sm:rounded-[14px] border border-border-default shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_12px_rgba(0,0,0,0.35)] transition-all duration-300 group-hover:border-accent group-hover:shadow-[0_0_18px_rgba(56,189,248,0.35)]"
                  style={{
                    backgroundColor: 'var(--cm-tile-bg)',
                    color: item.highlight ? 'var(--cm-accent)' : 'var(--cm-front-ink)',
                  }}
                >
                  <MarqueeIcon
                    icon={item.icon}
                    label={item.label}
                    tileColor={tileColor}
                    bandInk={bandInk}
                    accentColor={accentColor}
                  />
                </div>

                {/* Big Bold Label & Optional Badge */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span
                    className={`font-[var(--font-bold)] text-[clamp(16px,2vw,24px)] font-extrabold tracking-[-0.035em] uppercase transition-colors duration-300 ${
                      item.highlight
                        ? 'text-text-primary group-hover:text-accent drop-shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                        : 'text-text-primary/95 group-hover:text-text-primary'
                    }`}
                  >
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="hidden sm:inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2 sm:px-2.5 py-0.5 font-mono text-[9px] sm:text-[10px] font-semibold tracking-wider text-accent uppercase">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Divider diamond sparkle / dot */}
                <span
                  className="inline-block size-1.5 sm:size-2 rotate-45 bg-accent/60 shadow-[0_0_10px_var(--cm-accent)] ml-3 sm:ml-4"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
