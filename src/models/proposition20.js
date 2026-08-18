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
import { proposition13, proposition16, proposition17, proposition18, proposition2, proposition20, proposition5, proposition6 } from "../math/propositions";

export class Proposition20 extends Model {

  constructor() {
    super();
    this.parameters = {
      ascensionDistance: -20,
      altitude: 10,
      obliquity: 23.5,
      arcLabels: false,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;

    const p = this.points = {
      E: Point(0, 0),
      B: Point(-90, 0), // Horizon Left
      D: Point(90, 0),  // Horizon Right
      H: Point(0, 90), // Zenith
    };

    p.A = Point(-90, () => c.LEM);
    p.C = Point(90, () => -c.LEM);
    p.L = distanceAlongArc(p.E, p.A, () => -this.parameters.ascensionDistance);
    p.M = distanceAlongArc(p.H, p.L, 90);
    p.V_p = Point(90, () => 90 - c.LEM);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(p.E),
      horizon: new Equator(Point(0, 90)), 
      ecliptic: new Equator(p.V_p),
      HL: new Arc(p.H, p.L),
      HM: new Arc(p.H, p.M),
      HE: new Arc(p.H, p.E),
      LME: new RightAngle(p.M, p.L, p.E),
      HLC: new AngleElement(p.L, p.H, p.C),
    };

    g.LE_label = new ArcLabel(p.E, p.L, { pole: p.V_p, formatter: northSouthFormatter });
    g.LM_label = new ArcLabel(p.L, p.M, { formatter: northSouthFormatter});
    g.angleE = new AngleElement(p.E, p.L, p.M);

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.V_p]);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;
    const g = this.geometry;

    c.LEM = TriangleSolver.angleFromOppositeAndHypotenuse(p.altitude, -p.ascensionDistance);
    this.altitudeSlider?.setRange(-Math.abs(p.ascensionDistance), Math.abs(p.ascensionDistance));
    this.setGeometryVisibility(p.arcLabels, [g.LE_label, g.LM_label, g.angleE, g.HLC]);
    this.setGeometryVisibility(Math.abs(p.ascensionDistance) < 90, [g.HM, g.HL, g.M, g.LME]);
    this.setGeometryVisibility(Math.abs(p.ascensionDistance) < 90 && p.arcLabels, [g.HLC]);
  }

  setupGui(gui) {
    gui.addSlider('Distance from Ascension', this.parameters, 'ascensionDistance', -90, 90, { formatter: northSouthFormatter });
    this.altitudeSlider = gui.addSlider('Altitude', this.parameters, 'altitude', 0, 90, { formatter: northSouthFormatter });
    gui.addToggle('Show Labels', this.parameters, 'arcLabels');
    this.updateCalculations();
  }

}


