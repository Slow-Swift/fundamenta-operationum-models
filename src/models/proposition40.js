import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round, mod } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition14, proposition16, proposition2, proposition5 } from "../math/propositions";
import { LatitudeCircle } from "../geometry/latitude_circle";

export class Proposition40 extends Model {

  constructor() {
    super();
    this.variables = {
      sunRadius: 15,
      moonRadius: 12,
      latitude: 18,
      obliquity: 23.5,
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {};
    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
    };

    p.Z = Point(0, 90);
    p.C = Point(0,0);
    p.A = Point(0, () => v.latitude)
    p.B = Point(() => v.CB, 0);
    p.H = distanceAlongArc(p.A, p.B, -20);
    p.G = Point(-30, 0); 

    // *** Geometry ***
    g.ZC = new Arc(p.Z, p.C);
    g.sun = new LatitudeCircle(p.A, () => 90-v.sunRadius, {thickness: 2});
    g.moon = new LatitudeCircle(p.B, () => 90-v.moonRadius, {thickness: 2});
    g.GB = new Arc(p.B, p.G);
    g.HB = new Arc(p.B, p.H);
    g.ZB = new Arc(p.Z, p.B);

    g.ACB = new RightAngle(p.C, p.A, p.B);
    

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    this.latitudeSlider?.setRange(0, v.sunRadius + v.moonRadius);

    v.CB = TriangleSolver.thirdSide(v.sunRadius + v.moonRadius, v.latitude);
  }

  setupGui(gui) {
    gui.addSlider('Sun Radius', this.variables, 'sunRadius', 0, 20);
    gui.addSlider('Moon Radius', this.variables, 'moonRadius', 0, 20);
    this.latitudeSlider = gui.addSlider('latitude', this.variables, 'latitude', 0, 20);
  }

}


