const sourceTechStack = [
  // Frontend
  { id: "react", label: "React", short: "React", icon: "logos:react", category: "frontend" },
  { id: "javascript", label: "JavaScript", short: "JS", icon: "logos:javascript", category: "frontend" },
  { id: "typescript", label: "TypeScript", short: "TS", icon: "logos:typescript-icon", category: "frontend" },
  { id: "nextjs", label: "Next.js", short: "Next", icon: "logos:nextjs-icon", category: "frontend" },
  { id: "tailwindcss", label: "Tailwind CSS", short: "TW", icon: "logos:tailwindcss-icon", category: "frontend" },
  { id: "vite", label: "Vite", short: "Vite", icon: "logos:vitejs", category: "frontend" },
  { id: "redux", label: "Redux Toolkit", short: "Redux", icon: "logos:redux", category: "frontend" },
  { id: "flutter", label: "Flutter", short: "Flutter", icon: "logos:flutter", category: "frontend" },
  { id: "html5", label: "HTML5", short: "HTML", icon: "logos:html-5", category: "frontend" },
  { id: "css3", label: "CSS3", short: "CSS", icon: "logos:css-3", category: "frontend" },
  { id: "sass", label: "Sass / SCSS", short: "SCSS", icon: "logos:sass", category: "frontend" },

  // Backend
  { id: "python", label: "Python", short: "Py", icon: "logos:python", category: "backend" },
  { id: "django", label: "Django", short: "Django", icon: "logos:django-icon", category: "backend" },
  { id: "fastapi", label: "FastAPI", short: "FastAPI", icon: "logos:fastapi-icon", category: "backend" },
  { id: "nodejs", label: "Node.js", short: "Node", icon: "logos:nodejs-icon", category: "backend" },
  { id: "express", label: "Express.js", short: "Express", icon: "simple-icons:express", category: "backend" },
  { id: "websocket", label: "WebSockets", short: "WS", icon: "logos:websocket", category: "backend" },
  { id: "socketio", label: "Socket.io", short: "Socket", icon: "logos:socket-io", category: "backend" },

  // Creative & Motion
  { id: "threejs", label: "Three.js", short: "Three", icon: "logos:threejs", category: "creative" },
  { id: "gsap", label: "GSAP", short: "GSAP", icon: "logos:greensock-icon", category: "creative" },
  { id: "framermotion", label: "Framer Motion", short: "Framer", icon: "logos:framer", category: "creative" },
  { id: "webgl", label: "WebGL", short: "WebGL", icon: "logos:webgl", category: "creative" },

  // AI & Machine Learning
  { id: "gemini", label: "Google Gemini", short: "Gemini", icon: "logos:google-gemini", category: "ai" },
  { id: "openai", label: "OpenAI", short: "OpenAI", icon: "logos:openai-icon", category: "ai" },
  { id: "claude", label: "Anthropic Claude", short: "Claude", icon: "logos:claude-icon", category: "ai" },
  { id: "langchain", label: "LangChain", short: "LangChain", icon: "logos:langchain-icon", category: "ai" },

  // DevOps & Cloud
  { id: "docker", label: "Docker", short: "Docker", icon: "logos:docker-icon", category: "devops" },
  { id: "kubernetes", label: "Kubernetes", short: "K8s", icon: "logos:kubernetes", category: "devops" },
  { id: "render", label: "Render", short: "Render", icon: "simple-icons:render", category: "devops" },
  { id: "railway", label: "Railway", short: "Railway", icon: "simple-icons:railway", category: "devops" },
  { id: "netlify", label: "Netlify", short: "Netlify", icon: "simple-icons:netlify", category: "devops" },
  { id: "aws", label: "AWS", short: "AWS", icon: "logos:aws", category: "devops" },
  { id: "firebase", label: "Firebase", short: "Firebase", icon: "logos:firebase", category: "devops" },
  { id: "vercel", label: "Vercel", short: "Vercel", icon: "logos:vercel-icon", category: "devops" },
  { id: "git", label: "Git", short: "Git", icon: "logos:git-icon", category: "devops" },
  { id: "github", label: "GitHub", short: "GitHub", icon: "logos:github-icon", category: "devops" },

  // Databases
  { id: "mongodb", label: "MongoDB", short: "Mongo", icon: "logos:mongodb-icon", category: "databases" },
  { id: "mysql", label: "MySQL", short: "MySQL", icon: "logos:mysql", category: "databases" },
  { id: "sqlite", label: "SQLite", short: "SQLite", icon: "logos:sqlite", category: "databases" },
  { id: "postgresql", label: "PostgreSQL", short: "Postgres", icon: "logos:postgresql", category: "databases" },

  // Design
  { id: "figma", label: "Figma", short: "Figma", icon: "logos:figma", category: "design" }
];

