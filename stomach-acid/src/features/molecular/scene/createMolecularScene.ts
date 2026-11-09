import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import type { ReactionState } from "../../chemistry/model/types";

export type SceneAPI = { update: (state: ReactionState) => void; reset: () => void; zoom: (factor: number) => void; rotate: () => void; shell: (visible: boolean) => void; dispose: () => void };


// Owns GPU resources, camera, observers and animation; independent of React.
export function createMolecularScene(
  container: HTMLDivElement,
  initialReaction: ReactionState,
  isPaused: () => boolean,
  onUnavailable: () => void,
): SceneAPI | null {
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch { onUnavailable(); return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-label", "Cena 3D do estômago com partículas. Arraste para girar; use os botões para zoom.");
  renderer.domElement.setAttribute("role", "img");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 6;
  controls.maxDistance = 14;
  controls.minPolarAngle = Math.PI * 0.15;
  controls.maxPolarAngle = Math.PI * 0.85;
  const reset = () => { camera.position.set(1.6, 1.0, 9.8); controls.target.set(0, 0, 0); controls.update(); };
  reset();
  scene.add(new THREE.HemisphereLight(0xffe4d5, 0x30201c, 2.6));
  const key = new THREE.DirectionalLight(0xffffff, 3.5); key.position.set(3, 5, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff9c83, 3); rim.position.set(-4, 1, -2); scene.add(rim);
  const root = new THREE.Group(); scene.add(root);

  // Contorno esquemático com profundidade: não é um modelo anatômico.
  const shape = new THREE.Shape();
  shape.moveTo(-0.95, 2.2); shape.lineTo(-0.95, 1.2);
  shape.bezierCurveTo(-0.95, .55, -.12, .65, .15, 1.2);
  shape.bezierCurveTo(.55, 2.05, 1.75, 1.55, 1.9, .55);
  shape.bezierCurveTo(2.1, -1.0, 1.1, -1.8, -.1, -1.7);
  shape.bezierCurveTo(-.9, -1.7, -1.0, -.95, -1.65, -1.25);
  shape.lineTo(-2.2, -1.5); shape.lineTo(-2.35, -.9);
  shape.bezierCurveTo(-1.6, -.4, -1.25, -.8, -.9, -.9);
  shape.bezierCurveTo(-.1, -1.1, .55, -.45, -.15, -.1);
  shape.bezierCurveTo(-.8, .15, -1.5, .15, -1.5, 1.2);
  shape.lineTo(-1.5, 2.2); shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: .85, bevelEnabled: true, bevelThickness: .24, bevelSize: .13, bevelSegments: 5, steps: 1, curveSegments: 28 });
  geometry.translate(0, 0, -.42);
  const shellMaterial = new THREE.MeshPhysicalMaterial({ color: 0xde9585, transparent: true, opacity: .13, roughness: .22, metalness: .15, side: THREE.DoubleSide, depthWrite: false });
  const shell = new THREE.Mesh(geometry, shellMaterial); root.add(shell);
  const outline = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 38), new THREE.LineBasicMaterial({ color: 0xe6aa99, transparent: true, opacity: .48 }));
  root.add(outline);
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.65, .12, 80), new THREE.MeshStandardMaterial({ color: 0x382321, metalness: .65, roughness: .4 }));
  platform.position.set(0, -2.2, 0); root.add(platform);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(2.52, .018, 8, 96), new THREE.MeshBasicMaterial({ color: 0xe47c69 }));
  halo.rotation.x = Math.PI / 2; halo.position.y = -2.13; root.add(halo);

  const sphereGeometry = new THREE.SphereGeometry(1, 20, 14);
  const acidMaterial = new THREE.MeshStandardMaterial({ color: 0xfb805f, metalness: .2, roughness: .24, emissive: 0x9d2818, emissiveIntensity: .2 });
  const oxygenMaterial = new THREE.MeshStandardMaterial({ color: 0x35bfe4, metalness: .2, roughness: .23 });
  const hydrogenMaterial = new THREE.MeshStandardMaterial({ color: 0xe8f8ff, roughness: .25 });
  const carbonMaterial = new THREE.MeshStandardMaterial({ color: 0x8796ab, roughness: .3 });
  const particles = new THREE.Group(); root.add(particles);
  function atom(parent: THREE.Group, material: THREE.Material, radius: number, x = 0, y = 0) {
    const mesh = new THREE.Mesh(sphereGeometry, material);
    mesh.scale.setScalar(radius); mesh.position.set(x, y, 0); parent.add(mesh);
  }
  const update = (value: ReactionState) => {
    particles.clear();
    const kinds = [...Array(Math.round(value.acid)).fill("acid"), ...Array(Math.round(value.water)).fill("water"), ...Array(Math.round(value.gas)).fill("gas")];
    kinds.forEach((kind, i) => {
      const group = new THREE.Group();
      if (kind === "acid") atom(group, acidMaterial, .14);
      if (kind === "water") { atom(group, oxygenMaterial, .13); atom(group, hydrogenMaterial, .08, -.14, .1); atom(group, hydrogenMaterial, .08, .14, .1); }
      if (kind === "gas") { atom(group, carbonMaterial, .10); atom(group, oxygenMaterial, .10, -.18); atom(group, oxygenMaterial, .10, .18); }
      const index = kind === "gas" ? i - value.acid - value.water : i;
      const x = kind === "gas" ? .25 + index % 3 * .45 : .18 + index % 3 * .48;
      const y = kind === "gas" ? .4 + Math.floor(index / 3) * .32 : -.98 + Math.floor(index / 3) % 4 * .39;
      const z = kind === "gas" ? 0 : (Math.floor(index / 6) % 2 ? -.22 : .3);
      group.position.set(x, y, z);
      group.userData = { x, y, z, seed: i * 1.8 };
      particles.add(group);
    });
  };
  update(initialReaction);
  const commands = {
    update, reset, zoom: (factor: number) => { camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target); controls.update(); },
    rotate: () => { const offset = camera.position.clone().sub(controls.target); offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), .3); camera.position.copy(offset.add(controls.target)); controls.update(); },
    shell: (visible: boolean) => { shell.visible = visible; outline.visible = visible; }
  };
  const resize = () => { const { width, height } = container.getBoundingClientRect(); camera.aspect = width / Math.max(height, 1); camera.updateProjectionMatrix(); renderer.setSize(width, height); };
  const observer = new ResizeObserver(resize); observer.observe(container); resize();
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }); visibility.observe(container);
  let elapsed = 0, previous = performance.now();
  const onLost = (event: Event) => { event.preventDefault(); onUnavailable(); };
  renderer.domElement.addEventListener("webglcontextlost", onLost);
  renderer.setAnimationLoop((now) => {
    const delta = Math.min((now - previous) / 1000, .05); previous = now;
    if (!visible || document.hidden) return;
    if (!isPaused() && !reduced.matches) {
      elapsed += delta;
      particles.children.forEach(particle => {
        const { x, y, z, seed } = particle.userData;
        particle.position.set(x + Math.sin(elapsed * .6 + seed) * .065, y + Math.cos(elapsed * .8 + seed) * .065, z + Math.sin(elapsed * .5 + seed) * .08);
        particle.rotation.y = elapsed * .18 + seed;
      });
    }
    renderer.render(scene, camera);
  });
  const dispose = () => {
    renderer.setAnimationLoop(null); observer.disconnect(); visibility.disconnect(); controls.dispose();
    renderer.domElement.removeEventListener("webglcontextlost", onLost);
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
    scene.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) { geometries.add(object.geometry); (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material)); } });
    geometries.add(sphereGeometry);[acidMaterial, oxygenMaterial, hydrogenMaterial, carbonMaterial].forEach(material => materials.add(material));
    geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); renderer.dispose(); renderer.domElement.remove();
  };
  return { ...commands, dispose };
}
