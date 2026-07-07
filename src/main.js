import * as THREE from 'three';
import { CSS2DRenderer, OrbitControls } from 'three/examples/jsm/Addons.js';
import { Proposition2 } from './models/proposition2';
import { Proposition14 } from './models/proposition14';
import GUI from 'lil-gui';
import { Proposition7 } from './models/proposition7';
import { Proposition9 } from './models/proposition9';
import { Proposition34 } from './models/proposition34';
import { ModelGui } from './core/gui';
import { Proposition2Animated } from './models/proposition2-animated';
import 'katex/dist/katex.min.css';
import { Proposition3 } from './models/proposition3';
import { Proposition4 } from './models/proposition4';
import { Proposition5 } from './models/proposition5';
import { Proposition6 } from './models/proposition6';
import { Proposition8 } from './models/proposition8';
import { Proposition11 } from './models/proposition11';
import { Rising } from './models/rising';
import { Proposition13 } from './models/proposition13';
import { Proposition15 } from './models/proposition15';

const settings = window.settings = {
  darkMode: true,
  model: Proposition2Animated,
};

const models = {
  'Proposition 2': Proposition2,
  'Proposition 2 Breakdown': Proposition2Animated, 
  'Proposition 3': Proposition3,
  'Proposition 4': Proposition4,
  'Proposition 5': Proposition5,
  'Proposition 6': Proposition6,
  'Proposition 7': Proposition7,
  'Proposition 8': Proposition8,
  'Proposition 9': Proposition9,
  'Proposition 11': Proposition11,
  'Proposition 13': Proposition13,
  'Proposition 14': Proposition14,
  'Proposition 15': Proposition15,
  'Proposition 34': Proposition34,
};

settings.model = models[localStorage.getItem('Model') ?? 'Proposition 2'];
settings.darkMode = localStorage.getItem('DarkMode') ?? false;

let model = undefined;

const newGui = new ModelGui();
newGui.setupPageControls(models, localStorage.getItem('Model') ?? 'Proposition 2', (model) => {
  settings.model = model;
  localStorage.setItem('Model', model);
  setModel(models[model]);
}, settings.darkMode, (dark) => {console.log(dark); settings.darkMode = dark; updateRenderingSettings()});

function updateRenderingSettings() {
  localStorage.setItem('DarkMode', settings.darkMode);
  renderer.setClearColor(settings.darkMode ? 0x17131f : 0xfcfaf4);
  document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  model?.update();
}

function setModel(modelClass) {
  model?.dispose();

  newGui.clear();

  model = new modelClass();
  model.setup(newGui);
}

setModel(settings.model);


const perspective_camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const aspect = window.innerWidth / window.innerHeight;
const ortho_size = 3;
const orthographic_camera = new THREE.OrthographicCamera(-ortho_size, ortho_size, ortho_size / aspect, -ortho_size / aspect);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 
renderer.setClearColor(settings.darkMode ? 0x000000 : 0xffffff);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

perspective_camera.position.z = 4;
orthographic_camera.position.z = 4;

const controls = new OrbitControls(orthographic_camera, renderer.domElement);
controls.enablePan = false;

window.addEventListener('resize', () => {
  const aspect = window.innerWidth / window.innerHeight;
  perspective_camera.aspect = aspect;
  perspective_camera.updateProjectionMatrix();

  orthographic_camera.top = ortho_size / aspect;
  orthographic_camera.bottom = -ortho_size / aspect;
  orthographic_camera.updateProjectionMatrix();


  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
})

document.body.appendChild(newGui.domElement);

function animate(time) {
  controls.update();
  controls.rotateSpeed = orthographic_camera.zoom > 1 ? 1/orthographic_camera.zoom : 1;
  model.updatePointSize(orthographic_camera.zoom);
  model.updateRender(time/1000, orthographic_camera);
  renderer.render(model.scene, orthographic_camera);
  labelRenderer.render(model.scene, orthographic_camera);
  if (!model.lazy) model.update();
}

updateRenderingSettings();
renderer.setAnimationLoop(animate);
