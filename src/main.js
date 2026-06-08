import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Proposition2 } from './models/proposition2';
import { Proposition14 } from './models/proposition14';
import GUI from 'lil-gui';

const settings = {
  darkMode: true,
  model: Proposition2,
};

const models = {
  'Proposition 2': Proposition2,
  'Proposition 14': Proposition14,
};

let model = undefined;

const masterGui = new GUI();
masterGui.add(settings, 'model', models).onChange(model => setModel(model));
const settingsGui = masterGui.addFolder('RenderingSettings');
const parameterGui = masterGui.addFolder('Model Parameters');

settingsGui.title('Rendering Settings');
settingsGui.add(settings, 'darkMode');

function setModel(modelClass) {
  model?.dispose();

  while (parameterGui.children.length > 0) {
    parameterGui.children[0].destroy();
  }

  model = new modelClass();
  model.setupGui(parameterGui);
}
setModel(Proposition2);

const perspective_camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 

perspective_camera.position.z = 5;

const controls = new OrbitControls(perspective_camera, renderer.domElement);
// const model = new Proposition2();
//const model = new Proposition14();
//model.setupGui(parameterGui);

function animate(time) {
  controls.update();
  renderer.setClearColor(settings.darkMode ? 0x000000 : 0xffffff);
  renderer.render(model.scene, perspective_camera);
  model.update();
}

renderer.setAnimationLoop(animate);
