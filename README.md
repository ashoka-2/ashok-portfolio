# Ashok Kumar — Creative Developer & Frontend Architect Portfolio

An award-grade, creative portfolio engineered with **React 19**, **Vite**, **Tailwind CSS v4**, **GSAP**, **Three.js / React Three Fiber**, **Matter.js**, and **Lenis** smooth scrolling. Built for speed, fluid physical motion, tactile analog film grain, and high-end interactive storytelling.

---

## ✦ Key Highlights & Creative Tech

- **Dual-Layer Interactive 3D Hero:**
  - Front: Real-time 3D model canvas (`@react-three/fiber` + Drei) with cursor-reactive rotation, spring momentum, and lighting.
  - Background: Particle-driven interactive fur / fluid canvas reacting dynamically to cursor velocity and pointer proximity.
- **Tactile Film Grain & Noise System:**
  - Integrated monochrome high-contrast film noise texture (`grain-noise.png`) rendered across all cards, navigation bar, hero stage, and footer with calibrated `overlay` / `multiply` blend modes for a tactile, analog matte finish.
- **Fluid Gooey Custom Cursor Follower:**
  - SVG metaball filter (`feGaussianBlur` + `feColorMatrix` steep alpha threshold) creating a cohesive liquid droplet that stretches dynamically with cursor speed.
  - Isolated translation wrappers tracking the pointer tip with zero lag, plus a crisp typography badge ("VIEW" / "OPEN") on hover over interactive elements.
- **Elastic SVG Pull-Cord Theme Switcher:**
  - Interactive hanging pull-cord with draggable physics and elastic spring rebound triggering a smooth, full-page radial clip-path transition between Dark (`#0a0a0a`) and Light (`#fafafa`) themes.
- **Full-Screen Circular Clip-Path Navigation:**
  - Desktop pill bar and responsive mobile navigation featuring an expansive circular clip-path reveal with index navigation links.
- **Scroll-Scrubbed Single-Card Project Story:**
  - Pinned full-screen showcase with circular mask expansion, live progress counter, and direct case study routes.
- **2D Matter.js Interactive Physics Playground:**
  - Draggable, colliding glass emblem lamps containing perfectly centered vector tech marks and real-time bounding physics.
