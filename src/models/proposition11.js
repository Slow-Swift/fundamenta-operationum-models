import { distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { ArcLabel, degreeFormatter, Label, northSouthFormatter } from "../geometry/label";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";

export class Proposition11 extends Model {

  constructor() {
    super();

    this.parameters = {
      latitude: 40,
      oblique_ascension: 30,
      declination: 30,
      obliquity: 23.5,
      ortiveAmplitude: 40,
      arcLabels: false,
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
    p.P = distanceAlongSmallCircle(p.Z, p.L, 270, 90 - this.parameters.obliquity);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(p.E),
      horizon: new Equator(Point(0, 90)),
      equator: new Equator(p.Z),
      ecliptic: new Equator(p.P),
      EZ: new Equator(p.A),


      ELK: new AngleElement(p.L, p.K, p.E),
      EKL: new AngleElement(p.K, p.E, p.L),
      LEK: new RightAngle(p.E, p.L, p.K),

      KM: new Arc(p.M, p.K),
      EMK: new RightAngle(p.M, p.E, p.K),
      EKM: new AngleElement(p.K, p.M, p.E),

      MKQ: new AngleElement(p.K, p.Q, p.M),
      KQM: new AngleElement(p.Q, p.M, p.K),

      obliqueAscensionLabel: new ArcLabel(p.L, p.E, { pole: p.Z, shortest: false }),
      LE_label: new ArcLabel(p.L, p.E, { pole: p.Z }),
      KL_label: new Label(() => degreeFormatter(Math.abs(this.calculations.KL), 1), distanceAlongArc(p.L, p.K, () => Math.abs(this.calculations.KL / 2))),
      ZD_label: new Label(() => degreeFormatter(this.parameters.latitude), distanceAlongArc(p.D, p.Z, () => this.parameters.latitude / 2)),
      KQ: new Label(() => degreeFormatter(Math.abs(this.calculations.KQ), 1), distanceAlongArc(p.K, p.Q, () => Math.abs(this.calculations.KQ / 2))),
      KE: new ArcLabel(p.E, p.K),
    };

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.P]);
  }

  updateCalculations() {
    const p = this.parameters;
    const v = this.parameters;
    const g = this.geometry;
    const lat = p.latitude;
    const obl = p.oblique_ascension;

    const EKL = acos(cos(obl) * sin(this.parameters.obliquity));
    const KL = TriangleSolver.hypoteneusFromAdjacent(v.obliquity, v.oblique_ascension);
    const EK = asin(sin(KL) * sin(this.parameters.obliquity));
    const EKQ = 180 - EKL;

    const KM = asin(sin(lat) * sin(EK));
    const EM = acos(cos(EK) / cos(KM)) * (obl > 0 ? 1 : -1);
    
    const EKM = asin(cos(lat) / cos(KM));
    const MKQ = EKQ - EKM;
    const MQK = acos(sin(MKQ) * cos(KM));

    const KQ = TriangleSolver.hypoteneusFromAdjacent(MKQ, KM);
    // const KQ = MKQ > 90 ? (obl > 0 ? 180 : -180) - asin(sin(KM) / sin(MQK)) : asin(sin(KM) / sin(MQK));
    const LQ = KL + KQ;

    this.calculations.KL = KL;
    this.calculations.EK = EK;
    this.calculations.EM = EM * Math.sign(180 - v.oblique_ascension);
    this.calculations.KQ = KQ;
    this.calculations.LQ = LQ;

    this.setGeometryVisibility(!(v.oblique_ascension == 360 && v.latitude == 90 - v.obliquity), [g.Q, g.KQ, g.MKQ, g.KQM]);
    this.setGeometryVisibility(v.arcLabels, [g.KL_label, g.ZD_label,g.EKL, g.EKM, g.KQM, g.MKQ, g.KQ, g.ELK, g.obliqueAscensionLabel, g.KE, g.LE_label]);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90-this.parameters.obliquity);
    gui.addSlider('Oblique Ascension', this.parameters, 'oblique_ascension', 0, 360 );
    gui.addToggle('Show Labels', this.parameters, 'arcLabels');
  }

}
