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

export class Proposition56 extends Model {

  constructor() {
    super();
    this.variables = {
      dayLength: 15, 
      obliquity: 23.5
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {};
    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)),
      meridian: new Equator(Point(0,0)),
    };

    p.E = Point(0, 0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.H = Point(() => v.EH, 0);
    p.Z = Point(90, () => v.latitude);
    p.A = Point(-90, () => v.AB);
    p.C = Point(90, () => -v.AB);
    p.K = distanceAlongArc(p.E, p.C, () => v.EK);

    g.equator = new Equator(p.Z);
    g.ZK = new Arc(p.Z, p.K);
    

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.EK = (v.dayLength - 12) / 2 * 180 / 12;
    v.EH = acos(cos(v.EK) * cos(v.obliquity));
    v.AB = TriangleSolver.angleFromOppositeAndHypotenuse(v.obliquity, v.EH);
    v.latitude = 90 - v.AB;
  }

  setupGui(gui) {
    gui.addSlider('Day Length', this.variables, 'dayLength', 12, 24);
  }

}


