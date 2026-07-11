import { smallCircleArc } from "../math/spherical";
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
    const pole = typeof(this.pole) == 'function' ? this.pole() : this.pole;
    const point1 = typeof(this.point1) == 'function' ? this.point1() : this.point1;
    const point2 = typeof(this.point2) == 'function' ? this.point2() : this.point2;
    const start = typeof(this.start) == 'function' ? this.start() : this.start;
    const end = typeof(this.end) == 'function' ? this.end() : this.end;
    const points = smallCircleArc(pole, point1, point2, start, end);
    return points;
  }
}
