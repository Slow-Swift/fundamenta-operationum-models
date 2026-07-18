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

export class Proposition32 extends Model {

  constructor() {
    super();
    this.variables = {
      midheavenLongitude: 120,
      ascendantLongitude: 70,
      altitude: 30,
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

    p.G = Point(0,0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.P = Point(0, 90);
    p.A = Point(-90, () => v.BA);
    p.A_p = Point(-90, () => v.altitude + 90);
    p.A_c = distanceAlongSmallCircle(p.A, p.A_p, () => - v.ZAE, 0);
    p.Z = Point(90, () => v.ZD);
    p.V = distanceAlongArc(p.A, p.A_c, () => -v.midheavenLongitude);
    p.E = Point(() => v.BE - 90, 0); 

    // *** Geometry ***
    g.ecliptic = new Arc(p.A, p.A_c, {length: 360});
    g.ZD = new Arc(p.Z, p.E);
    g.equator = new Equator(p.Z);
    g.AVE = new AngleElement(p.V, p.A, p.G);
    g.ZAE = new AngleElement(p.A, p.A_p, p.E);

    this.createPointGeometries(p);
    // this.setGeometryVisibility(false, [g.A_p, g.A_c, g.V, g.equator, g.AVE]);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;

    v.ZAE = proposition16(v.midheavenLongitude, v.obliquity);
    v.BAE = 180 - v.ZAE;
    v.BE = TriangleSolver.opposite(v.BAE, v.ascendantLongitude);
    v.BA = TriangleSolver.adjacent(v.BAE, v.ascendantLongitude);

    v.VE = v.midheavenLongitude + v.AE;
    v.E_declination = proposition2(v.VE, v.obliquity);
    v.ZE = 90 - v.E_declination;
    v.ZD = TriangleSolver.thirdSide(v.ZE, 90-v.ascendantLongitude);
  }

  setupGui(gui) {
    gui.addSlider('Midheaven Ecliptic Longitude', this.variables, 'midheavenLongitude', -180, 180);
    this.ortiveSlider = gui.addSlider('Midheaven - Ascendant', this.variables, 'ascendantLongitude', 0, 180);
    gui.addSlider('Altitude', this.variables, 'altitude', -90, 90);
  }

}


