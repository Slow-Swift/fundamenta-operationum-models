import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round, mod } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { ArcLabel, Label, northSouthFormatter } from "../geometry/label";
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
      latitude: 60,
      elevation: 40,
      obliquity: 23.5,
      showLabels: false,
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
    p.O_p = Point(0, () => 90 - v.ZDO);
    p.H = distanceAlongArc(p.D, p.O_p, () => v.DH);
    p.Q = distanceAlongArc(p.C, p.E, () => v.DZH);
    p.T = Point(-90, () => -v.latitude);
    p.O = distanceAlongArc(p.E, p.A, () => 90 - v.AO);

    // *** Geometry ***
    g.equator = new Equator(p.Z);
    g.BOD = new Arc(p.B, p.O_p, {length: 360});
    g.ZQ = new Arc(p.Z, p.Q);
    g.ZHD = new RightAngle(p.H, p.Z, p.D);

    g.ZH_label = new ArcLabel(p.Z, p.H);
    g.ZD_label = new ArcLabel(p.D, p.Z, { pole: p.E, formatter: northSouthFormatter });
    g.ZDH = new AngleElement(p.D, p.Z, p.H);
    g.AO_label = new ArcLabel(p.A, p.O, { pole: p.Z });

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.O_p, g.T, g.X]);
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

    this.setGeometryVisibility(v.showLabels, [g.ZD_label, g.ZDH, g.AO_label]);
    this.setGeometryVisibility(v.showLabels && v.elevation < v.latitude, [g.ZH_label]);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.variables, 'latitude', 0, 90, { formatter: northSouthFormatter });
    this.elevationSlider = gui.addSlider('Pole Elevation', this.variables, 'elevation', 0, 90);
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