- **Comprehensive Case Studies & Tech Pages:**
  - Dedicated dynamic routes for projects (`/projects/:slug`) and technology deep dives (`/tech/:slug`) with responsive lightboxes and media viewports.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Core Framework** | [React 19](https://react.dev/), [React Router 7](https://reactrouter.com/), [Vite](https://vitejs.dev/) |
| **Styling & Design Tokens** | [Tailwind CSS v4](https://tailwindcss.com/), Vanilla CSS Variables, Fluid Typography (`clamp`) |
| **Animation & Scroll** | [GSAP 3](https://greensock.com/gsap/) (ScrollTrigger, Flip), [@gsap/react](https://github.com/greensock/react), [Lenis](https://github.com/darkroomengineering/lenis) |
| **3D & WebGL Graphics** | [Three.js](https://threejs.org/), [@react-three/fiber](https://r3f.docs.pmnd.rs/), [@react-three/drei](https://github.com/pmndrs/drei) |
| **2D Physics Engine** | [Matter.js](https://brm.io/matter-js/) |
| **Icons & Typography** | [Lucide React](https://lucide.dev/), [@iconify/react](https://iconify.design/), Inter / Geist variable typography |

---

## 📁 Project Architecture

```text
ashok-portfolio/
├── public/
│   ├── images/
│   │   ├── grain-noise.png        # Dedicated tactile film grain raster tile
│   │   └── projects/              # Project screenshots & desktop assets
│   ├── models/                    # 3D GLTF/GLB models for hero canvas
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── app.jsx                # Root shell, routing, preloader,Lenis provider
│   │   └── app.routes.jsx         # Application routes definition
│   ├── components/
│   │   ├── buttons/               # Button primitives (primary, secondary, magnetic)
│   │   ├── layout/
│   │   │   ├── Preloader.jsx      # Initial numerical counter & curtain reveal
│   │   │   ├── RouteCurtain.jsx   # Page transition curtain
│   │   │   ├── SiteFooter.jsx     # Contact section, interactive goo name, meta
│   │   │   ├── SiteHeader.jsx     # Navbar with grain, menu overlay, links
│   │   │   └── ThemeToggle.jsx    # SVG elastic pull-cord theme switcher
│   │   ├── motion/
│   │   │   ├── CursorFollower.jsx # Gooey metaball custom cursor follower
│   │   │   └── Marquee.jsx        # Velocity-reactive infinite scroll banner
│   │   └── tech/
│   │       ├── TechLamp.jsx       # Glowing tech emblem lamp with centered icons
│   │       └── TechMark.jsx       # Brand vector icon renderer
│   ├── features/
│   │   ├── home/
│   │   │   ├── HeroFur.jsx        # Interactive fur/particle canvas
│   │   │   ├── HeroModelCanvas.jsx# 3D interactive model canvas
│   │   │   ├── HomePage.jsx       # Main landing page
│   │   │   ├── InfoPages.jsx      # About & Contact dedicated views
│   │   │   └── ReferenceSections.jsx # Bento cards, process timeline, estimator
│   │   ├── physics/
│   │   │   └── PhysicsField.jsx   # Matter.js 2D physics interactive sandbox
│   │   ├── projects/
│   │   │   ├── ProjectCard.jsx    # Project showcase cards
│   │   │   ├── ProjectPage.jsx    # Deep-dive case study page & lightbox
│   │   │   ├── ProjectsPage.jsx   # Works directory with filter tabs
│   │   │   ├── ProjectStack.jsx   # Pinned single-card scrubbed story deck
│   │   │   └── SelectedWorks.jsx  # Selected works index
│   │   └── tech/
│   │       └── TechPage.jsx       # Individual technology deep dive pages
│   ├── utils/
│   │   ├── brandIcons.js          # Iconify brand mappings
│   │   ├── colors.js              # Palette tokens
│   │   ├── pageContent.js         # Text copy, FAQs, process steps, estimator data
│   │   ├── profile.js             # Personal bio, education, socials, contact info
│   │   ├── projects.js            # Featured projects data, tags, URLs
│   │   ├── site.js                # Navigation routes & site configuration
│   │   └── tech.js                # Toolbox skills, lamp colors, categories
│   ├── index.css                  # Design tokens, theme variables, grain rules
│   └── main.jsx                   # Entry point
├── package.json
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ or 20+
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/Ashokk-Kumar/ashok-portfolio.git

# Navigate to project directory
cd "ashok portfolio"

# Install dependencies
npm install
```

### Development

```bash
# Start local development server with HMR
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## ✏️ Customization & Updating Content

All personal data, projects, and site copy are decoupled into clean data files in `src/utils/`:

- **Profile & Bio:** Edit [src/utils/profile.js](file:///d:/Portfolio/ashok%20portfolio/src/utils/profile.js) to update your name, title, bio, education, email, and social links.
- **Projects & Case Studies:** Edit [src/utils/projects.js](file:///d:/Portfolio/ashok%20portfolio/src/utils/projects.js) to add or modify project titles, descriptions, categories, stack tags, live links, and desktop preview assets.
- **Tech Stack & Toolbox:** Edit [src/utils/tech.js](file:///d:/Portfolio/ashok%20portfolio/src/utils/tech.js) and [src/utils/brandIcons.js](file:///d:/Portfolio/ashok%20portfolio/src/utils/brandIcons.js) to configure skills, custom lamp glow hues, and categories.
- **Page Copy & Process Steps:** Edit [src/utils/pageContent.js](file:///d:/Portfolio/ashok%20portfolio/src/utils/pageContent.js) to adjust the About manifesto, process steps, and project estimator questions.
- **Colors & Design Tokens:** Edit [src/index.css](file:///d:/Portfolio/ashok%20portfolio/src/index.css) to customize base themes, surface colors, borders, and typography scales.

---

## 📄 License

Designed and authored by **Ashok Kumar**. All rights reserved.
