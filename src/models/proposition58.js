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
import { proposition14, proposition16, proposition2, proposition3, proposition5 } from "../math/propositions";
import { LatitudeCircle } from "../geometry/latitude_circle";

export class Proposition58 extends Model {

  constructor() {
    super();
    this.variables = {
      obliquity: 23.5
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {};
    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
    };

    p.E = Point(0, 0);
    p.B = Point(-90, 0);
    p.A = Point(-90, v.obliquity);
    p.Z = Point(0, 90);
    p.H = distanceAlongArc(p.E, p.A, () => v.EH);
    p.K = distanceAlongArc(p.Z, p.H, 90);

    g.EB = new Arc(p.E, p.B);
    g.EA = new Arc(p.E, p.A);
    g.ZB = new Arc(p.Z, p.B);
    g.ZK = new Arc(p.Z, p.K);

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;
  
    v.ZH = asin(Math.sqrt(sin(90 - v.obliquity)));
    v.HK = 90 - v.ZH;
    v.EH = proposition3(v.HK, v.obliquity);
  }

  setupGui(gui) {
  }

}


