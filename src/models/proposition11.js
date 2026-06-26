import { distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { Label } from "../geometry/label";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { LatitudeCircle } from "../geometry/latitude_circle";
import { SmallCircleArc } from "../geometry/small_circle_arc";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";

export class Proposition11 extends Model {

  constructor() {
    super();

    this.parameters = {
      latitude: 40,
      oblique_ascension: 30,
      declination: 30,
      obliquity: 23.5,
      ortiveAmplitude: 40,
    };

    this.calculations = {
      KL: 0,
      EK: 0,
      EM: 0,
      KQ: 0,
    }
  }

  createModel() {
    const p = this.points = { 
      E: Point(0, 0),
      B: Point(-90, 0),
      D: Point(90, 0),

      A: Point(-90, () => 90 - this.parameters.latitude),
      C: Point(90, () => -(90 - this.parameters.latitude)),

      Z: Point(90, () => this.parameters.latitude),
      H: Point(-90, () => -this.parameters.latitude),
    }

    p.K = distanceAlongArc(p.E, p.Z, () => this.calculations.EK);
    p.L = distanceAlongArc(p.E, p.A, () => this.parameters.oblique_ascension);
    p.M = Point(() => this.calculations.EM, 0);
    p.Q = distanceAlongArc(p.L, p.K, () => Math.abs(this.calculations.LQ));

    this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(p.E),
      horizon: new Equator(Point(0, 90)),
      equator: new Equator(p.Z),
      EZ: new Equator(p.A),

      LK: new Arc(p.L, p.K, {length:360}),

      ELK: new AngleElement(p.L, p.K, p.E),
      EKL: new AngleElement(p.K, p.E, p.L),
      LEK: new RightAngle(p.E, p.L, p.K),

      KM: new Arc(p.M, p.K),
      EMK: new RightAngle(p.M, p.E, p.K),
      EKM: new AngleElement(p.K, p.M, p.E),

      MKQ: new AngleElement(p.K, p.Q, p.M),
      KQM: new AngleElement(p.Q, p.M, p.K),

      obliqueAscensionLabel: new Label(() => this.parameters.oblique_ascension, distanceAlongArc(p.E, p.A, () => this.parameters.oblique_ascension / 2)),
      KL_label: new Label(() => round(this.calculations.KL, 1), distanceAlongArc(p.L, p.K, () => Math.abs(this.calculations.KL / 2))),
      ZD_label: new Label(() => this.parameters.latitude, distanceAlongArc(p.D, p.Z, () => this.parameters.latitude / 2)),
      KQ: new Label(() => round(this.calculations.KQ, 1), distanceAlongArc(p.K, p.Q, () => Math.abs(this.calculations.KQ / 2))),
    };

    this.createPointGeometries(p);
  }

  updateCalculations() {
    const p = this.points;
    const g = this.geometry;
    const lat = this.parameters.latitude;
    const obl = this.parameters.oblique_ascension;

    const EKL = acos(cos(obl) * sin(this.parameters.obliquity));
    const KL = asin(sin(obl) / sin(EKL));
    const EK = asin(sin(KL) * sin(this.parameters.obliquity));
    const EKQ = 180 - EKL;

    const KM = asin(sin(lat) * sin(EK));
    const EM = acos(cos(EK) / cos(KM)) * (obl > 0 ? 1 : -1);
    
    const EKM = asin(cos(lat) / cos(KM));
    const MKQ = EKQ - EKM;
    const MQK = acos(sin(MKQ) * cos(KM));

    const KQ = MKQ > 90 ? (obl > 0 ? 180 : -180) - asin(sin(KM) / sin(MQK)) : asin(sin(KM) / sin(MQK));
    console.log(asin(sin(KM) / sin(MQK)))

    const LQ = KL + KQ;

    this.calculations.KL = KL;
    this.calculations.EK = EK;
    this.calculations.EM = EM;
    this.calculations.KQ = KQ;
    this.calculations.LQ = LQ;

  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    gui.addSlider('Oblique Ascension', this.parameters, 'oblique_ascension', -90, 90);
  }

}
