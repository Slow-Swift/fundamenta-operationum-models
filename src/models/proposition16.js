import { distanceAlongArc, Point } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import { proposition16 } from "../math/propositions";

export class Proposition16 extends Model {

  constructor() {
    super();
    this.parameters = {
      ecliptic_longitude: 120,
      obliquity: 23.5,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;
    const v = this.parameters;

    const p = this.points = {
      E: Point(0, 0),   // Equator Centre
      B: Point(-90, 0), // Equator Left
      D: Point(90, 0),  // Equator Right

      A: () => Point(-90, this.parameters.obliquity), // Equator Horizon Left
      C: () => Point(90, -this.parameters.obliquity), // Equator Horizon Right


      H: Point(0, 90), // Zenith
    };

    p.K = distanceAlongArc(p.A, p.E, () => this.parameters.ecliptic_longitude - 90);
    p.L = distanceAlongArc(p.H, p.K, 90);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      equator: new Equator(p.H), 
      ecliptic: new Arc(p.E, p.C, {length: 360}),
      edge: new Equator(p.E),
      HK: new Arc(p.H, p.K),
      HL: new Arc(p.H, p.L),

      angle_L: new RightAngle(p.L, p.K, p.E),
      angle_B: new RightAngle(p.B, p.A, () => v.ecliptic_longitude < 180 ? p.L() : p.E),
      angle_A: new RightAngle(p.A, p.H, p.K),
      angleK: new AngleElement(p.K, p.L, p.E),
    };

    this.createPointGeometries(p);
  }

  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;
  }

  setupGui(gui) {
    gui.addSlider('Ecliptic Longitude', this.parameters, 'ecliptic_longitude', 0, 360);
  }

}


