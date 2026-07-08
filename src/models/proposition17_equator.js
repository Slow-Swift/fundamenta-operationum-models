import { distanceAlongArc, Point } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";

export class Proposition17Equator extends Model {

  constructor() {
    super();
    this.parameters = {
      latitude: 40,
      ecliptic_longitude: 20,
      obliquity: 23.5,
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

      Z: () => Point(90, this.parameters.latitude),
      A: () => Point(-90, c.DC),
      C: () => Point(90, -c.DC),
    };

    p.L = distanceAlongArc(p.Z, p.E, 90);
    p.V = distanceAlongArc(p.L, Point(90, () => this.parameters.latitude - 90), () => -Math.sign(this.parameters.ecliptic_longitude) * c.rightAscension);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)), 
      ecliptic: new Arc(p.E, p.A, {length: 360}),
      equator: new Equator(p.Z),
      edge: new Equator(p.F),
      ZE: new Arc(p.Z, p.E),
      EL: new Arc(p.E, p.L),
      angleV: new AngleElement(p.V, p.E, p.L),
      angleD: new RightAngle(p.D, p.E, p.Z),
    };

    this.createPointGeometries(p);
    // this.setGeometryVisibility(false, [g.equator, g.V, g.L, g.angleV, g.F]);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;

    c.declination = asin(sin(p.obliquity) * sin(p.ecliptic_longitude));

    c.rightAscension = acos(cos(p.ecliptic_longitude) / cos(c.declination));
    c.FE = asin(sin(c.declination) / cos(p.latitude));
    c.FL = acos(cos(c.FE) / cos(c.declination));
    c.FV = c.rightAscension - c.FL;

    c.ZEC = asin(cos(p.obliquity) / cos(c.declination));
    c.ZED = asin(sin(p.latitude) / cos(c.declination));
    c.DEC = c.ZEC - c.ZED;
    c.DCE = acos(sin(c.FE) * sin(c.DEC));
    c.EC = asin(cos(c.FE) / sin(c.DCE));
    c.DC = asin(sin(c.EC) * sin(c.DEC));
  }

  setupGui(gui) {
    this.latitudeSlider = gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90-this.parameters.obliquity);
    gui.addSlider('Ecliptic Longitude', this.parameters, 'ecliptic_longitude', -90, 90);
  }

}


