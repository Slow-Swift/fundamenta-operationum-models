import { distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { LatitudeCircle } from "../geometry/latitude_circle";
import { sin, cos, tan, asin, acos, atan } from "../math/degMath";
import * as TriangleSolver from "../math/TriangleSolver";
import { RightAngle } from "../geometry/right_angle";
import { ArcLabel } from "../geometry/label";
import { AngleElement } from "../geometry/angle_element";


export class Proposition34 extends Model {

  constructor() {
    super();

    this.variables = {
      latitude_1: 30,
      declination: 30,
      obliquity: 23.5,
      latitude_2: 60,
      time: 0,
      longitude: 15,
      showLabels: false,
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {
    };

    p.X = Point(0, 90);
    p.E = Point(0,0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.Z = Point(90, () => v.latitude_1);
    p.A = Point(-90, () => 90-v.latitude_1);
    p.C = Point(90, () => v.latitude_1 - 90);
    p.H = Point(() => 90 + v.ZXH, () => 90 - v.XH);
    p.M = Point(() => 90 - v.ZXH, () => 90 - v.XH);
    p.P = () => v.XH != 0 ? distanceAlongArc(p.X, p.H(), -v.XO) : Point(0, 0);
    p.O = () => v.XH != 0 ? distanceAlongArc(p.X, p.M(), -v.XO) : Point(180, 0);
    p.T = distanceAlongSmallCircle(p.Z, p.X, () => -v.longitude, () => v.latitude_2);
    p.E_p = distanceAlongSmallCircle(p.Z, p.D, () => 180-v.time * 180 / 12, () => 90-v.obliquity);
    p.N = distanceAlongArc(p.Z, p.A, () => v.ZN);
    p.S = distanceAlongArc(p.X, p.T, () => -v.XS);
    p.K = distanceAlongArc(p.X, p.T, () => Number.isNaN(v.XK) ? 0 : v.XK);
    p.R = distanceAlongArc(p.X, p.T, () => v.XK - v.KL);
    p.L = distanceAlongArc(p.X, p.T, () => v.XK + v.KL);
    p.V = distanceAlongArc(p.K, distanceAlongSmallCircle(p.K, p.X, 90, 0), 90);
    p.Q = distanceAlongArc(p.H, p.X, -15);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)),
      meridian: new Equator(Point(0, 0)),
    };

    g.equator = new Equator(p.Z); 
    g.arcticCircle = new LatitudeCircle(p.Z, () => 90 - v.obliquity);
    g.XH = new Arc(p.P, p.H, { end: 20 });
    g.XM = new Arc(p.O, p.M, { end: 20 });
    g.ZM = new Arc(p.Z, p.M);
    g.ZH = new Arc(p.Z, p.H);
    g.SL = new Arc(p.S, p.L);
    g.XT = new Arc(p.X, p.T);
    g.TN = new Arc(p.T, p.N);
    g.TZ = new Arc(p.T, p.Z);
    g.KZ = new Arc(p.K, p.Z);
    g.ZR = new Arc(p.Z, p.R);
    g.ZL = new Arc(p.Z, p.L);
    g.LV = new Arc(p.L, p.V);
    g.RV = new Arc(p.R, p.V);

    g.ZHX = new RightAngle(p.H, p.Z, p.X);
    g.ZMX = new RightAngle(p.M, p.Z, p.X);
    g.TNX = new RightAngle(p.N, p.T, p.X);
    g.ZKT = new RightAngle(p.K, p.Z, p.T);
    g.XLV = new RightAngle(p.L, p.X, p.V, { maxdst: 4 });
    g.XRV = new RightAngle(p.R, p.X, p.V, { maxdst: 4 });

    g.tHorizon = new Equator(p.T, { thickness: 2, darkColor: 0xff0000});
    g.tMeridian = new Arc(p.T, p.Z, { length: 360, thickness: 2, darkColor: 0xff00ff})
    g.ecliptic = new Equator(p.E_p, { thickness: 2, darkColor: 0x0000ff });


    // Labels
    g.AX_label = new ArcLabel(p.A, p.X, { pole: p.E });
    g.AXO = new AngleElement(p.X, p.A, p.O);
    g.TZN = new AngleElement(p.Z, p.T, p.N);
    g.TZ_label = new ArcLabel(p.T, p.Z);
    g.TN_label = new ArcLabel(p.T, p.N);
    g.XN_label = new ArcLabel(p.X, p.N);
    g.TXN = new AngleElement(p.X, p.T, p.N);
    g.ZK_label = new ArcLabel(p.K, p.Z);
    g.ZLK = new AngleElement(p.L, p.Z, p.K);

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.ecliptic, g.tHorizon, g.tMeridian, g.E_p]);
  }

  updateCalculations() {
    const v = this.variables;
    const g= this.geometry;
    this.lat_x_slider?.setRange(0, 90-this.variables.obliquity);
    this.lat_t_slider?.setRange(this.variables.latitude_1, 90);

    v.ZXH = TriangleSolver.angleFromOppositeAndHypotenuse(v.obliquity, 90 - v.latitude_1); 
    v.XH = TriangleSolver.thirdSide(90 - v.latitude_1, v.obliquity);
    v.XO = TriangleSolver.hypoteneusFromAdjacent(v.ZXH, v.latitude_1);
    v.TN = TriangleSolver.opposite(v.longitude, 90 - v.latitude_2);
    v.ZN = TriangleSolver.adjacent(v.longitude, 90 - v.latitude_2);
    if (v.longitude > 90 && v.longitude < 270) v.TN = Math.sign(v.TN) * 180 - v.TN;
    if (v.longitude > 90 && v.longitude < 270) v.ZN = 180 - v.ZN;
    v.XN = 90 - v.latitude_1 - v.ZN;
    v.XT = acos(cos(v.XN) * cos(v.TN));
    v.TXN = TriangleSolver.angleFromOppositeAndHypotenuse(v.TN, v.XT); // This is NAN when T == X. 
    v.XS = TriangleSolver.hypoteneusFromAdjacent(v.TXN, v.latitude_1);
    v.XK = 90 - v.XS;
    v.ZK = TriangleSolver.opposite(v.TXN, 90 - v.latitude_1);
    v.KL = TriangleSolver.thirdSide(v.obliquity, v.ZK);

    this.setGeometryVisibility(v.showLabels, [g.AX_label, g.XN_label, g.TZ_label, g.ZK_label, g.TN_label, g.AXO, g.TZN, g.ZLK, g.TXN]);
  }

  setupGui(gui) {
    this.lat_x_slider = gui.addSlider('Latitude X', this.variables, 'latitude_1', 0, 90);
    this.lat_t_slider = gui.addSlider('Latitude T', this.variables, 'latitude_2', 0, 90);
    this.lon_slider = gui.addSlider('Longitude', this.variables, 'longitude', 0, 360);
    gui.addToggle('Show Labels', this.variables, 'showLabels');
    // gui.addSlider('Time', this.variables, 'time', 0, 24);
  }

}
