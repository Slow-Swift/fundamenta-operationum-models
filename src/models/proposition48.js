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

export class Proposition48 extends Model {

  constructor() {
    super();
    this.variables = {
      declination: 40,
      midheavenLongitude: 160,
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
    p.Y = Point(0, -90);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.E = Point(0,0);
    p.X = Point(90, 90 - v.obliquity);
    p.T = Point(-90, -90 + v.obliquity);
    p.A = Point(-90, v.obliquity);
    p.C = Point(90, -v.obliquity);
    p.K = distanceAlongArc(p.A, p.E, () => v.midheavenLongitude - 90);
    p.M = distanceAlongArc(p.Z, p.K, 90);
    p.O = distanceAlongArc(p.M, p.Z, () => v.declination);
    p.H = distanceAlongArc(p.A, p.E, () => v.AH); 
    p.N = Point(-90, () => 90 - v.NZ);
    p.L = Point(() => -90 + v.BL, 0);
    p.S = Point(0, () => 90 - v.ZS);
    p.Q = distanceAlongArc(p.Y, p.M, () => v.YQ);
    p.P = distanceAlongArc(p.C, p.E, () => v.midheavenLongitude - 90);

    // *** Geometry ***
    g.ecliptic = new Equator(p.X);
    g.XH = new Arc(p.X, p.H);
    g.TH = new Arc(p.T, p.H);
    g.ON = new Arc(p.O, p.N);
    g.ZM = new Arc(p.Z, p.M);
    g.OM = new Arc(p.O, p.M);
    g.MK = new Arc(p.M, p.K);
    g.ZY = new Arc(p.Z, p.E, {length: 180});
    g.YM = new Arc(p.Y, p.M);
    g.XT = new Arc(p.X, p.E, { length: 180});
    g.XP = new Arc(p.X, p.P, { length: 180});

    g.HNO = new RightAngle(p.N, p.X, p.O);
    g.KME = new RightAngle(p.M, p.K, p.E);
    g.OHK = new RightAngle(p.H, p.O, p.K);

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.KM = proposition2(v.midheavenLongitude, v.obliquity);
    v.KO = v.declination - v.KM;
    v.OKH = 180 - proposition16(v.midheavenLongitude, v.obliquity);
    v.HK = TriangleSolver.adjacent(v.OKH, v.KO);
    v.HO = TriangleSolver.opposite(v.OKH, v.KO);
    v.AH = v.midheavenLongitude - v.HK - 90;
    v.BL = proposition6(v.AH + 90, v.obliquity) - 90;

    v.BM = proposition5(v.midheavenLongitude, v.obliquity) - 90;
    v.NZ = TriangleSolver.adjacent(v.BM, 90 - v.declination);
    if (v.midheavenLongitude > 180) v.NZ = -v.NZ;

    v.YQ = TriangleSolver.hypoteneusFromAdjacent(v.BM, v.obliquity);
  }

  setupGui(gui) {
    gui.addSlider('Decliantion', this.variables, 'declination', -90, 90);
    gui.addSlider('Midheaven Longitude', this.variables, 'midheavenLongitude', 90, 270);
  }

}


