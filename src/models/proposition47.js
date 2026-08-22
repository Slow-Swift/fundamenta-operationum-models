import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round, mod } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { ArcLabel, Label, northSouthFormatter } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition14, proposition16, proposition2, proposition5 } from "../math/propositions";
import { warn } from "jsxgraph";

export class Proposition47 extends Model {

  constructor() {
    super();
    this.variables = {
      starLongitude: 150,
      starLatitude: 20,
      obliquity: 23.5,
      showLabels: false,
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
    p.H = distanceAlongArc(p.A, p.E, () => v.starLongitude - 90);
    p.O = distanceAlongArc(p.H, p.X, () => v.starLatitude);
    p.N = Point(-90, () => 90 - v.XN + v.obliquity);
    p.L = Point(() => -90 + v.BL, 0);
    p.M = Point(() => -90 + v.AZO, 0);
    p.R = Point(() => 90 - v.AZO, 0);
    p.K = distanceAlongArc(p.Z, p.M, () => v.ZK);
    p.Q = distanceAlongArc(p.Y, p.R, () => v.ZK);
    p.S = Point(0, () => 90 - v.ZS);
    p.P = distanceAlongArc(p.Q, p.Z, () => v.QP);

    // *** Geometry ***
    g.ecliptic = new Equator(p.X);
    g.XH = new Arc(p.X, p.H);
    g.TH = new Arc(p.T, p.H);
    g.ON = new Arc(p.O, p.N);
    g.ZM = new Arc(p.Z, p.M);
    g.OM = new Arc(p.O, p.M);
    g.MK = new Arc(p.M, p.K);
    g.ZY = new Arc(p.Z, p.E, {length: 180});
    g.ZR = new Arc(p.Z, p.R);
    g.RQ = new Arc(p.R, p.Q);
    g.RP = new Arc(p.R, p.P);

    g.HNO = new RightAngle(p.N, p.X, p.O);
    g.KME = new RightAngle(p.M, p.K, p.E);

    g.OXN = new AngleElement(p.X, p.H, p.Z);
    g.OH_label = new ArcLabel(p.O, p.H);
    g.ZO_label = new ArcLabel(p.Z, p.O);
    g.NO_label = new ArcLabel(p.N, p.O);
    g.NZO = new AngleElement(p.Z, p.N, p.O);
    g.SX_label = new ArcLabel(p.S, p.X);
    g.ZX_label = new ArcLabel(p.Z, p.X);
    g.KE_label = new ArcLabel(p.K, p.E);

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
    if (v.starLatitude == 90) v.XN = 0;
    v.HL = TriangleSolver.adjacent(v.NXH, v.obliquity);
    if (v.NXH > 90) v.HL = 180 - v.HL;
    v.BL = TriangleSolver.opposite(v.NXH, 90 + v.HL);
    v.NZ = v.XN - v.obliquity;

    v.NOX = TriangleSolver.oppositeAngle(v.NXH, v.XN);
    v.ZO = acos(cos(v.NZ) * cos(v.ON));
    v.AZO = TriangleSolver.angleFromOppositeAndHypotenuse(v.ON, v.ZO);
    if (v.XN < v.obliquity && 180 + v.XN > v.obliquity) v.AZO = 180 - v.AZO;
    v.ZK = TriangleSolver.hypoteneusFromAdjacent(v.AZO, 90 - v.obliquity);
    v.XS = TriangleSolver.hypoteneusFromAdjacent(v.NXH, v.obliquity);
    v.ZS = TriangleSolver.opposite(v.NXH, v.XS);

    v.EQR = TriangleSolver.oppositeAngle(v.obliquity, 90 - v.AZO);
    v.EQ = TriangleSolver.hypoteneusFromAdjacent(v.obliquity, 90-v.AZO);
    v.HQ = 90 - v.NXH + v.EQ;
    v.QP = TriangleSolver.hypoteneusFromAdjacent(v.EQR, v.HQ);

    this.setGeometryVisibility(v.showLabels, [ g.KE_label, g.NO_label, g.ZO_label, g.ZX_label, g.OH_label, g.SX_label, g.OXN, g.NZO ]);
  }

  setupGui(gui) {
    gui.addSlider('Star Longitude', this.variables, 'starLongitude', 90, 270);
    gui.addSlider('Star Latitude', this.variables, 'starLatitude', -90, 90, { formatter: northSouthFormatter });
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


