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
    const points = latitudeArc(this.pole, this.latitude, this.start, this.length);
    return points;
  }
}
