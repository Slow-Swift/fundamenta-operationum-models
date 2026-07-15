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

export class Proposition26 extends Model {

  constructor() {
    super();
    this.parameters = {
      time: 7.5,
      latitude: 50,
      circleAltitude: 70,
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
    p.Z_p = Point(90, () => this.parameters.latitude - 90);
    p.H_p = distanceAlongSmallCircle(p.Z, p.Z_p, () => -this.parameters.time * 180 / 12, 0);
    p.T = Point(-90, () => -this.parameters.latitude);
    p.A = Point(90, () => this.parameters.circleAltitude);
    p.C = Point(-90, () => -this.parameters.circleAltitude);
    p.H = distanceAlongArc(p.A, p.E, () => c.AH);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(Point(0, 0)),
      horizon: new Equator(Point(0, 90)), 
      easternCircle: new Equator(Point(90, () => -90+this.parameters.circleAltitude)),
      hourCircle: new Arc(p.Z, p.H_p, {length: 180}),

      ZAH: new RightAngle(p.A, p.Z, p.E),
      ABE: new RightAngle(p.B, p.A, p.D),
      AZH: new AngleElement(p.Z, p.A, p.H),
    };

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.Z_p, g.H_p]);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;

    const AZH = 180 - p.time * 180 / 12;
    const AZ = p.circleAltitude - p.latitude;
    c.ZH = TriangleSolver.hypoteneusFromAdjacent(AZH, AZ);
    c.AH = TriangleSolver.opposite(AZH, c.ZH);
    if (AZ < 0) c.AH = 180 + c.AH;
  }

  setupGui(gui) {
    gui.addSlider('Solar Time', this.parameters, 'time', 0, 12);
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    gui.addSlider('Circle Altitude', this.parameters, 'circleAltitude', 0, 180);
  }

}


