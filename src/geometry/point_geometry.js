import * as THREE from 'three';
import { ModelElement } from './geometry_element';

export class PointGeom extends ModelElement {

  static POINT_GEOMETRY = new THREE.SphereGeometry(1, 8, 8);

  constructor(point, { scale=0.05, distance=1, ...args} = {}) {
    super(args);
    this.point = point;
    this.distance = distance;
    this.material = new THREE.MeshBasicMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(PointGeom.POINT_GEOMETRY, this.material);
    this.mesh.position.copy(this.point);
    this.mesh.scale.setScalar(scale);
    this.mesh.visible = this.visible;
  }

  update() {
    super.update();
    this.mesh.position.copy(this.point);
  }
}
