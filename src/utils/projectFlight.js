import gsap from 'gsap'

let activeFlight = null

export function getActiveFlight() {
  return activeFlight
}

export function startProjectFlight(slug, sourceImg) {
  if (!sourceImg || !slug) return false
  const img = sourceImg.tagName === 'IMG' ? sourceImg : sourceImg.querySelector('img')
  if (!img) return false

  const rect = img.getBoundingClientRect()
  if (!rect.width || !rect.height) return false

  const borderRadius = window.getComputedStyle(img).borderRadius || '16px'

  // Create fixed-position ghost clone
  const ghost = document.createElement('img')
  ghost.src = img.currentSrc || img.src
  ghost.alt = ''
  Object.assign(ghost.style, {
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    objectFit: 'cover',
    borderRadius,
    zIndex: '99999',
    pointerEvents: 'none',
    margin: '0',
    transformOrigin: 'top left',
    willChange: 'transform, width, height, border-radius',
  })
  gsap.set(ghost, { x: rect.left, y: rect.top })

  ghost.dataset.projectGhost = slug
  document.body.appendChild(ghost)

  activeFlight = {
    slug,
    ghost,
    fromRect: rect,
    sourceImg: img,
  }

  // Hide the original image while ghost is flying
  img.style.visibility = 'hidden'

  return true
}

export function landProjectFlight(slug, targetImg) {
  if (!activeFlight || activeFlight.slug !== slug || !targetImg) {
    clearProjectFlight()
    window.dispatchEvent(new Event('portfolio:route-transition-end'))
    return false
  }

  const { ghost, sourceImg } = activeFlight
  activeFlight = null

  const targetRect = targetImg.getBoundingClientRect()
  if (!targetRect.width || !targetRect.height) {
    ghost.remove()
    if (sourceImg?.isConnected) sourceImg.style.visibility = ''
    window.dispatchEvent(new Event('portfolio:route-transition-end'))
    return false
  }

  const targetRadius = window.getComputedStyle(targetImg).borderRadius || '16px'
  gsap.set(targetImg, { autoAlpha: 0 })

  // Animate ghost to target rect
  gsap.to(ghost, {
    x: targetRect.left,
    y: targetRect.top,
    width: targetRect.width,
    height: targetRect.height,
    borderRadius: targetRadius,
    duration: 0.62,
    ease: 'expo.inOut',
    onComplete: () => {
      ghost.remove()
      gsap.set(targetImg, { autoAlpha: 1 })
      if (sourceImg?.isConnected) sourceImg.style.visibility = ''
      window.dispatchEvent(new Event('portfolio:route-transition-end'))
    },
  })

  return true
}

export function clearProjectFlight() {
  if (activeFlight?.ghost?.isConnected) {
    activeFlight.ghost.remove()
  }
  if (activeFlight?.sourceImg?.isConnected) {
    activeFlight.sourceImg.style.visibility = ''
  }
  activeFlight = null
}
