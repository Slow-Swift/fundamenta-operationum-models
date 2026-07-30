import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round, mod } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition14, proposition16, proposition2, proposition5 } from "../math/propositions";

export class Proposition51_Case1 extends Model {

  constructor() {
    super();
    this.variables = {
      longitudeA: 50,
      longitudeB: 130,
      latitude: 30,
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {};
    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(Point(0, 0)),
      horizon: new Equator(Point(0, 90)),
    };

    p.Z = Point(0, 90);
    p.H = Point(-90, 0);
    p.P = Point(0,0);
    p.K = Point(90, 0);
    p.L = Point(() => v.longitudeA - 90, 0);
    p.M = Point(() => v.longitudeB - 90, 0);
    p.N = distanceAlongArc(p.L, p.Z, () => v.latitude);
    p.O = distanceAlongArc(p.M, p.Z, () => v.latitude);
    p.Q_e = Point(() => (v.longitudeA + v.longitudeB) / 2 - 90 * (v.ZQ >= 0 ? 1 : -1), 0);
    p.Q = distanceAlongArc(p.Q_e, p.Z, () => 90 - Math.abs(v.ZQ));

    g.ZL = new Arc(p.Z, p.L);
    g.ZM = new Arc(p.Z, p.M);
    g.ZQ = new Arc(p.Z, p.Q_e, {length: 180})
    g.LN = new Arc(p.L, p.N);
    g.MO = new Arc(p.M, p.O);
    g.NQ = new Arc(p.N, p.Q);
    g.OQ = new Arc(p.O, p.Q);
    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.ZQ = TriangleSolver.adjacent((v.longitudeB - v.longitudeA) / 2, 90 - v.latitude);
    if (Math.abs(v.longitudeB  - v.longitudeA) > 180) v.ZQ = 180 - v.ZQ;
    v.ZQ = mod(v.ZQ + 180, 360) - 180;
  }

  setupGui(gui) {
    gui.addSlider('Longitude A', this.variables, 'longitudeA', 0, 360);
    gui.addSlider('Longitude B', this.variables, 'longitudeB', 0, 360);
    gui.addSlider('Latitude', this.variables, 'latitude', -90, 90);
  }

}


