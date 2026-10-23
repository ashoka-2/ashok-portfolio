/**
 * Venom face shader (eyes + jagged teeth, NO tongue).
 * Works on every three.js version: the face is computed at the start of main()
 * and the mask output overwrites gl_FragColor at the very end, so tone mapping
 * and colour-space conversion cannot affect it.
 */

const FACE_GLSL = /* glsl */ `
float symFeat = 0.0;
{
  vec3 fd3 = vLP - uHC;
  float lat = dot(fd3, vec3(-uFw.y, 0.0, uFw.x));
  float fo  = dot(vON, vec3(uFw.x, 0.0, uFw.y));
  float gf  = uFace * uFace * (3.0 - 2.0 * uFace);
  float fmk = smoothstep(0.12, 0.45, fo) * step(0.001, uFace);
  float fl  = lat / uHS;
  float vy  = (vLP.y - uEyeY) / uHS;

  /* eyes: big slanted almonds, sharp at both tips */
  vec2 eq = vec2(abs(fl) - 0.5, vy - 0.04);
  float eca = 0.87, esa = 0.5;
  vec2 er = vec2(eq.x * eca + eq.y * esa, -eq.x * esa + eq.y * eca) / 0.47;
  er.x /= (0.6 + 0.4 * gf);
  float exx = clamp(er.x, -1.0, 1.0);
  float ehh = 0.43 * pow(max(1.0 - pow(abs(exx), 1.7), 0.0), 0.8) * (1.0 + 0.28 * exx);
  float ede = max(abs(er.y) - ehh * gf, abs(er.x) - 1.02);
  float eye = (1.0 - smoothstep(-0.05, 0.07, ede)) * smoothstep(0.0, 0.15, gf);

  /* mouth: huge curved grin */
  float myy = vy + 1.0;
  float cyL = 0.36 * fl * fl - 0.06;
  float mop = 0.07 + 0.27 * gf * (0.3 + 0.7 * uOpen);
  float mo2 = mop * pow(max(1.0 - fl * fl / 1.3, 0.0), 0.55);
  float yU  = cyL + mo2, yL = cyL - mo2;

  /* teeth: two interlocking rows, irregular sizes, fangs */
  float fU = fl * 4.4, fL2 = fl * 4.4 + 0.5;
  float cU = floor(fU), cL = floor(fL2);
  float tU = 1.0 - 2.0 * abs(fract(fU) - 0.5);
  float tL = 1.0 - 2.0 * abs(fract(fL2) - 0.5);
  float hU = fract(sin(cU * 12.9898) * 43758.5453);
  float hL = fract(sin((cL + 7.3) * 12.9898) * 43758.5453);
  float tb  = 0.2 * gf * smoothstep(0.0, 0.3, mo2);
  float fng = exp(-pow((abs(fl) - 0.36) / 0.1, 2.0));
  float lnU = tb * (0.7 + 0.7 * hU) * (1.0 + 1.1 * fng);
  float lnL = tb * (0.6 + 0.6 * hL) * (1.0 + 0.5 * fng);
  float dU  = max((yU - myy) - lnU * tU, myy - yU);
  float dL  = max((myy - yL) - lnL * tL, yL - myy);
  float teeth = max(1.0 - smoothstep(-0.02, 0.025, dU),
                    1.0 - smoothstep(-0.02, 0.025, dL))
              * step(abs(fl), 1.15) * smoothstep(0.1, 0.5, gf);

  symFeat = clamp(eye + teeth, 0.0, 1.0) * fmk * (1.0 + 0.04 * sin(uT * 2.5));
}
`

const MASK_OUT_GLSL = /* glsl */ `
if (uMode > 0.5) gl_FragColor = vec4(symFeat, 0.0, 0.0, step(0.02, diffuseColor.a));
`

export function patchSymbioteMaterial(source, faceFrame) {
  const material = source.clone()
  const uniforms = {
    uFace: { value: 0 },
    uT:    { value: 0 },
    uHC:   { value: faceFrame.center.clone() },
    uFw:   { value: faceFrame.forward.clone() },
    uHS:   { value: faceFrame.headHalf },
    uEyeY: { value: faceFrame.eyeY },
    uMode: { value: 0 },
    uOpen: { value: 0.5 },
  }
  material.userData.symbioteUniforms = uniforms
  material.onBeforeCompile = (shader) => {
    for (const key in uniforms) shader.uniforms[key] = uniforms[key]
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vLP; varying vec3 vON;')
      .replace('#include <beginnormal_vertex>', '#include <beginnormal_vertex>\nvON = objectNormal;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvLP = transformed;')
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>',
        `#include <common>
varying vec3 vLP; varying vec3 vON;
uniform float uFace, uT, uHS, uEyeY, uMode, uOpen;
uniform vec3 uHC; uniform vec2 uFw;`)
      .replace('#include <clipping_planes_fragment>',
        '#include <clipping_planes_fragment>\n' + FACE_GLSL)
      .replace('#include <dithering_fragment>',
        '#include <dithering_fragment>\n' + MASK_OUT_GLSL)
  }
  material.customProgramCacheKey = () => 'venom-face-v4'
  material.needsUpdate = true
  return material
}

export function updateSymbioteMaterials(materials, time, face = 0, open = 0.5) {
  for (const mat of materials) {
    const u = mat.userData.symbioteUniforms
    if (!u) continue
    u.uFace.value = face
    u.uT.value = time
    u.uOpen.value = open
  }
}

export function setSymbioteMode(materials, mode) {
  for (const mat of materials) {
    const u = mat.userData.symbioteUniforms
    if (u) u.uMode.value = mode
  }
}
