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
import { proposition2, proposition5 } from "../math/propositions";

export class Proposition29 extends Model {

  constructor() {
    super();
    this.variables = {
      obliqueAscension: 50,
      eclipticLongitude: 60,
      declination: 10,
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

    p.E = Point(0,0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.H = Point(() => v.EH, 0);
    p.Z = Point(90, () => v.latitude);
    p.A = Point(-90, () => 90 - v.latitude);
    p.C = Point(90, () => v.latitude - 90);
    p.L = distanceAlongArc(p.E, p.A, () => v.obliqueAscension);
    p.K = distanceAlongArc(p.E, p.C, () => v.EK);

    // *** Geometry ***
    g.equator = new Arc(p.E, p.C, {length: 360});
    g.ZK = new Arc(p.Z, p.K);
    g.HL = new Arc(p.L, p.H);

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;

    v.declination = proposition2(v.eclipticLongitude, v.obliquity);
    v.rightAscension = proposition5(v.eclipticLongitude, v.obliquity);

    v.EK = v.rightAscension - v.obliqueAscension;
    v.EH = TriangleSolver.hypoteneus(v.EK, v.declination);
    v.HEK = TriangleSolver.angleFromOppositeAndHypotenuse(v.declination, v.EH);
    if (v.EK < 0) v.HEK = 180 - v.HEK;
    v.latitude = 90 - v.HEK;
  }

  setupGui(gui) {
    gui.addSlider('Oblique Ascension', this.variables, 'obliqueAscension', 0.1, 90);
    gui.addSlider('Ecliptic Longitude', this.variables, 'eclipticLongitude', 0.1, 179);
  }

}


