import { distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";

export class Proposition18 extends Model {

  constructor() {
    super();
    this.parameters = {
      latitude: 40,
      ecliptic_longitude: -0,
      obliquity: 23.5,
      time: 8,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;

    const p = this.points = {
      F: Point(0, 0),
      E: Point(() => c.FE, 0),   // Horizon Centre
      B: Point(-90, 0), // Horizon Left
      D: Point(90, 0),  // Horizon Right
      H: Point(0, 90), // Zenith
      C_p: Point(90, () => -90 + this.parameters.latitude),

      Z: () => Point(90, this.parameters.latitude),
    };

    p.K_p= distanceAlongArc(p.C_p, p.E, () => this.parameters.time / 12 * 180);
    p.K = distanceAlongArc(p.Z, p.K_p, () => 90 - c.declination);
    p.V = distanceAlongArc(p.K_p, p.C_p, () => -Math.sign(this.parameters.ecliptic_longitude) * c.rightAscension);
    p.V_p = distanceAlongSmallCircle(p.Z, p.V, 270, 90 - this.parameters.obliquity);
    p.L = distanceAlongArc(p.H, p.K, 90);
    p.X = distanceAlongArc(p.Z, p.K, () => this.parameters.time >= 6 ? c.ZX : -c.ZX);
    // p.A = distanceAlongSmallCircle(p.V_p, p.V, () => -c.VA, 0);

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
      HK: new Arc(p.H, p.X),

      angleX: new RightAngle(p.X, p.H, p.Z),
      angleL: new RightAngle(p.L, p.K, p.E),
      angleB: new RightAngle(p.B, p.H, p.E),
    };

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.equator, g.C_p, g.K_p, g.V_p, g.V]);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;
    const zAngle = 180 - p.time * 180 / 12;

    c.declination = asin(sin(p.obliquity) * sin(p.ecliptic_longitude));
    c.rightAscension = acos(cos(p.ecliptic_longitude) / cos(c.declination));
    c.HX = asin(sin(zAngle) * cos(p.latitude));
    c.ZX = acos(sin(p.latitude) / cos(c.HX));
    c.A = acos(cos(zAngle + c.rightAscension) * sin(p.obliquity));
    c.VA = asin(sin(zAngle + c.rightAscension) / sin(c.A));
  }

  setupGui(gui) {
    this.latitudeSlider = gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90-this.parameters.obliquity);
    gui.addSlider('Ecliptic Longitude', this.parameters, 'ecliptic_longitude', -90, 90);
    gui.addSlider('Time', this.parameters, 'time', 6, 12);
  }

}


