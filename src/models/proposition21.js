import { angle, distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition13, proposition16, proposition17, proposition18, proposition2, proposition20, proposition21, proposition5, proposition6 } from "../math/propositions";

export class Proposition21 extends Model {

  constructor() {
    super();
    this.parameters = {
      midheavenLongitude: 40,
      latitude: 30,
      obliquity: 23.5,
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
      A_e: Point(-90, () => 90 - this.parameters.latitude),
      A: Point(-90, () => 90 - this.parameters.latitude + c.A_declination),
      C: Point(90, () => -90 + this.parameters.latitude - c.A_declination),
    };

    p.E_p = Point(90, () => this.parameters.latitude);
    p.V = distanceAlongArc(p.A_e, p.F, () => -c.A_rightAscension);
    p.V_p = distanceAlongSmallCircle(p.E_p, p.V, 270, () => 90 - this.parameters.obliquity);
    p.L = distanceAlongSmallCircle(p.V_p, p.A, () => c.AL, 0);
    p.M = distanceAlongArc(p.H, p.L, 90);
    p.E = distanceAlongSmallCircle(p.V_p, p.L, () => (p.M().x < 0 ? 1 : -1) * (c.HA < 0 ? -1 : 1) * 90, 0);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(Point(0, 0)),
      horizon: new Equator(Point(0, 90)), 
      equator: new Equator(Point(90, () => this.parameters.latitude), { thickness: 2 }),
      ecliptic: new Equator(p.V_p),

      HM: new Arc(p.H, p.M),
      HL: new Arc(p.H, p.L),

      HLA: new RightAngle(p.L, p.H, p.A),
    };

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.equator, g.F, g.V_p, g.E_p, g.V, g.A_e]);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;

    c.A_declination = proposition2(p.midheavenLongitude, p.obliquity);
    c.A_rightAscension = proposition5(p.midheavenLongitude, p.obliquity);
    c.HAL = proposition16(p.midheavenLongitude, p.obliquity);
    c.HA = p.latitude - c.A_declination;
    c.HL = TriangleSolver.opposite(c.HAL, c.HA);
    c.AL = c.HAL > 90 ? 360 - TriangleSolver.adjacent(c.HAL, c.HA) : TriangleSolver.adjacent(c.HAL, c.HA);
    if (c.HA < 0) c.AL = c.AL - 180;
  }

  setupGui(gui) {
    gui.addSlider('Midheaven Longitude', this.parameters, 'midheavenLongitude', -180, 180);
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
  }

}


