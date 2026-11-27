// Fractale vivante de l'accueil : un ensemble de Julia dessiné par la carte graphique (WebGL).
// Clin d'œil au projet Fractals Generator (mêmes palettes : Rouge, Vert, Bleu, Gris).
//
// Économies d'énergie :
// - rien n'est calculé en mode sobre, quand l'onglet est caché ou quand l'accueil est hors écran ;
// - l'image est calculée en résolution réduite (c'est un fond, elle est agrandie par le navigateur).
// Sans WebGL, le canvas reste caché et le décor quadrillé reste affiché.

import { estSobre } from './preferences';

type NomPalette = 'Rouge' | 'Vert' | 'Bleu' | 'Gris';
type Rvb = [number, number, number];

const PALETTES: Record<'dark' | 'light', Record<NomPalette, Rvb>> = {
  dark: { Rouge: [255, 90, 90], Vert: [61, 245, 160], Bleu: [90, 169, 255], Gris: [201, 209, 217] },
  light: { Rouge: [198, 40, 40], Vert: [10, 122, 75], Bleu: [31, 95, 191], Gris: [79, 90, 101] },
};
const ORDRE_PALETTES: NomPalette[] = ['Vert', 'Rouge', 'Bleu', 'Gris'];

/** Paramètre c de départ : une Julia « dendrite » douce (-0,8 + 0,156 i). */
const C_BASE: [number, number] = [-0.8, 0.156];
/** Amplitude des variations de c autour de C_BASE. */
const AMPLITUDE = 0.06;
/** Résolution de calcul (fraction de la taille affichée). */
const ECHELLE = 0.6;

const SOMMETS = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAGMENTS = `
precision highp float;
uniform vec2 u_res;
uniform vec2 u_c;
uniform vec2 u_centre;
uniform float u_zoom;
uniform vec3 u_fond;
uniform vec3 u_couleur;
const int MAX = 140;
void main() {
  vec2 uv = (gl_FragCoord.xy - u_centre) / min(u_res.x, u_res.y);
  vec2 z = uv * u_zoom;
  float n = 0.0;
  for (int i = 0; i < MAX; i++) {
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + u_c;
    if (dot(z, z) > 64.0) break;
    n += 1.0;
  }
  float t = 0.0;
  if (n < float(MAX)) {
    // Coloration continue (sans paliers visibles)
    float lisse = n + 1.0 - log2(log2(dot(z, z)) * 0.5);
    t = clamp(lisse / 40.0, 0.0, 1.0);
    t = pow(t, 0.75);
  }
  gl_FragColor = vec4(mix(u_fond, u_couleur, t * 0.85), 1.0);
}
`;

