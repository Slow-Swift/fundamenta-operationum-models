import { greatCircleArc, latitudeArc, orthonomalBasis } from "../math/spherical";
import { LineElement } from "./LineElement";

export class LatitudeCircle extends LineElement {
  
  constructor(pole, latitude, { radius=1, start=0, length=360, ...args}={}) {
    super(args);
    this.pole = pole;
    this.latitude = latitude;
    this.start = start;
    this.length = length;
  }

  generatePoints() {
    const pole = typeof(this.pole) == 'function' ? this.pole() : this.pole;
    const latitude = typeof(this.latitude) == 'function' ? this.latitude() : this.latitude;
    const start = typeof(this.start) == 'function' ? this.start() : this.start;
    const length = typeof(this.length) == 'function' ? this.length() : this.length;
    const points = latitudeArc(pole, latitude, start, length);
    return points;
  }
}
