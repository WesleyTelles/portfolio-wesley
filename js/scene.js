/* Floating 3D code glyphs (Three.js): extruded text with a procedural matcap. They sway in front of the camera and,
   as the page is scrolled, fly outward and toward the viewer until they leave the screen (as in the reference). */
import * as THREE from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const FONT_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json';

function matcap() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const x = c.getContext('2d');
  const base = x.createRadialGradient(98, 88, 8, 128, 128, 132);
  base.addColorStop(0, '#9a9a9a'); base.addColorStop(.3, '#4a4a4a'); base.addColorStop(.7, '#181818'); base.addColorStop(1, '#060606');
  x.fillStyle = base; x.fillRect(0, 0, 256, 256);
  const rim = x.createRadialGradient(128, 128, 92, 128, 128, 130);
  rim.addColorStop(0, 'rgba(255,255,255,0)'); rim.addColorStop(1, 'rgba(255,255,255,.14)');
  x.fillStyle = rim; x.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* slots: x, y (-1..1 of half-width / half-height), scale, sway speed, fly depth factor, fly spin */
const SLOTS = [
  [-.62, .42, 1.15, .22, 1.0, 1.6], [.16, .1, 1.0, .3, .7, -1.2], [-.2, -.55, .95, .26, 1.2, 1.4],
  [.66, .5, 1.05, .2, .85, -1.5], [.6, -.5, 1.1, .28, 1.1, 1.3], [-.86, -.1, .8, .24, .75, -1.1]
];
const SETS = {
  home: ['{', '/', '#', '}', '>', '<'],
  about: ['<', '~', ']', '!', '{', '>']
};

export async function mountScene(canvas, scroller, set = 'home') {
  if (!canvas) return null;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 100);
  camera.position.z = 14;

  const font = await new FontLoader().loadAsync(FONT_URL);
  const tex = matcap();
  const mat = new THREE.MeshMatcapMaterial({ matcap: tex });
  const group = new THREE.Group();
  scene.add(group);
  const glyphs = SETS[set] || SETS.home;
  const items = SLOTS.map(([px, py, sc, spin, zf, fs], i) => {
    const geo = new TextGeometry(glyphs[i % glyphs.length], { font, size: 1.7, height: .6, curveSegments: 8, bevelEnabled: true, bevelThickness: .07, bevelSize: .05, bevelSegments: 3 });
    geo.center();
    const m = new THREE.Mesh(geo, mat);
    group.add(m);
    return { m, px, py, sc, spin, zf, fs, phase: i * 1.7 };
  });

  let aspect = 1, visH = 8, visW = 8;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height);
    renderer.setSize(w, h, false);
    aspect = w / h; camera.aspect = aspect; camera.updateProjectionMatrix();
    visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z; visW = visH * aspect;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = e => { mouse.tx = e.clientX / innerWidth * 2 - 1; mouse.ty = e.clientY / innerHeight * 2 - 1; };
  addEventListener('pointermove', onMove, { passive: true });

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf = 0, alive = true;
  const t0 = performance.now();
  let fly = 0;   /* smoothed fly-out progress 0..1 */
  const frame = now => {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    const t = (now - t0) / 1000;
    mouse.x += (mouse.tx - mouse.x) * .05; mouse.y += (mouse.ty - mouse.y) * .05;
    const target = Math.min(1, scroller.scrollTop / Math.max(1, scroller.clientHeight * 1.15));
    fly += (target - fly) * .12;
    const e = Math.pow(fly, 1.25);
    const narrow = aspect < 1;
    group.visible = fly < .985;
    if (!group.visible) { renderer.render(scene, camera); return; }
    const f = reduce ? 0 : 1;
    items.forEach(it => {
      const x = it.px * visW * (narrow ? .42 : .46) * (1 + e * 1.7);
      const y = it.py * visH * .4 * (1 + e * 1.5) + Math.sin(t * .6 + it.phase) * .35 * f;
      const z = e * 17.5 * it.zf;                       /* toward the camera (at z = 14): the glyph swells and passes the viewer */
      it.m.position.set(x + mouse.x * .5 * (it.px > 0 ? 1 : -1), y - mouse.y * .3, z);
      it.m.rotation.x = Math.sin(t * it.spin * 1.6 + it.phase) * .45 * f + mouse.y * .35 + e * it.fs * .9;
      it.m.rotation.y = Math.sin(t * it.spin * 1.3 + it.phase * 1.3) * .6 * f + mouse.x * .5 + e * it.fs * 1.6;
      it.m.rotation.z = Math.sin(t * it.spin + it.phase * .7) * .12 * f + e * it.fs * .5;
      it.m.scale.setScalar(it.sc * (narrow ? 1.1 : .82));
    });
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      alive = false; cancelAnimationFrame(raf); ro.disconnect();
      removeEventListener('pointermove', onMove);
      items.forEach(it => it.m.geometry.dispose());
      mat.dispose(); tex.dispose(); renderer.dispose();
    }
  };
}
