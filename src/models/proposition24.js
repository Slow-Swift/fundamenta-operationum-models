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
import { proposition13, proposition16, proposition17, proposition18, proposition2, proposition20, proposition22, proposition24, proposition5, proposition6, proposition7 } from "../math/propositions";

export class Proposition24 extends Model {

  constructor() {
    super();
    this.parameters = {
      time: 3,
      latitude: 30,
      obliquity: 23.5,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;

    const p = this.points = {};

    p.E = Point(0, 0);
    p.B = Point(-90, 0); // Horizon Left
    p.D = Point(90, 0);  // Horizon Right
    p.Z = Point(90, () => this.parameters.latitude);
    p.T = Point(-90, () => -this.parameters.latitude);
    p.A = Point(-90, () => 90 - this.parameters.latitude);
    p.C = Point(90, () => this.parameters.latitude - 90);
    p.L = distanceAlongArc(p.C, p.E, () => this.parameters.time * 180 / 12);
    p.K = Point(() => c.EK, 0);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(Point(0, 0)),
      horizon: new Equator(Point(0, 90)), 
      equator: new Equator(Point(90, () => this.parameters.latitude)),
      longitude: new Arc(p.Z, p.L, {length: 180}),

      ZDK: new RightAngle(p.D, p.Z, p.K),
      DCL: new RightAngle(p.C, p.D, p.L),
      KLE: new RightAngle(p.L, p.K, p.E),
      KZD: new AngleElement(p.Z, p.K, p.D),
    };

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;

    c.EK = TriangleSolver.hypoteneusFromAdjacent(90 - p.latitude, 90 - p.time * 180 / 12);
  }

  setupGui(gui) {
    gui.addSlider('Solar Time', this.parameters, 'time', 12);
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
  }

}


