import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { ArcLabel, Label } from "../geometry/label";
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
      arcLabels: false,
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
      ZAH: new RightAngle(p.A, p.D, p.E),
      ABE: new RightAngle(p.B, p.A, p.D),
      AZH: new AngleElement(p.Z, p.A, p.H),
    };

    g.AHZ = new AngleElement(p.H, p.A, p.Z);
    g.DZ = new ArcLabel(p.Z, p.D, { pole: p.E });
    g.AH = new ArcLabel(p.A, p.H, p.D);

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;
    const g = this.geometry;

    const AZH = 180 - p.time * 180 / 12;
    c.ZH = TriangleSolver.hypoteneusFromAdjacent(AZH, 90 - p.latitude);
    c.AH = TriangleSolver.opposite(AZH, c.ZH);

    this.setGeometryVisibility(p.arcLabels, [g.AHZ, g.AZH, g.DZ, g.AH]);
  }

  setupGui(gui) {
    gui.addSlider('Solar Time', this.parameters, 'time', 0, 24, { formatter: (t) => round(t, 1).toString()});
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    gui.addToggle('Show Labels', this.parameters, 'arcLabels');
  }

}


