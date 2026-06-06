import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Proposition2 } from './models/proposition2';

const camera = new THREE.PerspectiveCamera(
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

camera.position.z = 5;

const controls = new OrbitControls(camera, renderer.domElement);
const model = new Proposition2();

function animate(time) {
  controls.update();
  model.Update();
  renderer.render(model.scene, camera);
}

renderer.setAnimationLoop(animate);
