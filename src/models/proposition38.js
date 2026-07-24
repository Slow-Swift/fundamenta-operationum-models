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

export class Proposition38 extends Model {

  constructor() {
    super();
    this.variables = {
      latitudeX: 50,
      latitudeH: 20,
      longitude: 60,
      obliquity: 23.5,
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {};
    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(Point(0, 0)),
    };

    p.X = Point(0, 90);
    p.E = Point(0,0);
    p.A = Point(-90, () => 90 - v.latitudeX);
    p.B = Point(90, () => v.latitudeX - 90);
    p.Z = Point(90, () => v.latitudeX);
    p.L = distanceAlongArc(p.A, p.E, () => v.longitude);
    p.H = distanceAlongArc(p.L, p.Z, () => v.latitudeH);
    p.K = () => v.latitudeH >= 0 ? Point(90, v.latitudeX + v.ZK) : distanceAlongArc(p.Z(), p.L(), v.ZK);

    // *** Geometry ***
    g.equator = new Equator(p.Z);
    g.ZL = new Arc(p.Z, p.L);
    g.LH = new Arc(p.L, p.H);
    g.XH = new Arc(p.X, p.H);
    g.HK = new Arc(p.H, p.K);
    g.ZK = new Arc(p.Z, p.K);
    g.XK = new Arc(p.X, p.K);

    g.ZAL = new RightAngle(p.A, p.Z, p.L);
    g.XKH = new RightAngle(p.K, p.X, p.H);
    g.ALZ = new RightAngle(p.L, p.Z, p.A);

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.E])
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;
    
    if (v.latitudeH >= 0) {
      v.ZK = TriangleSolver.adjacent(v.longitude, 90 - v.latitudeH);
      if (v.longitude > 90) v.ZK = 180 - v.ZK;
      if (v.latitudeH == 90) v.ZK = 0;
    } else {
      v.ZK = TriangleSolver.adjacent(v.longitude, 90 - v.latitudeX);
      if (v.longitude > 90) v.ZK = 180 - v.ZK;
    }

    this.setGeometryVisibility(v.latitudeH >= 0, [ g.HK ]);
    this.setGeometryVisibility(v.latitudeH < 0, [ g.ZK, g.XK ]);
    this.setGeometryVisibility(p.H().dot(p.X) > -1, [g.XH]);
  }

  setupGui(gui) {
    gui.addSlider('Latitude X', this.variables, 'latitudeX', 0, 90);
    gui.addSlider('Latitude H', this.variables, 'latitudeH', -90, 90);
    gui.addSlider('Delta Longitude', this.variables, 'longitude', 0, 180);
  }

}


