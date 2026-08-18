import { angle, distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { ArcLabel, Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition13, proposition16, proposition17, proposition18, proposition2, proposition5, proposition6 } from "../math/propositions";

export class Proposition18 extends Model {

  constructor() {
    super();
    this.parameters = {
      latitude: 40,
      ecliptic_longitude: -0,
      obliquity: 23.5,
      time: 8,
      showEquator: false,
      arcLabels: false,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;

    const p = this.points = {
      F: Point(0, 0),
      B: Point(-90, 0), // Horizon Left
      D: Point(90, 0),  // Horizon Right
      H: Point(0, 90), // Zenith
      C_p: Point(90, () => -90 + this.parameters.latitude),

      Z: () => Point(90, this.parameters.latitude),
    };

    p.K_p= distanceAlongArc(p.C_p, p.F, () => this.parameters.time / 12 * 180);
    p.K = distanceAlongArc(p.Z, p.K_p, () => 90 - c.declination);
    p.V = distanceAlongSmallCircle(p.Z, p.K_p, () => -c.rightAscension);
    p.V_p = distanceAlongSmallCircle(p.Z, p.V, 270, 90 - this.parameters.obliquity);
    p.L = distanceAlongArc(p.H, p.K, 90);
    p.X = distanceAlongArc(p.Z, p.K, () => c.ZX);
    p.A = distanceAlongSmallCircle(p.V_p, p.V, () => -c.VA, 0);
    p.C = distanceAlongSmallCircle(p.V_p, p.V, () => 180 - c.VA, 0);
    p.E = distanceAlongSmallCircle(p.V_p, p.K, () => c.EK);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)), 
      ecliptic: new Equator(p.V_p),
      equator: new Equator(p.Z, {thickness: 2}),
      edge: new Equator(p.F),
      HK: new Arc(p.H, p.K),
      HL: new Arc(p.H, p.L),
      LK: new Arc(p.L, p.K),
      ZK: new Arc(p.Z, p.K),
      ZX: new Arc(p.Z, p.X),
      HX: new Arc(p.H, p.X),

      angleX: new RightAngle(p.X, p.H, p.Z),
      angleL: new RightAngle(p.L, p.K, p.F),
      angleB: new RightAngle(p.B, p.H, p.F),
      angleV: new AngleElement(p.V, distanceAlongSmallCircle(p.V_p, p.V, 90, 0), distanceAlongSmallCircle(p.Z, p.V, 90, 0)),
      angleZ: new AngleElement(p.Z, p.H, p.X),
      angleHKX: new AngleElement(p.K, p.H, p.Z),
      angleZKE: new AngleElement(p.K, p.Z, distanceAlongSmallCircle(p.V_p, p.K, 90)),
      labelVK: new ArcLabel(p.V, p.K, { pole: p.V_p, shortest: false}),
      labelZD: new ArcLabel(p.Z, p.D, { pole: p.F }),
    };

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.V_p, g.C_p, g.K_p]);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;
    const g = this.geometry;
    const zAngle = 180 - p.time * 180 / 12;

    c.declination = proposition2(p.ecliptic_longitude, p.obliquity);
    c.rightAscension = proposition5(p.ecliptic_longitude, p.obliquity);
    if (p.ecliptic_longitude > 180) c.rightAscension = 360 - c.rightAscension;
    c.altitude = proposition13(c.declination, zAngle, p.latitude);
    c.HK = 90 - c.altitude;

    c.HX = TriangleSolver.opposite(zAngle, 90 - p.latitude); 
    if (zAngle > 90) c.HX = 180 - c.HX;
    c.ZX = TriangleSolver.adjacent(zAngle, 90 - p.latitude); 
    if (zAngle > 90) c.ZX = -180 - c.ZX;
    c.HKX = TriangleSolver.angleFromOppositeAndHypotenuse(c.HX, c.HK);
    c.ZKE = proposition16(p.ecliptic_longitude, p.obliquity);
    c.HKE = c.HKX + c.ZKE;

    const VA_p = zAngle - c.rightAscension;
    c.VA = proposition6(VA_p, p.obliquity);

    const EKL = 180 - c.HKE;
    c.EK = TriangleSolver.hypoteneusFromAdjacent(EKL, c.altitude);

    this.setGeometryVisibility(p.showEquator, [g.equator, g.V, g.F]);
    this.setGeometryVisibility(p.arcLabels, [g.angleHKX, g.angleZKE, g.labelZD, g.angleZ]);
    this.setGeometryVisibility(p.showEquator && p.arcLabels, [g.angleV, g.labelVK]);
  }

  setupGui(gui) {
    this.latitudeSlider = gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90-this.parameters.obliquity);
    gui.addSlider('Ecliptic Longitude', this.parameters, 'ecliptic_longitude', 0, 360);
    gui.addSlider('Time', this.parameters, 'time', 0, 12, { formatter: (t) => round(t, 1).toString()});
    gui.addToggle('Show Equator', this.parameters, 'showEquator');
    gui.addToggle('Show Labels', this.parameters, 'arcLabels');
  }

}


