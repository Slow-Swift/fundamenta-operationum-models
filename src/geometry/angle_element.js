import { greatCircleArc, latitudeArc, orthonomalBasis } from "../math/spherical";
import { LineElement } from "./LineElement";

export class AngleElement extends LineElement {
  
  constructor(center, leftPoint, rightPoint, { ...args}={}) {
    super(args);
    this.center = center;
    this.leftPoint = leftPoint;
    this.rightPoint = rightPoint;
  }

  generatePoints() {
    const points = latitudeArc(this.center, 5, 0, 360);
    return points;
  }
}
