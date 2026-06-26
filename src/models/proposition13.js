import { distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { Label } from "../geometry/label";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { LatitudeCircle } from "../geometry/latitude_circle";
import { SmallCircleArc } from "../geometry/small_circle_arc";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";

export class Proposition13 extends Model {

  constructor() {
    super();

    this.parameters = {
      latitude: 52.9,
      declination: 20,
      time: 0,
      obliquity: 23.5,
    };

    this.calculations = { }
  }

  createModel() {
    const p = this.points = { }
    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
    };

    /// *** Points *** ///

    p.E = Point(0, 0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);

    p.A = Point(-90, () => 90 - this.parameters.latitude);
    p.C = Point(90, () => this.parameters.latitude - 90);
    p.Z = Point(90, () => this.parameters.latitude);

    p.H = Point(0, 90);

    p.M = distanceAlongArc(p.C, p.E, () => this.parameters.time / 12 * 180);
    p.O = distanceAlongArc(p.M, p.Z, () => this.parameters.declination);
    p.K = distanceAlongArc(p.H, p.O, 90);
    p.L = distanceAlongArc(p.E, p.D, () => this.calculations.EL);
    p.P = distanceAlongSmallCircle(p.H, p.L, 90, 0); 
    p.N = distanceAlongArc(p.H, p.P, () => this.calculations.HN);
    /// *** Geometry *** ///

    g.meridian = new Equator(p.E);
    g.horizon = new Equator(p.H);
    g.equator = new Equator(p.Z);
    g.MZ = new Arc(p.M, p.Z);
    g.HK = new Arc(p.H, p.K);
    g.ZN = new Arc(p.Z, p.N);
    g.HP = new Arc(p.H, p.P);
    g.OK = new Arc(p.O, p.K);
    g.OM = new Arc(p.O, p.M);
    g.LM = new Arc(p.L, p.M);


    /// *** Angles *** ///
    g.AMZ = new RightAngle(p.M, distanceAlongSmallCircle(p.Z, p.M, -90, 0), p.Z);
    g.OZD = new AngleElement(p.Z, p.D, p.O);
    g.HNZ = new RightAngle(p.N, p.Z, p.H);
    g.HPL = new RightAngle(p.P, p.L, p.H);
    g.OLK = new AngleElement(p.L, p.O, p.K);
    g.ZDL = new RightAngle(p.D, p.L, p.Z);
    g.OKL = new RightAngle(p.K, p.L, p.O);


    /// *** Labels *** ///
    g.ZD_label = new Label(() => round(this.parameters.latitude, 1), distanceAlongArc(p.Z, p.D, () => this.parameters.latitude / 2));
    g.MC_label = new Label(() => round(this.parameters.time / 6 * 90, 1), distanceAlongArc(p.C, p.E, () => this.parameters.time / 6 * 90 / 2));
    g.HC_label = new Label(() => round(this.calculations.HN, 1), distanceAlongArc(p.H, p.N, () => this.calculations.HN / 2));
    g.NP_label = new Label(() => round(90 - this.calculations.HN, 1), distanceAlongArc(p.N, p.P, () => (90 - this.calculations.HN) / 2));
    g.LZ_label = new Label(() => round(this.calculations.ZL, 1), distanceAlongArc(p.L, p.Z, () => this.calculations.ZL / 2));
    g.OK_label = new Label(() => round(this.calculations.OK, 1), distanceAlongArc(p.O, p.K, () => Math.abs(this.calculations.OK / 2)));

    this.createPointGeometries(p);
  }

  updateCalculations() {
    const p = this.parameters;
    const c = this.calculations;

    const EM = 90 - p.time / 6 * 90;
    const ELM = acos(cos(EM) * sin(90 - p.latitude));
    c.EL = asin(sin(EM) / sin(ELM));

    const MC = this.parameters.time / 6 * 90;

    c.HN = asin(sin(90 - p.latitude) * sin(MC));
    c.ZL = this.parameters.time > 6 ? 180 - asin(sin(p.latitude) / sin(90 - c.HN)) : asin(sin(p.latitude) / sin(90 - c.HN));

    const LO = c.ZL - (90 - p.declination);
    c.OK = asin(sin(90 - c.HN) * sin(LO));
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    gui.addSlider('Declination', this.parameters, 'declination', -23.5, 23.5);
    gui.addSlider('Time', this.parameters, 'time', 0, 12);
  }

}
