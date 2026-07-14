import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
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
import { proposition13, proposition16, proposition17, proposition18, proposition2, proposition20, proposition22, proposition5, proposition6, proposition7 } from "../math/propositions";

export class Proposition22 extends Model {

  constructor() {
    super();
    this.parameters = {
      ascendentLongitude: 40,
      latitude: 30,
      obliquity: 23.5,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;

    const p = this.points = {
      O: Point(0, 0),
      B: Point(-90, 0), // Horizon Left
      D: Point(90, 0),  // Horizon Right
      H: Point(0, 90), // Zenith
      A_e: Point(-90, () => 90 - this.parameters.latitude),
      A: Point(-90, () => 90 - this.parameters.latitude + c.A_declination),
      C: Point(90, () => -90 + this.parameters.latitude - c.A_declination),
    };

    p.E = Point(() => c.E_ortiveAmplitude, 0);
    p.E_2 = distanceAlongSmallCircle(p.E, Point(() => c.E_ortiveAmplitude + 90, 0), () => -c.LEM, 0);
    p.V = distanceAlongArc(p.E, p.E_2, () => -this.parameters.ascendentLongitude);
    p.L = distanceAlongArc(p.E, p.E_2, -90);
    p.M = Point(() => -90 + c.E_ortiveAmplitude, 0);
    p.A = distanceAlongArc(p.E, p.E_2, () => -c.AE);
    p.C = distanceAlongArc(p.E, p.E_2, () => 180-c.AE);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(Point(0, 0)),
      horizon: new Equator(Point(0, 90)), 
      equator: new Equator(Point(90, () => this.parameters.latitude), { thickness: 2 }),
      ecliptic: new Arc(p.E, p.E_2, {length: 360}),
      
      HM: new Arc(p.H, p.M),
      HL: new Arc(p.H, p.L),
      HLA: new RightAngle(p.L, p.H, p.A),
      LMB: new RightAngle(p.M, p.L, p.B),
    };

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.equator, g.E_2, g.V, g.A_e]);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;

    c.E_declination = proposition2(p.ascendentLongitude, p.obliquity);
    c.E_ortiveAmplitude = proposition7(c.E_declination, p.latitude);
    c.LEM = proposition17(p.ascendentLongitude, p.latitude, p.obliquity);
    c.AL = TriangleSolver.opposite(c.E_ortiveAmplitude, 90 - c.LEM);
    c.AE = 90 + c.AL;
  }

  setupGui(gui) {
    gui.addSlider('Ascendent Longitude', this.parameters, 'ascendentLongitude', -180, 180);
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90-this.parameters.obliquity);
  }

}


