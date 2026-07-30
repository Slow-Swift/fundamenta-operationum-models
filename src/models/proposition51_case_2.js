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

export class Proposition51_Case2 extends Model {

  constructor() {
    super();
    this.variables = {
      longitudeA: 50,
      longitudeB: 130,
      latitudeA: 40,
      latitudeB: 20,
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
    p.K = Point(90, 0);
    p.L = Point(() => v.longitudeA - 90, 0);
    p.M = Point(() => v.longitudeB - 90, 0);
    p.N = distanceAlongArc(p.L, p.Z, () => v.latitudeA);
    p.O = distanceAlongArc(p.M, p.Z, () => v.latitudeB);
    p.Q = distanceAlongArc(p.M, p.Z, () => v.latitudeA);

    g.ZL = new Arc(p.Z, p.L);
    g.ZM = new Arc(p.Z, p.M);
    g.LN = new Arc(p.L, p.N);
    g.MO = new Arc(p.M, p.O);
    g.NQ = new Arc(p.N, p.Q);
    g.ON = new Arc(p.O, p.N);
    g.MQ = new Arc(p.M, p.Q);
    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;
  }

  setupGui(gui) {
    gui.addSlider('Longitude A', this.variables, 'longitudeA', 0, 360);
    gui.addSlider('Longitude B', this.variables, 'longitudeB', 0, 360);
    gui.addSlider('Latitude A', this.variables, 'latitudeA', -90, 90);
    gui.addSlider('Latitude B', this.variables, 'latitudeB', -90, 90);
  }

}


