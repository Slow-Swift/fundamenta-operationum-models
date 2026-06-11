import * as THREE from 'three';
import { ModelElement } from './geometry_element';

export class SphereElement extends ModelElement {

  static POINT_GEOMETRY = new THREE.SphereGeometry(1, 8, 8);

  constructor(point, { size=0.99, resolution=64, ...args} = {}) {
    super(args);
    this.point = point;
    this.geometry = new THREE.SphereGeometry(size, resolution, resolution);
    this.material = new THREE.MeshBasicMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.point);
  }

  update() {
    super.update();
    this.mesh.position.copy(this.point);
  }
}
