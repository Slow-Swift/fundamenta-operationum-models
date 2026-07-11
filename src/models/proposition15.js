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
import { proposition13, proposition15 } from "../math/propositions";

export class Proposition15 extends Model {

  constructor() {
    super();
    this.parameters = {
      latitude: 60,
      declination: 10,
      time: 8,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;

    const p = this.points = {
      E: Point(0, 0),   // Horizon Centre
      B: Point(-90, 0), // Horizon Left
      D: Point(90, 0),  // Horizon Right

      A: () => Point(-90, 90 - this.parameters.latitude), // Equator Horizon Left
      C: () => Point(90, this.parameters.latitude - 90), // Equator Horizon Right

      H: Point(0, 90), // Zenith
      Z: () => Point(90, this.parameters.latitude),
      X: () => Point(-90, -this.parameters.latitude),
    };

    p.M = distanceAlongArc(p.C, p.E, () => this.parameters.time / 12 * 180);
    p.O = distanceAlongArc(p.M, p.Z, () => this.parameters.declination);
    p.S = distanceAlongArc(p.E, p.O, 90);
    p.K = distanceAlongArc(p.H, p.O, 90);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(p.H), 
      edge: new Equator(p.E),
      ZO: new Arc(p.Z, p.O, {length:180}),
      HK: new Arc(p.H, p.K),
      HO: new Arc(p.H, p.O),

      OSE: new Arc(p.E, p.S),
      OS_label: new Label(() => round(c.OS, 1), distanceAlongArc(p.O, p.S, () => c.OS / 2)),
      KE_label: new Label(() => round(c.KE, 1), distanceAlongArc(p.E, p.K, () => c.KE / 2)),

      // Labels
      ZO_label: new Label(() => 90 - this.parameters.declination, distanceAlongArc(p.Z, p.O, () => (90 - this.parameters.declination) / 2)),
      
      // Angles
      angle_B: new RightAngle(p.B, p.A, p.E),
      angle_S: new RightAngle(p.S, p.Z, p.O),
      angle_Z: new AngleElement(p.Z, p.O, p.S),
      angle_H: new AngleElement(p.H, p.O, p.S),
    };

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.B, g.D, g.A, g.C, g.M]);
  }

  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;

    const OZS = p.time * 180 / 12;
    c.OS = asin(sin(OZS) * sin(90 - p.declination));
    c.KE = acos(this.points.K().dot(this.points.E));
    const altitude = proposition13(p.declination, 180 - OZS, p.latitude);
    console.log('--', c.KE, proposition15(p.declination, altitude, 180 - OZS));
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    this.declinationSlider = gui.addSlider('Declination', this.parameters, 'declination', -23.5, 23.5);
    gui.addSlider('Time', this.parameters, 'time', 0, 12);
  }

}


