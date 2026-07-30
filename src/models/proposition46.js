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
import { proposition14, proposition16, proposition2, proposition5, proposition6 } from "../math/propositions";

export class Proposition46 extends Model {

  constructor() {
    super();
    this.variables = {
      starLongitude: 150,
      starLatitude: 20,
      obliquity: 23.5,
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

    p.E = Point(0,0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.Z = Point(0, 90);
    p.X = Point(90, 90 - v.obliquity);
    p.A = Point(-90, v.obliquity);
    p.C = Point(90, -v.obliquity);
    p.H = distanceAlongArc(p.A, p.E, () => v.AH);
    p.L = Point(() => -180 + v.BL, 0);
    p.O = distanceAlongArc(p.H, p.X, () => v.starLatitude);
    p.N = distanceAlongArc(p.X, p.H, () => v.XN);
    p.M = distanceAlongArc(p.Z, p.O, 90);
    p.K = distanceAlongArc(p.O, p.Z, () => -v.OK);

    // *** Geometry ***
    g.ecliptic = new Equator(p.X);
    g.XL = new Arc(p.X, p.L);
    g.LH = new Arc(p.L, p.H);
    g.LO = new Arc(p.L, p.O);
    g.ZN = new Arc(p.Z, p.N);
    g.XN = new Arc(p.X, p.N);
    g.ZM = new Arc(p.Z, p.M);
    g.MO = new Arc(p.M, p.O);
    g.MK = new Arc(p.M, p.K);

    g.XHA = new RightAngle(p.H, p.X, p.A);
    g.ZNX = new RightAngle(p.N, p.Z, p.X);

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.AH = v.starLongitude - 90;
    v.BL = proposition6(v.starLongitude, v.obliquity);

    v.ZN = TriangleSolver.opposite(v.AH, v.obliquity);
    v.XN = TriangleSolver.adjacent(v.AH, v.obliquity);
    if (v.AH > 90) v.XN = 180 - v.XN;
    if (v.AH > 90) v.ZN = 180 - v.ZN;
    v.NO = 90 - v.starLatitude - v.XN;
    v.ZO = acos(cos(v.ZN) * cos(v.NO));
    v.NOZ = TriangleSolver.angleFromOppositeAndHypotenuse(v.ZN, v.ZO);
    v.HOK = mod(v.XN + 180, 360)-180 < 90 - v.starLatitude ? v.NOZ : 180 - v.NOZ;
    v.OK = TriangleSolver.hypoteneusFromAdjacent(v.HOK, v.starLatitude);
    console.log(v.NOZ, mod(v.XN + 180, 360)-180, v.NO);

    this.setGeometryVisibility(v.starLongitude != 360, [g.N, g.XN]);
  }

  setupGui(gui) {
    gui.addSlider('Star Longitude', this.variables, 'starLongitude', 0, 360);
    gui.addSlider('Star Latitude', this.variables, 'starLatitude', -90, 90);
  }

}


