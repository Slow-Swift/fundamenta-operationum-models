import { distanceAlongArc, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { Label } from "../geometry/label";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";

export class Proposition3 extends Model {

  constructor() {
    super();

    this.parameters = {
      obliquity: 23.5,
      declination: 20,
      g_angle: 40,
    };
  }

  createModel() {
    const p = this.points = {
      E:  Point(0, 0), // Equator Centre
      A:  Point(90, 0), // Equator Horizon Right
      C:  Point(-90, 0), // Equator Horizon Left

      B: Point(), // Ecliptic-Horizon Right 
      D: Point(), // Ecliptic-Horizon Left

      F: Point(0, 90), // North Pole
      G: Point(),
      H: Point(),
    };


    this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      equator: new Equator(p.F), 
      ecliptic: new Arc(p.E, p.B, { length: 360 }),
      horizon: new Arc(p.F, p.A, { length: 360 }),
      FG: new Arc(p.F, p.G), 

      declinationLabel: new Label('0', Point()),
      angleA: new RightAngle(p.A, p.E, p.F),
      angleB: new RightAngle(p.B, p.E, Point(-90, 45)),
      angleH: new RightAngle(p.H, p.E, p.G),
      angleE: new AngleElement(p.E, p.G, p.H),
      g_angleLabel: new Label(),
    };

    this.createPointGeometries(p);
  }

  updateCalculations() {
    this.declinationSlider?.setRange(-this.parameters.obliquity, this.parameters.obliquity);
    this.points.B.copy(Point(90, this.parameters.obliquity));
    this.points.D.copy(Point(-90, -this.parameters.obliquity));

    const g_distance = TriangleSolver.hypoteneusFromOpposite(this.parameters.obliquity, this.parameters.declination);

    this.points.G.copy(distanceAlongArc(this.points.E, this.points.B, g_distance));
    this.points.H.copy(distanceAlongArc(this.points.F, this.points.G, 90));

    this.geometry.FG.point2 = g_distance > 0 ? this.points.H : this.points.G;

    const decLabelPos = distanceAlongArc(this.points.G, this.points.H, Math.abs(this.parameters.declination / 2));
    this.geometry.declinationLabel.position = decLabelPos;
    this.geometry.declinationLabel.text = this.parameters.declination;

    this.geometry.g_angleLabel.position = distanceAlongArc(this.points.E, this.points.B, g_distance/2);
    this.geometry.g_angleLabel.text = round(g_distance, 1);
  }

  setupGui(gui) {
    this.declinationSlider = gui.addSlider('Declination', this.parameters, 'declination', -90, 90);
  }

}
