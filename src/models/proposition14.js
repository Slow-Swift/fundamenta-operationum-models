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

export class Proposition14 extends Model {

  constructor() {
    super();
    this.parameters = {
      latitude: 40,
      declination: 20,
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
      O: () => Point(0, c.altitude),
      Z: () => Point(90, this.parameters.latitude),
      M: Point(0, 0),
    };

    p.M = distanceAlongArc(p.Z, p.O, 90);

    this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      equator: new Equator(p.Z), 
      horizon: new Equator(p.H), 
      edge: new Equator(p.E),
      HO: new Arc(p.H, p.E),
      ZO: new Arc(p.Z, p.M),
      OE: new Arc(p.O, p.E),
      OM: new Arc(p.O, p.M),
      
      altitudeLabel: new Label(() => round(c.altitude, 1), Point(0, () => c.altitude / 2)),
      declinationLabel: new Label(() => round(this.parameters.declination, 1), distanceAlongArc(p.M, p.O, () => Math.abs(this.parameters.declination) / 2)),

      // Angles
      angle_B: new RightAngle(p.B, p.A, p.E),
      angle_A: new RightAngle(p.A, p.H, p.E),
      angle_H: new RightAngle(p.H, Point(90, 45), p.E),
      angle_M: new RightAngle(p.M, p.O, p.E),
      angle_E: new AngleElement(p.E, p.M, p.O),
    };

    this.createPointGeometries(p);
  }

  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;
    const g = this.geometry;

    this.declinationSlider?.setRange(-Math.min(p.latitude, 23.5), Math.min(p.latitude, 23.5));

    c.altitude = asin(sin(p.declination) / sin(p.latitude));
    this.setGeometryVisibility(p.latitude != 0, [g.O, g.M, g.altitudeLabel]);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    this.declinationSlider = gui.addSlider('Declination', this.parameters, 'declination', 0, 23.5);
  }

}


