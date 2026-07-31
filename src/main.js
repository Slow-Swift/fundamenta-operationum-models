import * as THREE from 'three';
import { CSS2DRenderer, OrbitControls } from 'three/examples/jsm/Addons.js';
import { Proposition2 } from './models/proposition2';
import { Proposition14 } from './models/proposition14';
import { Proposition7 } from './models/proposition7';
import { Proposition9 } from './models/proposition9';
import { Proposition34 } from './models/proposition34';
import { ModelGui } from './core/gui';
import { Proposition2Animated } from './models/proposition2-animated';
import { Proposition3 } from './models/proposition3';
import { Proposition4 } from './models/proposition4';
import { Proposition5 } from './models/proposition5';
import { Proposition6 } from './models/proposition6';
import { Proposition8 } from './models/proposition8';
import { Proposition11 } from './models/proposition11';
import { Proposition13 } from './models/proposition13';
import { Proposition15 } from './models/proposition15';
import { Proposition16 } from './models/proposition16';
import { Proposition17 } from './models/proposition17';
import { Proposition17Equator } from './models/proposition17_equator';
import { Proposition18 } from './models/proposition18';
import 'katex/dist/katex.min.css';
import { Proposition18WithEquator } from './models/proposition18_with_equator';
import { Proposition19 } from './models/proposition19';
import { Proposition20 } from './models/proposition20';
import { Proposition21 } from './models/proposition21';
import { Proposition22 } from './models/proposition22';
import { Proposition23 } from './models/proposition23';
import { Proposition24 } from './models/proposition24';
import { Proposition25 } from './models/proposition25';
import { Proposition26 } from './models/proposition26';
import { Proposition27 } from './models/proposition27';
import { Proposition28 } from './models/proposition28';
import { Proposition29 } from './models/proposition29';
import { Proposition31 } from './models/proposition31';
import { Proposition32 } from './models/proposition32';
import { Playground } from './models/playground';
import { Proposition33 } from './models/proposition33';
import { Proposition34Extra } from './models/proposition34Extra';
import { Proposition35 } from './models/proposition35';
import { Proposition36 } from './models/proposition36';
import { Proposition37 } from './models/proposition37';
import { Proposition38 } from './models/proposition38';
import { Proposition39 } from './models/proposition39';
import { Proposition40 } from './models/proposition40';
import { Proposition42 } from './models/proposition42';
import { Proposition43 } from './models/proposition43';
import { Proposition44 } from './models/proposition44';
import { Proposition45 } from './models/proposition45';
import { Proposition46 } from './models/proposition46';
import { Proposition47 } from './models/proposition47';
import { Proposition48 } from './models/proposition48';
import { Proposition49 } from './models/proposition49';
import { Proposition50 } from './models/proposition50';
import { Proposition51_Case1 } from './models/proposition51_case_1';
import { Proposition51_Case2 } from './models/proposition51_case_2';
import { Proposition52 } from './models/proposition52';
import { Proposition53 } from './models/proposition53';
import { Proposition54 } from './models/proposition54';
import { Proposition56 } from './models/proposition56';
import { Proposition57 } from './models/proposition57';
import { Proposition58 } from './models/proposition58';
import { Proposition55_Case1 } from './models/proposition55_case1';
import { Proposition55_Case2 } from './models/proposition55_case2';

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
  'Proposition 16': Proposition16,
  'Proposition 17': Proposition17,
  'Proposition 17 with Equator': Proposition17Equator,
  'Proposition 18': Proposition18,
  'Proposition 18 with Equator': Proposition18WithEquator,
  'Proposition 19': Proposition19,
  'Proposition 20': Proposition20,
  'Proposition 21': Proposition21,
  'Proposition 22': Proposition22,
  'Proposition 23': Proposition23,
  'Proposition 24': Proposition24,
  'Proposition 25': Proposition25,
  'Proposition 26': Proposition26,
  'Proposition 27': Proposition27,
  'Proposition 28': Proposition28,
  'Proposition 29': Proposition29,
  'Proposition 31': Proposition31,
  'Proposition 32': Proposition32,
  'Proposition 33': Proposition33,
  'Proposition 34': Proposition34,
  'Proposition 34 Extra': Proposition34Extra,
  'Proposition 35': Proposition35,
  'Proposition 36': Proposition36,
  'Proposition 37': Proposition37,
  'Proposition 38': Proposition38,
  'Proposition 39': Proposition39,
  'Proposition 40': Proposition40,
  'Proposition 42': Proposition42,
  'Proposition 43': Proposition43,
  'Proposition 44': Proposition44,
  'Proposition 45': Proposition45,
  'Proposition 46': Proposition46,
  'Proposition 47': Proposition47,
  'Proposition 48': Proposition48,
  'Proposition 49': Proposition49,
  'Proposition 50': Proposition50,
  'Proposition 51 Case 1': Proposition51_Case1,
  'Proposition 51 Case 2': Proposition51_Case2,
  'Proposition 52': Proposition52,
  'Proposition 53': Proposition53,
  'Proposition 54': Proposition54,
  'Proposition 55 Version 1': Proposition55_Case1,
  'Proposition 55 Version 2': Proposition55_Case2,
  'Proposition 56': Proposition56,
  'Proposition 57': Proposition57,
  'Proposition 58': Proposition58,
  'Playground': Playground,
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
