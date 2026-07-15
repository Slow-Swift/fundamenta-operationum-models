import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition25 } from "../math/propositions";

export class Proposition25 extends Model {

  constructor() {
    super();
    this.parameters = {
      time: 7.5,
      latitude: 50,
      obliquity: 23.5,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;

    const p = this.points = {};

    p.E = Point(0, 0);
    p.B = Point(-90, 0); // Horizon Left
    p.D = Point(90, 0);  // Horizon Right
    p.Z = Point(90, () => this.parameters.latitude);
    p.T = Point(-90, () => -this.parameters.latitude);
    p.A = Point(0, 90);
    p.C = Point(0, -90);
    p.H = Point(0, () => 90 - c.AH);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(Point(0, 0)),
      horizon: new Equator(Point(0, 90)), 
      easternCircle: new Equator(p.D),
      hourCircle: new Arc(p.Z, () => this.parameters.latitude < 90 ? p.H() : Point(90 - this.parameters.time * 180 / 12, 0), {length: 180}),

      AED: new RightAngle(p.E, p.A, p.D),
      ZAH: new RightAngle(p.A, p.Z, p.H),
      ABE: new RightAngle(p.B, p.A, p.D),
      AZH: new AngleElement(p.Z, p.A, p.H),
    };

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;

    const AZH = 180 - p.time * 180 / 12;
    c.ZH = TriangleSolver.hypoteneusFromAdjacent(AZH, 90 - p.latitude);
    c.AH = TriangleSolver.opposite(AZH, c.ZH);
  }

  setupGui(gui) {
    gui.addSlider('Solar Time', this.parameters, 'time', -12, 12);
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
  }

}


