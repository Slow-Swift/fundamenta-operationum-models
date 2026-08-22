import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round, mod } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { ArcLabel, Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition14, proposition16, proposition2, proposition3, proposition5 } from "../math/propositions";
import { LatitudeCircle } from "../geometry/latitude_circle";

export class Proposition57 extends Model {

  constructor() {
    super();
    this.variables = {
      dayLength: 15, 
      longitude: 40,
      obliquity: 23.5,
      showLabels: false,
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
    p.H = distanceAlongArc(p.E, p.A, () => v.longitude);
    p.K = distanceAlongArc(p.Z, p.H, 90);
    p.L = distanceAlongArc(p.E, p.A, () => v.EL);
    p.M = distanceAlongArc(p.Z, p.L, 90);
    p.N = distanceAlongArc(p.Z, p.L, () => v.ZL + v.LN);

    g.EB = new Arc(p.E, p.B);
    g.EA = new Arc(p.E, p.A);
    g.ZB = new Arc(p.Z, p.B);
    g.ZK = new Arc(p.Z, p.K);
    g.ZM = new Arc(p.Z, p.M);
    g.HN = new Arc(p.H, p.N);
    g.LNH = new RightAngle(p.N, p.L, p.H);

    g.ABE = new RightAngle(p.B, p.A, p.E);
    g.LME = new RightAngle(p.M, p.L, p.E);
    g.HKE = new RightAngle(p.K, p.H, p.E);
    g.AZL = new RightAngle(p.A, p.Z, p.L);

    g.HL_label = new ArcLabel(p.L, p.H);
    g.MK_label = new ArcLabel(p.M, p.K);
    g.ZA_label = new ArcLabel(p.Z, p.A);
    g.ZL_label = new ArcLabel(p.Z, p.L);
    g.ZH_label = new ArcLabel(p.Z, p.H);

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.ZH = 90 - proposition2(v.longitude);
    v.ZL = asin(sin(90 - v.obliquity) / sin(v.ZH));
    v.EL = proposition3(90 - v.ZL, v.obliquity);
    v.ZLA = TriangleSolver.angleFromOppositeAndHypotenuse(90 - v.obliquity, v.ZL);
    v.LN = TriangleSolver.adjacent(v.ZLA, v.EL - v.longitude);

    this.setGeometryVisibility(v.showLabels, [ g.HL_label, g.MK_label, g.ZA_label, g.ZL_label, g.ZH_label]);
  }

  setupGui(gui) {
    gui.addSlider('H Longitude', this.variables, 'longitude', 0, 90);
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


