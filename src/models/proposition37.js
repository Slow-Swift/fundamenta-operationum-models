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

export class Proposition37 extends Model {

  constructor() {
    super();
    this.variables = {
      latitude: 40,
      elevation: 60,
      obliquity: 23.5,
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {};
    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(Point(0, 0)),
      horizon: new Equator(Point(0, 90)),
    };

    p.X = Point(0, 90);
    p.V = Point(0, -90);
    p.E = Point(0,0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.A = Point(-90, () => 90 - v.latitude);
    p.C = Point(90, () => v.latitude - 90);
    p.Z = Point(90, () => v.latitude);
    p.T = Point(-90, () => -v.latitude);

    p.K = Point(0, () => 90 - v.elevation);

    p.H = distanceAlongArc(p.D, p.K, () => v.DH);
    p.O = distanceAlongArc(p.E, p.A, () => 90 - v.AO);

    // *** Geometry ***
    g.equator = new Equator(p.Z);
    g.BOD = new Arc(p.B, p.K, {length: 360});
    g.XK = new Arc(p.X, p.E, {length: 360});
    g.ZH = new Arc(p.Z, p.H);
    g.ZHD = new RightAngle(p.H, p.Z, p.D);

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.T]);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.ZH = TriangleSolver.opposite(v.elevation, v.latitude);
    v.DH = TriangleSolver.adjacent(v.elevation, v.latitude);
    v.AO = acos(cos(v.elevation) / cos(v.ZH));
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.variables, 'latitude', 0, 90);
    this.elevationSlider = gui.addSlider('Zenith Elevation', this.variables, 'elevation', 0, 90);
  }

}


