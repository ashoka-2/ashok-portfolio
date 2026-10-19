import { useEffect, useState } from 'react'
import { Fur } from 'feral-fur'
import 'feral-fur/fur.css'

const mobileQuery = '(max-width: 520px)'

function readThemeColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--hero-light-rose').trim()
    || getComputedStyle(document.documentElement).getPropertyValue('--accent-pink').trim()
    || '#e57ba2'
}

export default function HeroFur({ interactionRef }) {
  const [mobile, setMobile] = useState(() => window.matchMedia(mobileQuery).matches)
  const [color, setColor] = useState(readThemeColor)

  useEffect(() => {
    const media = window.matchMedia(mobileQuery)
    const syncSize = (event) => setMobile(event.matches)
    const syncColor = () => setColor(readThemeColor())
    const observer = new MutationObserver(syncColor)
    media.addEventListener('change', syncSize)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('portfolio-theme-change', syncColor)
    syncColor()
    return () => {
      media.removeEventListener('change', syncSize)
      observer.disconnect()
      window.removeEventListener('portfolio-theme-change', syncColor)
    }
  }, [])

  return (
    <div
      className="ref-fur-name"
      onPointerDown={(event) => interactionRef?.current?.begin(event.nativeEvent || event)}
      title="Drag to pet the fur"
    >
      <Fur
        text={mobile ? 'ASHOK' : 'ASHOK KUMAR'}
        color={color}
        fluff={0.82}
        density={0.92}
        mess={0.34}
        seed={29}
        pettable
        className="ref-hero-fur"
        style={{ width: mobile ? 'min(94vw, 560px)' : 'min(96vw, 1280px)', aspectRatio: mobile ? '4.7 / 1' : '8.4 / 1' }}
      />
    </div>
  )
}
