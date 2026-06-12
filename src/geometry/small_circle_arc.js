import { greatCircleArc, latitudeArc, orthonomalBasis, smallCircleArc } from "../math/spherical";
import { LineElement } from "./LineElement";

export class SmallCircleArc extends LineElement {
  
  constructor(point1, point2, pole, { start=0, end=0, ...args}={}) {
    super(args);
    this.pole = pole;
    this.point1 = point1,
    this.point2 = point2,
    this.start = start;
    this.end = end;
  }

  generatePoints() {
    const points = smallCircleArc(this.pole, this.point1, this.point2, this.start, this.end);
    return points;
  }
}
