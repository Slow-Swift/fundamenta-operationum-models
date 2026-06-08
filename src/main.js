import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer, OrbitControls } from 'three/examples/jsm/Addons.js';
import { Proposition2 } from './models/proposition2';
import { Proposition14 } from './models/proposition14';
import GUI from 'lil-gui';

const settings = {
  darkMode: false,
  model: Proposition2,
};

const models = {
  'Proposition 2': Proposition2,
  'Proposition 14': Proposition14,
};

let model = undefined;

const masterGui = new GUI();
masterGui.add(settings, 'model', models).onChange(model => setModel(model));
const parameterGui = masterGui.addFolder('Model Parameters');
const settingsGui = masterGui.addFolder('RenderingSettings');

settingsGui.title('Rendering Settings');
settingsGui.add(settings, 'darkMode').onChange(dark => {
  renderer.setClearColor(dark ? 0x000000 : 0xffffff);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
});
document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light'); 

function setModel(modelClass) {
  model?.dispose();

  // Clear the parameter GUI
  while (parameterGui.children.length > 0) {
    parameterGui.children[0].destroy();
  }

  model = new modelClass();
  model.setup(parameterGui);
}

setModel(Proposition2);

const perspective_camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

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

const controls = new OrbitControls(perspective_camera, renderer.domElement);

window.addEventListener('resize', () => {
  perspective_camera.aspect = window.innerWidth / window.innerHeight;
  perspective_camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
})

function animate(time) {
  controls.update();
  renderer.render(model.scene, perspective_camera);
  labelRenderer.render(model.scene, perspective_camera);
  if (!model.lazy) model.update();
}

renderer.setAnimationLoop(animate);