function compiler(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

function couleurCss(nom: string): Rvb {
  // Lit une variable CSS au format #rrggbb (celles de variables.css).
  const valeur = getComputedStyle(document.documentElement).getPropertyValue(nom).trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(valeur)?.[1] ?? '0d1117';
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rvb;
}

const versGl = (c: Rvb): Rvb => c.map((v) => v / 255) as Rvb;

export function demarrerFractale(racine: HTMLElement): void {
  const canvas = racine.querySelector<HTMLCanvasElement>('[data-fractale-canvas]');
  const boutonFiger = racine.querySelector<HTMLButtonElement>('[data-fractale-figer]');
  const boutonPalette = racine.querySelector<HTMLButtonElement>('[data-fractale-palette]');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', { antialias: false, depth: false, powerPreference: 'low-power' });
  const vs = gl && compiler(gl, gl.VERTEX_SHADER, SOMMETS);
  const fs = gl && compiler(gl, gl.FRAGMENT_SHADER, FRAGMENTS);
  const programme = gl?.createProgram();
  if (!gl || !vs || !fs || !programme) return; // pas de WebGL : on garde le décor quadrillé
  gl.attachShader(programme, vs);
  gl.attachShader(programme, fs);
  gl.linkProgram(programme);
  if (!gl.getProgramParameter(programme, gl.LINK_STATUS)) return;
  gl.useProgram(programme);

  // Un grand triangle qui couvre tout l'écran
  const tampon = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tampon);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(programme, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (nom: string) => gl.getUniformLocation(programme, nom);
  const uRes = u('u_res');
  const uC = u('u_c');
  const uCentre = u('u_centre');
  const uZoom = u('u_zoom');
  const uFond = u('u_fond');
  const uCouleur = u('u_couleur');

  racine.classList.add('fractale--prete');

  let palette: NomPalette = 'Vert';
  let fige = false;
  let visible = true;
  let animation = 0;
  let debut = performance.now();
  // Position visée (souris ou inclinaison), entre -1 et 1 ; null = dérive automatique.
  let cible: [number, number] | null = null;
  const c: [number, number] = [...C_BASE];

  function redimensionner(): void {
    if (!canvas || !gl) return;
    const largeur = Math.max(1, Math.round(canvas.clientWidth * ECHELLE));
    const hauteur = Math.max(1, Math.round(canvas.clientHeight * ECHELLE));
    if (canvas.width !== largeur || canvas.height !== hauteur) {
      canvas.width = largeur;
      canvas.height = hauteur;
      gl.viewport(0, 0, largeur, hauteur);
    }
  }

  function dessiner(): void {
    if (!canvas || !gl) return;
    redimensionner();
    const { width: l, height: h } = canvas;
    const large = l / h > 1.2;
    // Sur grand écran, la fractale est à droite du texte ; sur mobile, en haut à droite.
    gl.uniform2f(uRes, l, h);
    gl.uniform2f(uCentre, large ? l * 0.74 : l * 0.75, large ? h * 0.5 : h * 0.72);
    gl.uniform1f(uZoom, large ? 3.0 : 3.6);
    gl.uniform2f(uC, c[0], c[1]);
    const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
    gl.uniform3fv(uFond, versGl(couleurCss('--fond')));
    gl.uniform3fv(uCouleur, versGl(PALETTES[theme][palette]));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function image(maintenant: number): void {
    animation = 0;
    if (!doitTourner()) return;
    const temps = (maintenant - debut) / 1000;
    // Sans souris : lente promenade circulaire autour de C_BASE.
    const vise = cible ?? [Math.cos(temps * 0.15), Math.sin(temps * 0.21)];
    c[0] += (C_BASE[0] + vise[0] * AMPLITUDE - c[0]) * 0.05;
    c[1] += (C_BASE[1] + vise[1] * AMPLITUDE - c[1]) * 0.05;
    dessiner();
    animation = requestAnimationFrame(image);
  }

  const doitTourner = () => !fige && visible && !document.hidden && !estSobre();

  function relancer(): void {
    if (estSobre()) return;
    if (doitTourner()) {
      if (!animation) animation = requestAnimationFrame(image);
    } else {
      cancelAnimationFrame(animation);
      animation = 0;
      dessiner(); // une image fixe reste affichée
    }
  }

  // ---- Commandes ----
  boutonFiger?.addEventListener('click', () => {
    fige = !fige;
    boutonFiger.setAttribute('aria-pressed', String(fige));
    if (!fige) debut = performance.now();
    relancer();
  });

  boutonPalette?.addEventListener('click', () => {
    palette = ORDRE_PALETTES[(ORDRE_PALETTES.indexOf(palette) + 1) % ORDRE_PALETTES.length];
    const nomVisible = boutonPalette.querySelector('[data-fractale-nom-palette]');
    if (nomVisible) nomVisible.textContent = palette;
    if (!animation) dessiner();
  });

  // ---- Souris et inclinaison ----
  racine.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = racine.getBoundingClientRect();
    cible = [((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1];
  });
  racine.addEventListener('pointerleave', () => (cible = null));
  // Sur téléphone, l'inclinaison est utilisée quand le navigateur la donne sans demander d'autorisation.
  window.addEventListener('deviceorientation', (e) => {
    if (e.beta === null || e.gamma === null) return;
    cible = [Math.max(-1, Math.min(1, e.gamma / 30)), Math.max(-1, Math.min(1, (e.beta - 45) / 30))];
  });

  // ---- Pauses ----
  document.addEventListener('visibilitychange', relancer);
  document.addEventListener('labo:sobre', relancer);
  new IntersectionObserver(([entree]) => {
    visible = entree?.isIntersecting ?? true;
    relancer();
  }).observe(racine);
  new MutationObserver(() => !animation && !estSobre() && dessiner()).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  new ResizeObserver(() => !animation && !estSobre() && dessiner()).observe(canvas);

  relancer();
}
