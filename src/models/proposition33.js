import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
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

export class Proposition33 extends Model {

  constructor() {
    super();
    this.variables = {
      latitude: 30,
      hLongitude: 80,
      kLongitude: 30,
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

    p.E = Point(0,0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.A = Point(0, 90);
    p.C = Point(0, -90);
    p.Z = Point(90, () => v.latitude);
    p.H = Point(0, () => v.EH);
    p.K = Point(0, () => v.EK);

    // *** Geometry ***
    g.eastCircle = new Equator(p.D);
    g.LK = new Arc(p.Z, p.K);
    g.LH = new Arc(p.Z, p.H);

    g.EAZ = new RightAngle(p.A, p.E, p.Z);
    g.AED = new RightAngle(p.E, p.A, p.D);

    g.AH_label = new ArcLabel(p.A, p.H, { pole: p.D });
    g.HZ_label =  new ArcLabel(p.H, p.Z);
    g.KZ_label = new ArcLabel(p.K, p.Z);
    g.HK_label = new ArcLabel(p.H, p.K);
    g.ZD_label = new ArcLabel(p.D, p.Z, { pole: p.E, formatter: northSouthFormatter });
    g.AZH = new AngleElement(p.Z, p.A, p.H, { maxdistance: 9});
    g.HZK = new AngleElement(p.Z, p.H, p.K);
    

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.declinationH = proposition2(v.hLongitude, v.obliquity);
    v.declinationK = proposition2(v.kLongitude, v.obliquity);
    v.EH = proposition14(v.declinationH, v.latitude);
    v.EK = proposition14(v.declinationK, v.latitude);

    this.setGeometryVisibility(v.showLabels, [g.AH_label, g.HZ_label, g.KZ_label, g.HK_label, g.ZD_label, g.AZH, g.HZK]);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.variables, 'latitude', 0, 90);
    gui.addSlider('Ecliptic Longitude Start', this.variables, 'hLongitude', 0, 180);
    gui.addSlider('Ecliptic Longitude End', this.variables, 'kLongitude', 0, 180);
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


