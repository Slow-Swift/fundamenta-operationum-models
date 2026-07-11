import { distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { Label } from "../geometry/label";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { SmallCircleArc } from "../geometry/small_circle_arc";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";

export class Proposition9 extends Model {

  constructor() {
    super();

    this.parameters = {
      latitude: 40,
      ecliptic_longitude: 30,
      declination: 30,
      obliquity: 23.5,
      ortiveAmplitude: 40,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;
    const p = this.points = {
      E:  Point(0, 0), // Horizon Centre
      B:  Point(-90, 0), // Horizon South
      D:  Point(90, 0), // Horizon North
      
      A:  Point(-90, () => 90 - this.parameters.latitude), // Equator Horizon Left
      C:  Point(90, () => this.parameters.latitude - 90), // Equator Horizon Right

      Z: Point(-90, () => -this.parameters.latitude), // South Pole
      X: Point(90, () => this.parameters.latitude), // North Pole
      H: Point(() => c.ortiveAmplitude, 0), // Intersection of Horizon and Ecliptic
      L: Point(-90, () => 90-this.parameters.latitude+c.declination), // Intersection of dirunal arc and Horizon
    };

    p.K = distanceAlongArc(p.Z, p.H, 90);
    p.V = distanceAlongArc(p.E, p.C, () => -c.EV);
    p.V_p = distanceAlongSmallCircle(p.X, p.V, 270, 90 - this.parameters.obliquity);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)),
      equator: new Equator(p.Z),
      ecliptic: new Equator(p.V_p, {thickness: 2}),
      meridian: new Equator(p.E),
      ZK: new Arc(p.Z, p.K, {end: 90}), 

      ortiveAmplitudeLabel: new Label(() => round(c.ortiveAmplitude, 1), Point(() => c.ortiveAmplitude / 2, 0)),
      declinationLabel: new Label(() => round(c.declination, 1), distanceAlongArc(this.points.H, this.points.K, () => Math.abs(c.declination/2))),
      EK_complement_label: new Label(() => round(c.EK_c, 1), distanceAlongArc(p.K, () => c.ortiveAmplitude < 0 ? p.A() : p.C(), () => Math.abs(c.EK_c /2))), 
      urnal_label: new Label(() => round(c.urnal, 1), distanceAlongSmallCircle(p.Z, p.H, () => c.urnal/2, () => -c.declination)),
      latitude: new SmallCircleArc(p.H, p.L, p.Z),
      latLabel: new Label(() => round(this.parameters.latitude, 1), distanceAlongArc(p.Z, p.B, () => this.parameters.latitude / 2)),
      latComplement: new Label(() => round(90 - this.parameters.latitude, 1), distanceAlongArc(p.B, p.A, () => (90 - this.parameters.latitude) / 2)),
      eclipticLongitudeLabel: new Label(() => round(this.parameters.ecliptic_longitude, 1), distanceAlongArc(p.V, p.H, () => Math.abs(this.parameters.ecliptic_longitude / 2))),

      // Angles
      angle_B: new RightAngle(p.B, p.A, p.E),
      angle_A: new RightAngle(p.A, Point(90, 45), p.E),
      angle_K: new RightAngle(p.K, p.E, p.H),
      angle_E: new AngleElement(p.E, p.H, p.K),
      angle_V: new AngleElement(p.V, p.E, p.H),
    };

    this.createPointGeometries(p);
    // this.setGeometryVisibility(false, [g.ecliptic, g.V_p, g.V, g.angle_V, g.eclipticLongitudeLabel]);
  }

  updateCalculations() {
    const p = this.parameters;
    const c = this.calculations;
    c.declination = TriangleSolver.opposite(p.obliquity, p.ecliptic_longitude); 
    c.ortiveAmplitude = TriangleSolver.hypoteneusFromOpposite(90 - p.latitude, c.declination);
    c.rightAscension = TriangleSolver.adjacent(p.obliquity, p.ecliptic_longitude);
    c.KE = TriangleSolver.adjacent(90 - p.latitude, c.ortiveAmplitude);
    c.EV = c.rightAscension - c.KE;
    console.log(c.rightAscension, c.KE, c.EV);

    c.EK_c = asin(sin(90-c.ortiveAmplitude)/sin(90-c.declination));
    c.urnal = c.ortiveAmplitude < 0 ? c.EK_c : 180-c.EK_c;
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90-this.parameters.obliquity);
    gui.addSlider('Ecliptic Longitude', this.parameters, 'ecliptic_longitude', -180, 180);
  }

}
