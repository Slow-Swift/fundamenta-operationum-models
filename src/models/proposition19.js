import { angle, distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { ArcLabel, Label, northSouthFormatter } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition13, proposition16, proposition17, proposition18, proposition2, proposition5, proposition6 } from "../math/propositions";

export class Proposition19 extends Model {

  constructor() {
    super();
    this.parameters = {
      eclipticAltitude: 30,
      eclipticAngle: 50, 
      altitude: 10,
      latitude: 40,
      ecliptic_longitude: -0,
      obliquity: 23.5,
      time: 8,
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
      A: Point(-90, () => this.parameters.eclipticAltitude),
      C: Point(90, () => -this.parameters.eclipticAltitude),
    };

    p.V_p = distanceAlongSmallCircle(p.A, Point(-90, () => this.parameters.eclipticAltitude + 90), () => 90 - this.parameters.eclipticAngle, 0);
    p.E = distanceAlongArc(p.B, p.F, () => c.BE);
    p.K = distanceAlongSmallCircle(p.V_p, p.A, () => c.AK, 0);
    p.L = distanceAlongArc(p.K, p.E, () => c.KL);
    p.M = distanceAlongArc(p.H, p.L, 90);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)), 
      ecliptic: new Equator(p.V_p),
      edge: new Equator(p.F),
      HAE: new AngleElement(p.A, p.H, p.K),
      HK: new Arc(p.H, p.K),
      HL: new Arc(p.H, p.L),
      HM: new Arc(p.H, p.M),
      AKH: new RightAngle(p.K, p.A, p.H),
    };

    g.AB_label = new ArcLabel(p.A, p.B, { pole: p.F });
    g.LM_label = new ArcLabel(p.L, p.M, { pole: distanceAlongSmallCircle(p.H, p.M, 90, 0)});
    g.angleHLE = new AngleElement(p.L, p.H, distanceAlongSmallCircle(p.V_p, p.L, 90));

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.F, g.V_p]);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;
    const g = this.geometry;

    const AE = TriangleSolver.hypoteneusFromAdjacent(180 - p.eclipticAngle, p.eclipticAltitude);
    c.BE = TriangleSolver.opposite(180 - p.eclipticAngle, AE);

    c.AK = Math.abs(TriangleSolver.adjacent(p.eclipticAngle, 90 - p.eclipticAltitude));
    c.HK = TriangleSolver.opposite(p.eclipticAngle, 90 - p.eclipticAltitude);
    c.HLK = TriangleSolver.angleFromOppositeAndHypotenuse(c.HK, 90 - p.altitude);
    c.KL = TriangleSolver.adjacent(c.HLK, 90 - p.altitude);

    this.altitudeSlider?.setRange(-Math.abs(90 - c.HK), Math.abs(90-c.HK));

    this.setGeometryVisibility(p.arcLabels, [g.AB_label, g.LM_label, g.angleHLE, g.HAE]);
  }

  setupGui(gui) {
    gui.addSlider('Ecliptic Altitude', this.parameters, 'eclipticAltitude', 0, 90);
    gui.addSlider('Ecltitic Angle', this.parameters, 'eclipticAngle', 0, 90);
    this.altitudeSlider = gui.addSlider('Point Altitude', this.parameters, 'altitude', 0, 90, {formatter: northSouthFormatter});
    gui.addToggle('Show Labels', this.parameters, 'arcLabels');
    this.updateCalculations();
  }

}


