import { distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { ArcLabel, Label, northSouthFormatter } from "../geometry/label";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import { round } from "../math/degMath";
import { sin, cos, tan, asin, acos, atan } from "../math/degMath";
import * as TriangleSolver from "../math/TriangleSolver";


export class Proposition5 extends Model {

  constructor() {
    super();

    this.parameters = {
      obliquity: 23.5,
      g_angle: 40,
      arcLabels: false,
    };
  }

  createModel() {
    const v = this.parameters;
    const p = this.points = {
      E:  Point(0, 0), // Equator Centre
      A:  Point(90, 0), // Equator Horizon Right
      C:  Point(-90, 0), // Equator Horizon Left

      B: Point(90, () => v.obliquity), // Ecliptic-Horizon Right 
      D: Point(-90, () => -v.obliquity), // Ecliptic-Horizon Left

      F: Point(0, 90), // North Pole
    };

    p.G = distanceAlongArc(p.E, p.B, () => v.g_angle);
    p.H = distanceAlongArc(p.F, p.G, 90);
    p.X = distanceAlongSmallCircle(p.F, p.H, -90);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      equator: new Equator(p.F), 
      ecliptic: new Arc(p.E, p.B, { length: 360 }),
      horizon: new Arc(p.F, p.A, { length: 360 }),
      FG: new Arc(p.F, p.G), 
      GH: new Arc(p.G, p.H),

      angleA: new RightAngle(p.A, p.E, p.F),
      angleB: new RightAngle(p.B, p.E, Point(-90, 45)),
      angleH: new RightAngle(p.H, p.E, p.G),
      angleE: new AngleElement(p.E, () => v.g_angle < 90 ? p.G() : p.B(), () => v.g_angle < 90 ? p.H() : p.A),
      
      longitudeLabel: new ArcLabel(p.E, p.G, { pole: Point(-90, 90 - v.obliquity), shortest: false }),
      declinationLabel: new ArcLabel(p.H, p.G, { pole: p.X, formatter: northSouthFormatter}),
      rightAscensionLabel: new ArcLabel(p.E, p.H, { pole: p.F, shortest: false }),
    };

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.X]);
  }

  updateCalculations() {
    const p = this.points;
    const v = this.parameters;
    const g = this.geometry;

    this.setGeometryVisibility(v.arcLabels, [g.angleE, g.longitudeLabel, g.declinationLabel, g.rightAscensionLabel]);
  }

  setupGui(gui) {
    gui.addSlider('Ecliptic Longitude', this.parameters, 'g_angle', 0, 360);
    gui.addToggle('Show Arc Labels', this.parameters, 'arcLabels');
  }

}
