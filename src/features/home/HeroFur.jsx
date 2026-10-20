import { useEffect, useState } from 'react'
import { Fur } from 'feral-fur'
import 'feral-fur/fur.css'

const mobileQuery = '(max-width: 520px)'

function readThemeColor() {
  return getComputedStyle(document.documentElement).getPropertyValue('--hero-light-rose').trim()
    || getComputedStyle(document.documentElement).getPropertyValue('--accent-pink').trim()
    || '#70ccff'
}

export default function HeroFur() {
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
      className="ref-fur-name absolute z-[2] top-[32%] left-1/2 flex w-[min(96vw,1280px)] -translate-x-1/2 justify-center overflow-visible opacity-75 drop-shadow-[0_0_18px_color-mix(in_srgb,var(--hero-light-rose)_26%,transparent)] pointer-events-auto touch-none cursor-crosshair max-[520px]:top-[33%] max-[520px]:w-[94vw] max-[520px]:opacity-65 min-[521px]:max-[820px]:top-[31%] min-[521px]:max-[820px]:w-[min(96vw,820px)] min-[821px]:max-[999px]:w-[min(94vw,820px)]"
      title="Move your cursor across the letters to ruffle the fur"
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
