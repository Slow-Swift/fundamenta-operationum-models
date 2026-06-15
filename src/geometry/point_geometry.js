import * as THREE from 'three';
import { ModelElement } from './geometry_element';

export class PointGeom extends ModelElement {

  static POINT_GEOMETRY = new THREE.SphereGeometry(1, 16, 16);
  static POINT_SCALE = 0.05;

  constructor(point, { scale=1, distance=1, ...args} = {}) {
    super(args);
    this.point = point;
    this.distance = distance;
    this.material = new THREE.MeshBasicMaterial({ color: this.color });
    this.mesh = new THREE.Mesh(PointGeom.POINT_GEOMETRY, this.material);
    this.mesh.position.copy(this.point);
    this.scale = scale;
    this.mesh.scale.setScalar(scale*PointGeom.POINT_SCALE);
    this.mesh.visible = this.visible;
  }

  setScale(scale) {
    this.scale = scale;
    this.mesh.scale.setScalar(scale*PointGeom.POINT_SCALE);
  }

  update() {
    super.update();
    this.mesh.position.copy(this.point);
  }
}
