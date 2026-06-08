import { Vector3 } from "three";
import { greatCircleArc, orthonomalBasis } from "../math/spherical";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { Line2 } from "three/addons/lines/Line2.js";
import { clamp, radToDeg } from "three/src/math/MathUtils.js";

export class Equator {
  
  constructor({ pole, color=0xff0000, radius=1, thickness=5, start=0, end: length=360 }) {
    this.pole = pole;
    this.radius = radius;
    this.color = color;
    this.thickness = thickness;
    this.start = start;
    this.length = length;

    this.material = new LineMaterial();
    this.geometry = new LineGeometry();
    this.mesh = new Line2(this.geometry, this.material);
    this.update();
  }

  update() {
    const positions = GeneratePoints(this.pole, this.radius, this.start, this.length);
    this.geometry.setPositions(positions);
    this.material.setValues({ color: this.color, linewidth: this.thickness });
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.mesh = null;
  }
}

export class Arc {
  constructor({ point1, point2, color=0xff0000, radius=1, thickness=5, start=0, end=0, length=0}) {
    this.point1 = point1;
    this.point2 = point2;
    this.start = start;
    this.end = end;
    this.length = length;

    this.radius = radius;
    this.color = color;
    this.thickness = thickness;

    this.material = new LineMaterial();
    this.geometry = new LineGeometry();
    this.mesh = new Line2(this.geometry, this.material);

    this.update();
  }
  
  update() {
    const angle = Math.acos(clamp(this.point1.dot(this.point2), -1, 1));
    const length = this.length != 0 ? this.length : radToDeg(angle) + this.end - this.start;
    const points = greatCircleArc(this.point1, this.point2, this.start, length, this.debug);
    
    this.geometry.dispose();
    this.geometry = new LineGeometry();
    this.geometry.setFromPoints(points);
    this.mesh.geometry = this.geometry;
    this.material.setValues({ color: this.color, linewidth: this.thickness });
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.mesh = null;
  }
}

function GeneratePoints(pole, radius, start, end) {
  const [ u, v ] = orthonomalBasis(pole);

  const pts = [];

  for (let i=start; i<=end; i++) {
    const t = (i / 360) * 2 * Math.PI;

    const p = new Vector3()
      .addScaledVector(u, Math.cos(t))
      .addScaledVector(v, Math.sin(t))
      .multiplyScalar(radius);

    pts.push(p.x, p.y, p.z);
  }

  return pts;

}


