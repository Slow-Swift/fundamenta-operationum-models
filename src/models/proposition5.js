import { distanceAlongArc, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { Label } from "../geometry/label";
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

      angleA: new RightAngle(p.A, p.E, p.F),
      angleB: new RightAngle(p.B, p.E, Point(-90, 45)),
      angleH: new RightAngle(p.H, p.E, p.G),
      angleE: new AngleElement(p.E, p.G, p.H),

      labelEG: new Label(),
      labelEH: new Label(),
      labelGH: new Label(),
    };

    this.createPointGeometries(p);
  }

  updateCalculations() {
    const p = this.points;
    const g = this.geometry;

    p.B.copy(Point(90, this.parameters.obliquity));
    p.D.copy(Point(-90, -this.parameters.obliquity));
    p.G.copy(distanceAlongArc(this.points.E, this.points.B, this.parameters.g_angle));
    p.H.copy(distanceAlongArc(this.points.F, this.points.G, 90));

    g.FG.point2 = this.parameters.g_angle > 0 ? this.points.H : this.points.G;

    g.labelEG.text = this.parameters.g_angle;
    g.labelEG.position = distanceAlongArc(p.E, p.B, this.parameters.g_angle / 2);

    const declination = TriangleSolver.opposite(this.parameters.obliquity, this.parameters.g_angle);
    g.labelGH.position = distanceAlongArc(this.points.G, this.points.H, Math.abs(declination) / 2);
    g.labelGH.text = round(declination, 1);

    const rightAscension = TriangleSolver.adjacent(this.parameters.obliquity, this.parameters.g_angle); 
    g.labelEH.text = round(rightAscension, 1);
    g.labelEH.position = distanceAlongArc(this.points.E, this.points.A, rightAscension/2);

  }

  setupGui(gui) {
    gui.addSlider('Ecliptic Longitude', this.parameters, 'g_angle', -179, 179);
  }

}
