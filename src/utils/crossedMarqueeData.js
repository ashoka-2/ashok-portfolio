/**
 * Crossed Marquee Configuration & Content
 * 
 * Centralized data file for the Crossed Marquee component.
 * You can easily edit any text, badge, icon, speed, or styling
 * directly in this file at any time.
 */

// ============================================================================
// FRONT BAND ITEMS (Hero / Foreground Track)
// Bold craft specializations, brand tiles, and engineering capabilities
// ============================================================================
export const defaultFrontMarqueeItems = [
  {
    label: "CREATIVE TECHNOLOGIST",
    badge: "VISION",
    icon: "threejs",
    highlight: true,
  },
  {
    label: "REACT 19 & NEXT.JS",
    badge: "FRONTEND",
    icon: "react",
    highlight: false,
  },
  {
    label: "AUTONOMOUS AI AGENTS",
    badge: "INTELLIGENCE",
    icon: "gemini",
    highlight: true,
  },
  {
    label: "THREE.JS & SHADER MATH",
    badge: "3D / WEBGL",
    icon: "webgl",
    highlight: false,
  },
  {
    label: "FLUID MOTION CRAFT",
    badge: "GSAP 60+ FPS",
    icon: "gsap",
    highlight: true,
  },
  {
    label: "PYTHON & FASTAPI",
    badge: "BACKEND",
    icon: "python",
    highlight: false,
  },
  {
    label: "TAILWIND CSS & DESIGN SYSTEMS",
    badge: "UI / UX",
    icon: "tailwindcss",
    highlight: false,
  },
  {
    label: "DISTRIBUTED CLOUD & DOCKER",
    badge: "DEV OPS",
    icon: "docker",
    highlight: false,
  },
  {
    label: "NODE.JS & REALTIME SOCKETS",
    badge: "NETWORKING",
    icon: "nodejs",
    highlight: false,
  },
  {
    label: "TURN IDEAS INTO REALITY",
    badge: "ETHOS",
    icon: "github",
    highlight: true,
  },
]

// ============================================================================
// BACK BAND ITEMS (Secondary / Background Crossing Track)
// Ethos, philosophy, stack highlights, and rhythmic ambient text
// ============================================================================
export const defaultBackMarqueeItems = [
  { text: "LEARN → EXPERIMENT → BUILD → BREAK → UNDERSTAND → IMPROVE → SHIP", accent: true },
  { text: "HIGH-PERFORMANCE INTERFACES · ZERO JANK · 60+ FPS", accent: false },
  { text: "AUTONOMOUS MULTIMODAL AGENTS · REAL-TIME REASONING", accent: true },
  { text: "OBSESSIVE ATTENTION TO DETAIL & MICRO-INTERACTIONS", accent: false },
  { text: "REACT 19 · GSAP · THREE.JS · FASTAPI · TAILWIND · CLAUDE · GEMINI", accent: true },
  { text: "KERALA, INDIA · OPEN TO HIGH-IMPACT COLLABORATIONS", accent: false },
]

// ============================================================================
// CROSSED MARQUEE MOTION & BEHAVIOR CONFIG
// ============================================================================
export const crossedMarqueeConfig = {
  // Angle of the crossing bands in degrees (front band tilts +tilt, back band tilts -tilt)
  tilt: 3,

  // Seconds for the front band to travel one full loop (back band is 22% slower for natural parallax)
  duration: 42,
  backDurationMultiplier: 1.22,

  // Scroll reaction physics
  reactToScroll: true,           // Burst forward when scrolling down, reverse when scrolling up
  scrollBurstMultiplier: 0.18,    // Acceleration sensitivity to wheel/page scroll
  scrollDecayFriction: 0.93,     // Friction damping factor returning to cruise speed (0.90 = quick settle, 0.96 = glide longer)
  maxScrollVelocity: 16,         // Velocity ceiling to prevent visual vertigo

  // Interactivity & Accessibility
  pauseOnHover: false,           // Set to true to stop/slow down while cursor is hovered over band
  respectReducedMotion: true,    // Freezes animation if user has prefers-reduced-motion set in OS

  // Color tokens and palette mapping (integrated with portfolio design tokens)
  colors: {
    accentColor: "var(--accent, #38bdf8)",
    accentPink: "var(--accent-pink, #70ccff)",
    frontBg: "var(--surface-1, #101722)",
    frontInk: "var(--text-primary, #f0f7ff)",
    frontBorder: "var(--border-default, rgba(224, 242, 254, 0.14))",
    backBg: "var(--surface-2, #16202e)",
    backInk: "var(--text-secondary, #a8c2dc)",
    backBorder: "var(--border-subtle, rgba(224, 242, 254, 0.08))",
    tileBg: "var(--surface-3, #1d2a3d)",
    tileBorder: "var(--border-default, rgba(224, 242, 254, 0.16))",
  },
}
