// Editable copy and repeatable content for the portfolio's current homepage.
// Project descriptions and technology entries live in projects.js and tech.js.
export const homePageContent = {
  ribbonPhrases: ["LET'S MAKE IT MAKE SENSE", 'GOOD LOOKS INCLUDED', 'UI / UX AND CREATIVE ENGINEERING', 'SHADERS AND MOTION'],
  hero: {
    title: 'Turning ideas into real digital experiences.',
    openLabel: 'Open to interesting projects',
    description: 'Ashok Kumar, software developer, AI enthusiast and creative technologist.',
    stickers: ['Independent developer', 'Motion in my DNA', 'No funny business'],
    meta: ['Kerala, IN', 'AI apps', 'Creative tech'],
    primaryAction: 'Explore work',
    secondaryAction: 'Say hello',
    hint: 'Drag to spin',
  },
  selectedWork: {
    kicker: '02 — SELECTED PROJECTS',
    heading: ['Ideas,', 'in motion.'],
    description: 'A collection of systems and experiences built with curiosity, craft, and a bias toward making.',
    countLabel: 'CASE STUDIES',
  },
}

export const aboutContent = {
  section: { number: '01', label: 'About', heading: ['A bit about', 'me'] },
  manifesto: ["I'm Ashok, a ", 'software developer', ' from Kerala. I learn, experiment, build, break, understand, improve and build again. ', 'AI apps', ', creative interfaces and ', 'things that move', " are where I'm happiest."],
  workStyles: ['Thinks.', 'Experiments.', 'Builds.', 'Learns.', 'Improves.'],
  skillGroups: {
    Frontend: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Flutter'],
    Backend: ['Python', 'Django', 'FastAPI', 'Node.js', 'REST APIs', 'WebSockets'],
    Creative: ['GSAP', 'Framer Motion', 'Three.js', 'Interactive UI', 'Motion design', 'Creative coding', 'Scroll animations'],
    'AI / GenAI': ['AI agents', 'AI apps', 'Automation', 'Image and video generation', 'Computer vision'],
    DevOps: ['Docker', 'Kubernetes', 'AWS', 'Firebase', 'Vercel', 'Git', 'GitHub'],
    Databases: ['MongoDB', 'MySQL', 'SQLite', 'Firebase'],
    Design: ['Figma', 'UI/UX', 'Interaction design', 'Product design', 'Rapid prototyping'],
  },
  openTo: ['Interesting projects', 'Software development', 'AI projects', 'Creative technology', 'Freelance work', 'Experimental projects', 'Product development', 'Developer collaborations'],
  labels: { workStyle: 'How I work', stack: 'Stack', skillTabs: 'Skill groups', numbers: 'By the numbers', projects: 'Projects', tools: 'Tools', skillAreas: 'Skill areas', education: 'Education', degree: 'BCA', openTo: 'Open to' },
}

export const processContent = {
  section: { number: '03', label: 'Process', heading: ['Idea to', 'shipped'], aside: 'Scroll sideways, or swipe.' },
  steps: [
    ['Idea', 'Start with a problem worth solving.'], ['Design', 'Sketch the flow before the pixels.'],
    ['Experiment', 'Try the risky version first.'], ['Build', 'Ship a working slice early.'],
    ['Test', 'Put it in front of real use.'], ['Break', 'Find exactly where it fails.'],
    ['Understand', 'Learn why it failed.'], ['Improve', 'Refine until it feels inevitable.'],
    ['Ship', 'Release it, then keep learning.'],
  ],
}

export const capabilitiesContent = {
  section: { number: '04', label: 'Services', heading: ['This is my', 'thing'] },
  cards: [
    ['Creative web development', 'Fast, polished interfaces with motion that earns its place.', ['React', 'GSAP', 'Three.js']],
    ['AI apps and agents', 'Agents, automation and AI features inside real products.', ['Gemini', 'Agents', 'Automation']],
    ['Mobile and full-stack', 'Flutter apps on top of Django and Node back ends.', ['Flutter', 'Django', 'APIs']],
    ['Interaction design', 'Prototyping the feel first, then building it properly.', ['Figma', 'UI/UX', 'Prototyping']],
  ],
  estimator: {
    heading: 'Plan a project with me',
    description: 'Pick a few options and the roadmap on the right updates.',
    groups: { type: 'Project type', motion: 'Motion level', time: 'Timeline' },
    options: {
      type: [['Portfolio or brand site', 'site'], ['Web app', 'web'], ['AI app or agent', 'ai'], ['Mobile app', 'mobile']],
      motion: [['Clean and minimal', 'clean'], ['GSAP interactive', 'gsap'], ['WebGL and 3D', '3d']],
      time: [['Flexible', 'flex'], ['2 to 4 weeks', 'mid'], ['As soon as possible', 'asap']],
    },
    roadmapLabel: 'Suggested roadmap',
    sendLabel: 'Send this brief',
    roadmapSteps: {
      opening: ['Discovery call and a short written brief', 'Structure, content and a clickable prototype'],
      projectType: {
        ai: 'Model and tool selection, then a working agent loop',
        mobile: 'Flutter app shell with an API behind it',
        web: 'Component system and data layer',
        site: 'Visual direction and page build',
      },
      motion: {
        clean: 'Restrained transitions and polish',
        gsap: 'GSAP and scroll choreography',
        '3d': 'Three.js scene and custom shaders',
      },
      closing: 'Testing, performance pass and launch',
    },
  },
}

export const faqContent = {
  section: { number: '05', label: 'FAQ', heading: ['Things you might', 'ask'] },
  items: [
    ['What kind of projects do you take on?', 'Software development, AI projects, creative technology, product work and experimental builds. Freelance and collaborations are welcome.'],
    ['Can you rebuild an existing site?', 'Yes. I like taking something that works and making it feel better: clearer structure, better motion, faster load.'],
    ['What is your stack?', 'Frontend with React, Next.js and TypeScript; Python with Django and FastAPI behind it; Flutter for mobile; GSAP and Three.js for motion and 3D.'],
    ['Can you start yesterday?', 'I checked, and yesterday is fully booked. Send a message and we can start this week.'],
  ],
}

export const physicsContent = {
  section: { number: '06', label: 'Tools I build with', heading: ['Throw them', 'around'] },
  action: 'Shake',
}

export const footerContent = {
  eyebrow: 'Open to interesting projects',
  heading: ["Okay, that's enough", 'website.', "Let's talk."],
  desktopName: 'ASHOK KUMAR',
  mobileName: 'ASHOK',
  note: 'Handmade by a human. Well, digitally.',
  location: 'Kerala, India',
  year: '2026',
}
