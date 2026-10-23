/**
 * SectionBlend Component
 * 
 * Creates an ultra-smooth, atmospheric, blurry gradient transition between two sections.
 * Dissolves differing section background colors, gradients, and mesh lighting into the
 * theme's solid background color (--base-bg) using backdrop blur and alpha feathering,
 * ensuring seamless, continuous visual harmony across the entire page.
 */
export default function SectionBlend({ className = '' }) {
  return (
    <div
      className={`section-blend-boundary pointer-events-none relative z-10 w-full h-[clamp(70px,11vw,130px)] -my-[clamp(35px,5.5vw,65px)] overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Blurred atmospheric gradient core */}
      <div
        className="absolute inset-0 backdrop-blur-[20px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_25%,black_75%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_25%,black_75%,transparent_100%)]"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--base-bg) 75%, transparent) 30%, var(--base-bg) 50%, color-mix(in srgb, var(--base-bg) 75%, transparent) 70%, transparent 100%)',
        }}
      />
    </div>
  )
}
