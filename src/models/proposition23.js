import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, pole, smallCircleArc } from "../math/spherical";
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
import { proposition13, proposition16, proposition17, proposition18, proposition2, proposition20, proposition22, proposition5, proposition6, proposition7 } from "../math/propositions";

export class Proposition23 extends Model {

  constructor() {
    super();
    this.parameters = {
      midheavenAltitude: 30,
      midheavenDistance: 120, 
      sunDistance: 60,
      obliquity: 23.5,
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
      A: Point(-90, () => this.parameters.midheavenAltitude),
      C: Point(90, () => -this.parameters.midheavenAltitude),
      E: Point(() => c.BE - 90, 0),
    };

    p.N = Point(() => c.BE - 180, 0);
    p.K = Point(() => c.BE - 180, () => c.KN);
    p.L = distanceAlongArc(p.E, p.K, () => this.parameters.sunDistance);
    p.M = distanceAlongArc(p.H, p.L, 90);
    p.V_p = pole(p.K, p.E);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(Point(0, 0)),
      horizon: new Equator(Point(0, 90)),
      ecliptic: new Arc(p.E, p.K, {length: 360}),

      HN: new Arc(p.H, p.N),
      NK: new Arc(p.N, p.K),
      HL: new Arc(p.H, p.L),
      HM: new Arc(p.H, p.M),

      DEC: new AngleElement(p.E, p.D, p.C),
      ABN: new RightAngle(p.B, p.A, p.N),
      HKA: new RightAngle(p.K, p.H, p.A),
      KNB: new RightAngle(p.N, p.K, p.B),
      LME: new RightAngle(p.M, p.L, p.E),
    };

    g.AB = new ArcLabel(p.A, p.B, { pole: p.F });
    g.DC = new ArcLabel(p.C, p.D, { pole: p.F });
    g.EC = new ArcLabel(p.E, p.C, { pole: p.V_p });
    g.LM = new ArcLabel(p.L, p.M, { pole: distanceAlongSmallCircle(p.H, p.M, 90, 0), formatter: northSouthFormatter });
    g.LE = new ArcLabel(p.L, p.E, { pole: p.V_p, shortest: false });

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [ g.F, g.V_p ]);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;
    const g = this.geometry;
    
    this.altitudeSlider?.setRange(-Math.min(p.midheavenDistance, 180 - p.midheavenDistance), Math.min(p.midheavenDistance, 180 - p.midheavenDistance));
    c.BE = TriangleSolver.thirdSide(p.midheavenDistance, p.midheavenAltitude);
    c.KN = TriangleSolver.angleFromOppositeAndHypotenuse(p.midheavenAltitude, 180-p.midheavenDistance);
    if (p.midheavenDistance % 180 == 0) c.KN = 90;
    c.LM = TriangleSolver.opposite(c.KN, p.sunDistance);

    this.setGeometryVisibility(p.arcLabels, [ g.AB, g.DC, g.EC, g.LM ,g.LE, g.DEC ]);
  }

  setupGui(gui) {
    gui.addSlider('Midheaven to Ascendent', this.parameters, 'midheavenDistance', 0, 180);
    this.altitudeSlider = gui.addSlider('Midheaven Altitude', this.parameters, 'midheavenAltitude', -90, 90, { formatter: northSouthFormatter });
    gui.addSlider('Sun to Ascendent', this.parameters, 'sunDistance', 0, 360);
    gui.addToggle('Show Labels', this.parameters, 'arcLabels');
  }

}


