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
import { LatitudeCircle } from "../geometry/latitude_circle";

export class Proposition52 extends Model {

  constructor() {
    super();
    this.variables = {
      latitude: 50,
      radius: 60
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {};
    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
    };

    p.O = Point(0,0);
    p.D = Point(0, () => v.radius);
    p.Z = Point(0, () => 90 - v.latitude);
    p.C = Point(0, () => -v.latitude);
    p.A = distanceAlongSmallCircle(p.Z, p.C, () => -v.CA, 0);
    p.B = distanceAlongSmallCircle(p.Z, p.C, () => v.CA, 0);

    g.circumference = new LatitudeCircle(p.O, () => 90 - v.radius);
    g.ecliptic = new Equator(p.Z);
    g.ZC = new Arc(p.Z, p.C);
    g.OA = new Arc(p.O, p.A);
    g.OB = new Arc(p.O, p.B);

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.CA = TriangleSolver.thirdSide(v.radius, v.latitude);

    this.setGeometryVisibility(v.latitude <= v.radius, [g.A, g.B, g.OA, g.OB]);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.variables, 'latitude', 0, 90);
  }

}


