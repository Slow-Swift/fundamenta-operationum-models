import { OrbitControls } from "three/examples/jsm/Addons.js";

export function createControls(camera, renderer) {
  return new OrbitControls(camera, renderer.domEleement);
}
