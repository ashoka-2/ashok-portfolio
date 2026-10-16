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

export const techStack = sourceTechStack.map((tech) => ({
  ...tech,
  tone: tech.category,
  color: lampColors[tech.id] || defaultLampColor,
  url: techLinks[tech.id] || 'https://developer.mozilla.org/'
}))