const techLinks = {
  react: 'https://react.dev/', javascript: 'https://developer.mozilla.org/docs/Web/JavaScript', typescript: 'https://www.typescriptlang.org/docs/', nextjs: 'https://nextjs.org/docs', tailwindcss: 'https://tailwindcss.com/docs', vite: 'https://vite.dev/', redux: 'https://redux-toolkit.js.org/', flutter: 'https://docs.flutter.dev/', html5: 'https://developer.mozilla.org/docs/Web/HTML', css3: 'https://developer.mozilla.org/docs/Web/CSS', sass: 'https://sass-lang.com/documentation/',
  python: 'https://docs.python.org/3/', django: 'https://docs.djangoproject.com/', fastapi: 'https://fastapi.tiangolo.com/', nodejs: 'https://nodejs.org/docs/latest/api/', express: 'https://expressjs.com/', websocket: 'https://developer.mozilla.org/docs/Web/API/WebSockets_API', socketio: 'https://socket.io/docs/v4/',
  threejs: 'https://threejs.org/docs/', gsap: 'https://gsap.com/docs/v3/', framermotion: 'https://motion.dev/docs', webgl: 'https://developer.mozilla.org/docs/Web/API/WebGL_API',
  gemini: 'https://ai.google.dev/gemini-api/docs', openai: 'https://platform.openai.com/docs/', claude: 'https://docs.anthropic.com/', langchain: 'https://docs.langchain.com/',
  docker: 'https://docs.docker.com/', kubernetes: 'https://kubernetes.io/docs/', render: 'https://render.com/docs', railway: 'https://docs.railway.com/', netlify: 'https://docs.netlify.com/', aws: 'https://docs.aws.amazon.com/', firebase: 'https://firebase.google.com/docs', vercel: 'https://vercel.com/docs', git: 'https://git-scm.com/doc', github: 'https://docs.github.com/',
  mongodb: 'https://www.mongodb.com/docs/', mysql: 'https://dev.mysql.com/doc/', sqlite: 'https://www.sqlite.org/docs.html', postgresql: 'https://www.postgresql.org/docs/', figma: 'https://help.figma.com/'
}

const lampColors = {
  react: '#61DAFB', javascript: '#F7DF1E', typescript: '#3178C6', nextjs: '#D5D9DF', tailwindcss: '#38BDF8', vite: '#646CFF', redux: '#764ABC', flutter: '#54C5F8', html5: '#E34F26', css3: '#1572B6', sass: '#CF649A',
  python: '#FFD43B', django: '#44B78B', fastapi: '#009688', nodejs: '#68A063', express: '#D5D9DF', websocket: '#47A8D8', socketio: '#EDEDED',
  threejs: '#EDEDED', gsap: '#88CE02', framermotion: '#8E74FF', webgl: '#E34F26', gemini: '#648AF5', openai: '#10A37F', claude: '#D97706', langchain: '#22A67A',
  docker: '#2496ED', kubernetes: '#326CE5', render: '#46E3B7', railway: '#EDEDED', netlify: '#00C7B7', aws: '#FF9900', firebase: '#FFCA28', vercel: '#EDEDED', git: '#F05032', github: '#EDEDED',
  mongodb: '#47A248', mysql: '#4479A1', sqlite: '#44A8DC', postgresql: '#336791', figma: '#F24E1E',
}
const defaultLampColor = '#62A8E8'

