const initialState = () => ({
  /* Pointer in hero-local CSS coordinates */
  pointerX: -1000,
  pointerY: -1000,
  smoothX: -1000,
  smoothY: -1000,
  velocityX: 0,
  velocityY: 0,
  pointerInside: false,
  pointerDown: false,

  /* State machine & progress */
  phase: 'idle',
  proximity: 0,
  infection: 0,
  face: 0,
  open: 0.5,
  roar: 0,
  pillScale: 1,
  blueButton: 0,

  /* Character 3D motion & interaction */
  lean: 0,
  dragActive: false,
  dragMoved: 0,
  yawUser: 0,
  pitchUser: 0,
  yawVel: 0,

  /* 2D projected geometry in hero-local CSS coordinates */
  chestX: 0,
  chestY: 0,
  modelBounds: new Float32Array(4), // [minX, minY, maxX, maxY]

  /* Legacy contacts (kept for compatibility) */
  contacts: new Float32Array(36),
  contactCount: 0,

  /* Mask 2D canvas — written by HeroModelCanvas (uMode=1 pass), read by overlay */
  maskCanvas: null,
  maskDirty: false,
})

export const symbioteStore = {
  state: initialState(),
  listeners: new Set(),
  subscribe(fn) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  },
  emit(event, data) {
    this.listeners.forEach((fn) => fn(event, data))
  },
  triggerRoar() {
    this.emit('roar')
  },
  reset() {
    const mc = this.state.maskCanvas
    Object.assign(this.state, initialState())
    this.state.maskCanvas = mc
  },
}

