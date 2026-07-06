import { greatCircleArc, orthonomalBasis } from "../math/spherical";
import { LineElement } from "./LineElement";

export class Equator extends LineElement {
  
  constructor(pole, { radius=1, start=0, length=360, ...args}={}) {
    super(args);
    this.pole = pole;
    this.radius = radius;
    this.start = start;
    this.length = length;
  }

  generatePoints() {
    const pole = typeof(this.pole) == 'function' ? this.pole() : this.pole;
    const [ u, v ] = orthonomalBasis(pole); 
    const points = greatCircleArc(u, v, this.start, this.length); 
    return points;
  }
}
