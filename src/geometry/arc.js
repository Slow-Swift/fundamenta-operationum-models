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
    const angle = Math.acos(clamp(this.point1.dot(this.point2), -1, 1));
    const length = this.length != 0 ? this.length : radToDeg(angle) + this.end - this.start;
    const points = greatCircleArc(this.point1, this.point2, this.start, length);
    return points;
  }

  angle() {
    return acos(this.point1.clone().dot(this.point2));
  }
}

