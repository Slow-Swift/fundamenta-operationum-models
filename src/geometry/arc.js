import { clamp, radToDeg } from "three/src/math/MathUtils.js";
import { greatCircleArc } from "../math/spherical";
import { LineElement } from "./LineElement";
import { acos } from "../math/degMath";

export class Arc extends LineElement {
  constructor(point1, point2, { radius=1, start=0, end=0, length=0, ...args}={}) {
    super(args); 

    this.point1 = point1;
    this.point2 = point2;
    this.start = start;
    this.end = end;
    this.length = length; 

    this.radius = radius;
  }

  generatePoints() {
    const p1 = typeof(this.point1) == 'function' ? this.point1() : this.point1;
    const p2 = typeof(this.point2) == 'function' ? this.point2() : this.point2;

    const angle = Math.acos(clamp(p1.dot(p2), -1, 1));
    const length = this.length != 0 ? this.length : radToDeg(angle) + this.end - this.start;
    const points = greatCircleArc(p1, p2, this.start, length);
    return points;
  }

  angle() {
    const p1 = typeof(this.point1) == 'function' ? this.point1() : this.point1;
    const p2 = typeof(this.point2) == 'function' ? this.point2() : this.point2;
    return acos(p1.clone().dot(p2));
  }
}

