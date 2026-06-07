import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Proposition2 } from './models/proposition2';
import { Proposition14 } from './models/proposition14';

const perspective_camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); 

perspective_camera.position.z = 5;

const controls = new OrbitControls(perspective_camera, renderer.domElement);
const model = new Proposition14(); // new Proposition2();

function animate(time) {
  controls.update();
  renderer.render(model.scene, perspective_camera);
  model.Update();
}

renderer.setAnimationLoop(animate);
