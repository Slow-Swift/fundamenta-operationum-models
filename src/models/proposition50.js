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

export class Proposition50 extends Model {

  constructor() {
    super();
    this.variables = {
      latitude: 60,
      altitude: 50,
      meridianDistance: 60,
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

    p.Z = Point(0, 90);
    p.E = Point(0,0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.A = Point(-90, () => 90 - v.latitude);
    p.C = Point(90, () => v.latitude - 90);
    p.X = Point(90, () => v.latitude);
    p.K = distanceAlongArc(p.A, p.E, () => v.AK);
    p.H = Point(() => v.meridianDistance - 90, 0); 
    p.O = Point(() => v.meridianDistance - 90, () => v.altitude); 
    p.N = Point(-90, () => 90 - v.NZ);

    // *** Geometry ***
    g.equator = new Equator(p.X);
    g.ZH = new Arc(p.Z, p.H);
    g.HO = new Arc(p.H, p.O);
    g.NO = new Arc(p.N, p.O);
    g.XK = new Arc(p.X, p.K);
    g.OK = new Arc(p.O, p.K);

    g.ZNO = new RightAngle(p.N, p.Z, p.O);
    g.OKA = new RightAngle(p.K, p.O, p.A);
    g.ABE = new RightAngle(p.B, p.A, p.E);

    g.OH_label = new ArcLabel(p.O, p.H);
    g.NZO = new AngleElement(p.Z, () => v.altitude >= 0 ? p.N() : (v.meridianDistance <= 90 ? p.B : p.D), () => v.altitude >= 0 ? p.O() : p.H());
    g.NO_label = new ArcLabel(p.N, p.O);
    g.NZ_label = new ArcLabel(p.N, p.Z);
    g.ZX_label = new ArcLabel(p.Z, p.X);
    g.AK_label = new ArcLabel(p.A, p.K, { pole: p.X });
    g.OK_label = new ArcLabel(p.O, p.K);
     

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.NO = TriangleSolver.opposite(v.meridianDistance, 90 - v.altitude);
    v.NZ = TriangleSolver.adjacent(v.meridianDistance, 90 - v.altitude);
    if (v.meridianDistance > 90) v.NZ = 180 - v.NZ;

    v.NX = mod(v.NZ + 90 - v.latitude, 360);
    v.XO = acos(cos(v.NX) * cos(v.NO));
    v.AK = TriangleSolver.angleFromOppositeAndHypotenuse(v.NO, v.XO);
    if (v.NX > 180) v.AK = 180 - v.AK;

    this.setGeometryVisibility(v.showLabels, [ g.OH_label, g.NO_label, g.NZ_label, g.ZX_label, g.AK_label, g.OK_label, g.NZO ]);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.variables, 'latitude', 0, 90);
    gui.addSlider('Altitude', this.variables, 'altitude', -90, 90, { formatter: northSouthFormatter });
    gui.addSlider('Meridian Distance', this.variables, 'meridianDistance', 0, 180);
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