// Page copy lives beside the technology list so each toolbox page can be edited here.
const techDetails = {
  react: { purpose: 'A component library for building interactive user interfaces from reusable pieces.', practice: 'I use React to compose pages from focused components and keep interactive state close to the UI that needs it.', headline: 'Interfaces, built in pieces.' },
  javascript: { purpose: 'The programming language that powers interaction and application logic in the browser and on servers.', practice: 'I use JavaScript to connect user actions to meaningful responses, work with APIs, and bring interface ideas to life.', headline: 'The logic behind the interaction.' },
  typescript: { purpose: 'JavaScript with a type system that helps describe data and catch mistakes while developing.', practice: 'I use TypeScript to make component props, API responses, and shared data easier to understand as a project grows.', headline: 'Clarity as projects grow.' },
  nextjs: { purpose: 'A React framework for building full stack web applications with routing, rendering, and server features.', practice: 'I reach for Next.js when a project benefits from file based routes, server rendering, and a clear path from UI to deployment.', headline: 'React with a full stack toolkit.' },
  tailwindcss: { purpose: 'A utility first CSS framework for composing responsive designs directly in markup.', practice: 'I use Tailwind to iterate quickly on spacing, layout, and responsive states while keeping the visual system consistent.', headline: 'Fast, consistent styling.' },
  vite: { purpose: 'A frontend build tool and development server designed for a quick feedback loop.', practice: 'Vite keeps local development quick and produces optimized bundles when a project is ready to ship.', headline: 'A quicker build loop.' },
  redux: { purpose: 'A predictable state management toolkit for shared application data and complex UI state.', practice: 'I use Redux Toolkit when state needs to be shared across distant parts of an app, with updates that stay easy to trace.', headline: 'Shared state, kept predictable.' },
  flutter: { purpose: 'A UI toolkit for building applications for mobile, web, and desktop from one codebase.', practice: 'Flutter lets me build expressive cross platform interfaces with a consistent widget system and rendering model.', headline: 'One UI toolkit, many screens.' },
  html5: { purpose: 'The markup language that gives web pages their structure and meaning.', practice: 'I use semantic HTML to give content a clear structure, improve accessibility, and provide a solid base for styling.', headline: 'Meaningful structure for the web.' },
  css3: { purpose: 'The language used to style and lay out web content, including responsive and animated interfaces.', practice: 'I use CSS for layout, visual hierarchy, responsive behavior, and the small interaction details that make a page feel finished.', headline: 'The visual language of a page.' },
  sass: { purpose: 'A CSS extension that adds tools such as variables, nesting, and reusable mixins.', practice: 'Sass helps organize larger style sheets into reusable tokens and patterns without giving up the flexibility of CSS.', headline: 'More structure for stylesheets.' },
  python: { purpose: 'A general purpose programming language used for applications, automation, data work, and AI.', practice: 'I use Python for backend logic, scripting, and experiments where readable code and a broad ecosystem help me move quickly.', headline: 'Readable code, broad possibilities.' },
  django: { purpose: 'A Python web framework with built in tools for routing, data models, authentication, and administration.', practice: 'Django is useful when I need a structured backend with common web application features already working together.', headline: 'A complete foundation for web apps.' },
  fastapi: { purpose: 'A modern Python framework for creating APIs with type driven validation and automatic documentation.', practice: 'I use FastAPI to expose Python services through clean API endpoints and validate request and response data.', headline: 'Python APIs with clear contracts.' },
  nodejs: { purpose: 'A JavaScript runtime that lets developers run JavaScript outside the browser.', practice: 'Node.js lets me use JavaScript for server code, scripts, and tooling alongside frontend applications.', headline: 'JavaScript beyond the browser.' },
  express: { purpose: 'A lightweight Node.js framework for routing requests and building web servers and APIs.', practice: 'I use Express to define API routes and middleware without adding unnecessary structure to a small or focused service.', headline: 'A lean layer for web servers.' },
  websocket: { purpose: 'A browser and server protocol for continuous, two way communication over one connection.', practice: 'WebSockets fit features that need live updates, such as chat, collaborative tools, and changing dashboards.', headline: 'Live communication, both ways.' },
  socketio: { purpose: 'A real time communication library with event based messaging and fallback transports.', practice: 'I use Socket.IO to send and receive live events between clients and a server with useful connection and reconnection handling.', headline: 'Real time features with events.' },
  threejs: { purpose: 'A JavaScript library that makes it easier to create and display 3D scenes in the browser with WebGL.', practice: 'Three.js is how I can add depth, lighting, and interactive 3D objects to a web experience.', headline: 'A third dimension for the web.' },
  gsap: { purpose: 'An animation platform for precise, performant motion across HTML, SVG, and JavaScript driven interfaces.', practice: 'I use GSAP timelines and ScrollTrigger to choreograph entrances, scroll reveals, parallax, and coordinated UI motion.', headline: 'Motion with timing and intent.' },
  framermotion: { purpose: 'A React animation library for declarative transitions and gesture driven interactions.', practice: 'Framer Motion is handy for animating React component states and adding gestures with a direct connection to UI behavior.', headline: 'React interfaces in motion.' },
  webgl: { purpose: 'A browser API for rendering interactive 2D and 3D graphics using the device GPU.', practice: 'WebGL makes high performance custom graphics and visual experiments possible directly in a web page.', headline: 'GPU powered graphics in the browser.' },
  gemini: { purpose: 'Google’s family of generative AI models for working with text, images, code, and other inputs.', practice: 'I explore Gemini for multimodal prompts and AI features that can understand more than plain text.', headline: 'Multimodal AI experiments.' },
  openai: { purpose: 'AI models and APIs for language, reasoning, image, audio, and tool using applications.', practice: 'I use OpenAI APIs to prototype assistants and add language or multimodal capabilities to software experiences.', headline: 'AI capabilities inside products.' },
  claude: { purpose: 'Anthropic’s AI assistant and model family for writing, analysis, coding, and tool use.', practice: 'Claude is useful in my AI explorations for long form reasoning, code assistance, and document focused workflows.', headline: 'A thoughtful partner for complex tasks.' },
  langchain: { purpose: 'A framework for connecting language models with tools, data sources, and multi step workflows.', practice: 'I use LangChain to connect model calls with retrieval or tools when an AI feature needs more than a single prompt.', headline: 'Connecting models to useful context.' },
  docker: { purpose: 'A platform for packaging software and its dependencies into portable containers.', practice: 'Docker helps me keep development and deployment environments reproducible across machines and services.', headline: 'The same app in every environment.' },
  kubernetes: { purpose: 'A system for deploying, scaling, and managing containerized applications across a cluster.', practice: 'Kubernetes is the orchestration layer for keeping container based services available and scaling them as needed.', headline: 'Coordinating containers at scale.' },
  render: { purpose: 'A cloud platform for deploying web services, static sites, databases, and scheduled jobs.', practice: 'Render offers a straightforward path from a repository to a running service with managed infrastructure around it.', headline: 'From repository to running service.' },
  railway: { purpose: 'A deployment platform for running applications and backing services from a project workspace.', practice: 'I use Railway to connect an app with the services it depends on and get an environment running with minimal setup.', headline: 'App and services, together.' },
  netlify: { purpose: 'A platform for building and deploying web projects with hosting, previews, and serverless features.', practice: 'Netlify makes it easy to publish frontend work and review changes through deploy previews before they go live.', headline: 'A smooth path to the web.' },
  aws: { purpose: 'Amazon’s cloud platform, with services for compute, storage, databases, networking, and more.', practice: 'AWS provides building blocks for hosting applications and storing data when a project needs flexible cloud infrastructure.', headline: 'Cloud building blocks.' },
  firebase: { purpose: 'Google’s application platform with services for authentication, data, hosting, and analytics.', practice: 'Firebase helps prototypes and apps move quickly with managed authentication, realtime data, and hosting in one ecosystem.', headline: 'Useful app services, ready to connect.' },
  vercel: { purpose: 'A deployment platform focused on frontend frameworks, previews, and edge delivery.', practice: 'Vercel gives frontend projects quick deployments and shareable previews, with framework aware build defaults.', headline: 'Frontend work, shipped quickly.' },
  git: { purpose: 'A distributed version control system for tracking changes and collaborating on code.', practice: 'Git gives me a reliable history of project changes and a safe way to experiment with branches before combining work.', headline: 'A history for every change.' },
  github: { purpose: 'A platform for hosting Git repositories and collaborating through reviews, issues, and automation.', practice: 'I use GitHub to keep code organized, track tasks, review changes, and connect repositories to deployment workflows.', headline: 'Code, collaboration, and delivery.' },
  mongodb: { purpose: 'A document database that stores flexible records in a JSON like format.', practice: 'MongoDB is useful when application data naturally fits documents and needs a schema that can evolve with the product.', headline: 'Flexible data shaped like the app.' },
  mysql: { purpose: 'A relational database for storing structured data and querying it with SQL.', practice: 'I use MySQL when data relationships and reliable SQL queries are central to an application.', headline: 'Structured data with SQL.' },
  sqlite: { purpose: 'A small, serverless relational database stored in a single local file.', practice: 'SQLite is a great fit for lightweight apps, local storage, and projects that need relational data without a separate database server.', headline: 'A database without the server.' },
  postgresql: { purpose: 'An open source relational database known for strong SQL support and extensibility.', practice: 'PostgreSQL handles structured application data with robust constraints, expressive queries, and room to grow.', headline: 'A dependable home for application data.' },
  figma: { purpose: 'A collaborative design tool for interface design, prototyping, and shared design systems.', practice: 'I use Figma to explore layouts, test interaction ideas, and keep implementation aligned with a visual reference.', headline: 'From interface idea to prototype.' },
}

export const techStack = sourceTechStack.map((tech) => ({
  ...tech,
  tone: tech.category,
  color: lampColors[tech.id] || defaultLampColor,
  url: techLinks[tech.id] || 'https://developer.mozilla.org/',
  ...(techDetails[tech.id] || {}),
}))
