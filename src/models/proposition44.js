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

export class Proposition44 extends Model {

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
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.E = Point(0,0);
    p.X = Point(90, 90 - v.obliquity);
    p.T = Point(-90, -90 + v.obliquity);
    p.A = Point(-90, v.obliquity);
    p.C = Point(90, -v.obliquity);
    p.H = distanceAlongArc(p.A, p.E, () => v.starLongitude - 90);
    p.O = distanceAlongArc(p.H, p.X, () => v.starLatitude);
    p.N = distanceAlongArc(p.X, p.H, () => v.XN);
    p.L = Point(() => -90 + v.BL, 0);
    p.M = Point(() => -90 + v.BL + v.LM, 0);
    p.M_p = Point(() => v.BL + v.LM, 0);
    p.K = Point(() => -v.EM, () => v.MK);

    // *** Geometry ***
    g.ecliptic = new Equator(p.X);
    g.XH = new Arc(p.X, p.H);
    g.TH = new Arc(p.T, p.H);
    g.ZN = new Arc(p.Z, p.N);
    g.XN = new Arc(p.X, p.N);
    g.ZM = new Arc(p.Z, p.M);
    g.OM = new Arc(p.O, p.M);
    g.MK = new Arc(p.M, p.K);

    g.ZNK = new RightAngle(p.N, p.Z, p.X);
    g.KME = new RightAngle(p.M, p.K, p.E);
    g.ABE = new RightAngle(p.B, p.A, p.E);

    g.ZX_label = new ArcLabel(p.Z, p.X);
    g.ZXN = new AngleElement(p.X, p.Z, p.N);
    g.HLM = new AngleElement(p.L, p.H, p.M);
    g.HL_label = new ArcLabel(p.H, p.L);
    g.OH_label = new ArcLabel(p.O, p.H);
    g.OM_label = new ArcLabel(p.O, p.M, { pole: p.M_p, formatter: northSouthFormatter });

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [ g.M_p ]);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.ZXN = v.starLongitude - 90;
    v.ZN = TriangleSolver.opposite(v.ZXN, v.obliquity);
    v.XN = TriangleSolver.adjacent(v.ZXN, v.obliquity);
    if (v.ZXN > 90) v.XN = 180 - v.XN;
    v.BL = TriangleSolver.opposite(v.ZXN, 90 + v.XN);
    v.XLM = 90 - v.ZN;
    v.LM = TriangleSolver.adjacent(v.XLM, v.XN + v.starLatitude);
    if(v.XLM > 90) v.LM = 180 - v.LM;
    if (v.starLongitude > 180 && mod(v.XN + v.starLatitude, 360) > 180) v.LM = - v.LM; 

    v.EM = 90 - v.BL - v.LM;
    v.EK = TriangleSolver.hypoteneusFromAdjacent(v.obliquity, v.EM);
    v.MK = TriangleSolver.opposite(v.obliquity, v.EK);

    this.setGeometryVisibility(p.O().dot(p.Z) != 0, [g.ZM, g.OM, g.MK, g.M, g.K]);
    this.setGeometryVisibility(v.showLabels, [ g.OH_label, g.HL_label, g.HLM, g.ZX_label, g.ZXN]);
    this.setGeometryVisibility(v.showLabels && p.O().dot(p.Z) != 0, [ g.OM_label ]);
    this.setGeometryVisibility(v.showLabels && v.starLongitude < 360, [ g.HLM ]);
  }

  setupGui(gui) {
    gui.addSlider('Star Longitude', this.variables, 'starLongitude', 0, 360);
    gui.addSlider('Star Latitude', this.variables, 'starLatitude', -90, 90, { formatter: northSouthFormatter });
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


