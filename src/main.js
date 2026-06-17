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

const settings = window.settings = {
  darkMode: true,
  model: Proposition2Animated,
};

const models = {
  'Proposition 2': Proposition2,
  'Proposition 2 Breakdown': Proposition2Animated, 
  'Proposition 7': Proposition7,
  'Proposition 9': Proposition9,
  'Proposition 14': Proposition14,
  'Proposition 34': Proposition34,
};

settings.model = models[localStorage.getItem('Model', 'Proposition 2')];

let model = undefined;

const newGui = new ModelGui();
const masterGui = new GUI();
masterGui.add(settings, 'model', models).onChange(model => {
  setModel(model);
  for (const modelName in models) {
    if (models[modelName] == model) {
      localStorage.setItem('Model', modelName);
      console.log("Selected", modelName);
    }
  }
});
const settingsGui = masterGui.addFolder('RenderingSettings');

function updateRenderingSettings() {
  renderer.setClearColor(settings.darkMode ? 0x17131f : 0xfcfaf4);
  document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  model?.update();
}

settingsGui.title('Rendering Settings');
settingsGui.add(settings, 'darkMode').onChange(updateRenderingSettings);

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
  model.updatePointSize(orthographic_camera.zoom);
  model.updateAnimations(time/1000);
  renderer.render(model.scene, orthographic_camera);
  labelRenderer.render(model.scene, orthographic_camera);
  if (!model.lazy) model.update();
}

updateRenderingSettings();
renderer.setAnimationLoop(animate);
