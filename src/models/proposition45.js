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

export class Proposition45 extends Model {

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

    p.Z = Point(0,90);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.E = Point(0,0);
    p.X = Point(90, 90 - v.obliquity);
    p.T = Point(-90, -90 + v.obliquity);
    p.A = Point(-90, v.obliquity);
    p.C = Point(90, -v.obliquity);
    p.H = distanceAlongArc(p.A, p.E, () => v.starLongitude - 90);
    p.O = distanceAlongArc(p.H, p.X, () => v.starLatitude);
    p.N = Point(-90, () => 90 - v.XN + v.obliquity);
    p.L = Point(() => -90 + v.BL, 0);
    p.M = Point(() => -90 + v.AZO, 0);
    p.K = distanceAlongArc(p.Z, p.M, () => v.ZK);
    // *** Geometry ***
    g.ecliptic = new Equator(p.X);
    g.XH = new Arc(p.X, p.H);
    g.TH = new Arc(p.T, p.H);
    g.ON = new Arc(p.O, p.N);
    g.ZM = new Arc(p.Z, p.M);
    g.OM = new Arc(p.O, p.M);
    g.MK = new Arc(p.M, p.K);

    g.HNO = new RightAngle(p.N, p.X, p.O);
    g.KME = new RightAngle(p.M, p.K, p.E);

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.NXH = v.starLongitude - 90;
    v.ON = TriangleSolver.opposite(v.NXH, 90 - v.starLatitude);
    v.XN = TriangleSolver.adjacent(v.NXH, 90 - v.starLatitude);
    if (v.NXH > 90) v.XN = mod(360 - v.XN, 360) - 180;
    v.HL = TriangleSolver.adjacent(v.NXH, v.obliquity);
    if (v.NXH > 90) v.HL = 180 - v.HL;
    v.BL = TriangleSolver.opposite(v.NXH, 90 + v.HL);
    v.NZ = v.XN - v.obliquity;

    v.NOX = TriangleSolver.oppositeAngle(v.NXH, v.XN);
    v.ZO = acos(cos(v.NZ) * cos(v.ON));
    v.AZO = TriangleSolver.angleFromOppositeAndHypotenuse(v.ON, v.ZO);
    if (v.XN < v.obliquity) v.AZO = 180 - v.AZO;
    v.ZK = TriangleSolver.hypoteneusFromAdjacent(v.AZO, 90 - v.obliquity);
  }

  setupGui(gui) {
    gui.addSlider('Star Longitude', this.variables, 'starLongitude', 0, 360);
    gui.addSlider('Star Latitude', this.variables, 'starLatitude', -90, 90);
  }

}


