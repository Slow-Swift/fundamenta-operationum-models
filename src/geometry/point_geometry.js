import * as THREE from 'three';

export class PointGeom {

  static POINT_GEOMETRY = new THREE.SphereGeometry(1, 8, 8);

  constructor(point, color=0xff0000, scale=0.05, distance=1) {
    this.point = point;
    this.distance = distance;
    this.material = new THREE.MeshBasicMaterial({ color: color });
    this.mesh = new THREE.Mesh(PointGeom.POINT_GEOMETRY, this.material);
    this.mesh.position.copy(this.point);
    this.mesh.scale.setScalar(scale);
  }

  Update() {
    this.mesh.position.copy(this.point);
  }
}
