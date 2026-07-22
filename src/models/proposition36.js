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

export class Proposition36 extends Model {

  constructor() {
    super();
    this.variables = {
      latitude: 40,
      elevation: 20,
      meridianDistance: 90,
      declination: 20,
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
    p.E = Point(0,0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.A = Point(-90, () => 90 - v.latitude);
    p.C = Point(90, () => v.latitude - 90);
    p.Z = Point(90, () => v.latitude);
    // p.K = distanceAlongArc(p.A, p.E, () => v.meridianDistance);
    // p.O = distanceAlongArc(p.K, p.Z, () => v.declination);
    // p.M = Point(90, () => v.DM);
    p.O_p = Point(0, () => 90 - v.ZDO);
    p.H = distanceAlongArc(p.D, p.O_p, () => v.DH);
    p.Q = distanceAlongArc(p.C, p.E, () => v.DZH);
    p.T = Point(-90, () => -v.latitude);
    p.O = distanceAlongArc(p.E, p.A, () => 90 - v.AO);

    // *** Geometry ***
    g.equator = new Equator(p.Z);
    // g.ZK = new Arc(p.Z, p.K);
    // g.OM = new Arc(p.O, p.M);
    g.BOD = new Arc(p.B, p.O_p, {length: 360});
    g.ZQ = new Arc(p.Z, p.Q);
    // g.TK = new Arc(p.T, p.K);
    //
    // g.ZMO = new RightAngle(p.M, Point(90, () => v.DM - 90), p.O);
    g.ZHD = new RightAngle(p.H, p.Z, p.D);

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    this.elevationSlider?.setRange(0, v.latitude);

    v.ZDO = TriangleSolver.angleFromOppositeAndHypotenuse(v.elevation, v.latitude);
    v.DH = TriangleSolver.adjacent(v.ZDO, v.latitude);
    v.DZH = TriangleSolver.oppositeAngle(v.ZDO, v.DH);
    v.AO = acos(cos(v.ZDO) / cos(v.elevation));
    
    // v.OM = TriangleSolver.opposite(v.meridianDistance, 90 - v.declination);
    // v.ZM = TriangleSolver.adjacent(v.meridianDistance, 90 - v.declination);
    // if (v.meridianDistance > 90) v.OM = 180 - v.OM;
    // if (v.meridianDistance > 90) v.ZM = 180 - v.ZM;
    // v.DM = mod(v.latitude + v.ZM, 360);
    // v.DO = acos(cos(v.DM) * cos(v.OM));
    // v.MDO = TriangleSolver.angleFromOppositeAndHypotenuse(v.OM, v.DO);
    // v.ZH = TriangleSolver.opposite(v.MDO, v.latitude);
    // v.DH = v.ZH == 90 ? 90 : TriangleSolver.thirdSide(v.latitude, v.ZH);
    // if (v.DM > 180) v.DH = 180 - v.DH;

    // this.setGeometryVisibility(!(v.meridianDistance == 0 || v.meridianDistance == 180), [g.H, g.ZHO, g.ZH]);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.variables, 'latitude', 0, 90);
    this.elevationSlider = gui.addSlider('Elevation', this.variables, 'elevation', 0, 90);
    // gui.addSlider('Meridian Distance', this.variables, 'meridianDistance', 0, 180);
    // gui.addSlider('Declination', this.variables, 'declination', -this.variables.obliquity, this.variables.obliquity);
  }

}


