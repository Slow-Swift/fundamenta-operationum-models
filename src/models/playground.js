import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition16, proposition2, proposition5 } from "../math/propositions";

export class Playground extends Model {

  constructor() {
    super();
    this.variables = {
      latitude: 45,
      time: 8,
      eclipticLongitude: 0,
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

    // Horizon
    p.E = Point(0,0);
    p.W = Point(180, 0);
    p.S = Point(-90, 0);
    p.N = Point(90, 0);

    p.Z = Point(90, () => v.latitude);
    p.X = Point(-90, () => -v.latitude);
    p.H = Point(0, 90);
    p.V = distanceAlongSmallCircle(p.Z, p.E, () => -v.time * 180 / 12 + 90, 0);
    p.V_c = distanceAlongSmallCircle(p.Z, p.E, () => -v.time * 180 / 12 + 180, 0);
    p.V_p = distanceAlongSmallCircle(p.V, p.V_c, () => v.obliquity, 0);
    p.G = distanceAlongArc(p.V, p.V_p, () => v.eclipticLongitude);

    // *** Geometry ***
    g.equator = new Equator(p.Z);
    g.ecliptic = new Arc(p.V, p.V_p, { length: 360 });

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.variables, 'latitude', -90, 90);
    gui.addSlider('Time', this.variables, 'time', 0, 24);
    gui.addSlider('Ecliptic Longitude', this.variables, 'eclipticLongitude', -180, 180);
  }

}


