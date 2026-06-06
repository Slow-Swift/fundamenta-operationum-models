import { Vector3 } from "three";
import { orthonomalBasis, Pole } from "../math/spherical";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { Line2 } from "three/addons/lines/Line2.js";

export class Equator {
  
  constructor({ pole, color=0xff0000, radius=1, thickness=5, start=0, end=360 }) {
    this.pole = pole;
    this.radius = radius;
    this.color = color;
    this.thickness = thickness;
    this.start = start;
    this.end = end;

    this.material = new LineMaterial();
    this.geometry = new LineGeometry();
    this.mesh = new Line2(this.geometry, this.material);
    this.Update();
  }

  Update() {
    this.geometry.setPositions(GeneratePoints(this.pole, this.radius, this.start, this.end));
    this.material.setValues({ color: this.color, linewidth: this.thickness });
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
    this.Update();
  }
  
  Update() {
    const pole = Pole(this.point1, this.point2);
    const [ u, v ] = orthonomalBasis(pole);
    const angle1 = Math.acos(u.dot(this.point1)) * 180 / Math.PI;
    const angle2 = Math.acos(u.dot(this.point2)) * 180 / Math.PI;
    const target = this.length != 0 ? angle1 + this.length - this.start : this.end + angle2;
    
    this.geometry.setPositions(GeneratePoints(pole, this.radius, this.start + angle1, target));
    this.material.setValues({ color: this.color, linewidth: this.thickness });
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
