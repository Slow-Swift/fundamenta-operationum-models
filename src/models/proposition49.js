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

export class Proposition49 extends Model {

  constructor() {
    super();
    this.variables = {
      latitude: 60,
      starDeclination: 20,
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
    p.A = Point(-90, () => 90 - v.latitude);
    p.C = Point(90, () => v.latitude - 90);
    p.Z = Point(90, () => v.latitude);
    p.T = Point(-90, () => -v.latitude);

    p.H = Point(() => v.EH, 0);
    p.K = distanceAlongArc(p.E, p.C, () => v.EK);
    p.L = Point(() => -v.EH, 0);
    p.M = distanceAlongArc(p.E, p.A, () => v.EK);

    // *** Geometry ***
    g.equator = new Equator(p.Z);
    g.ZK = new Arc(p.Z, p.K);
    g.TM = new Arc(p.T, p.M);

    g.ABE = new RightAngle(p.B, p.A, p.E);
    g.LME = new RightAngle(p.M, p.L, p.E);
    g.HKE = new RightAngle(p.K, p.H, p.E);
  

    g.HK_label = new ArcLabel(p.H, p.K);
    g.LM_label = new ArcLabel(p.L, p.M);
    g.ZD_label = new ArcLabel(p.D, p.Z, { pole: p.E, formatter: northSouthFormatter });
    g.EK_label = new ArcLabel(p.E, p.K, { pole: p.Z });
    g.ME_label = new ArcLabel(p.M, p.E, { pole: p.Z });

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    this.declinationSlider?.setRange(0, 90 - v.latitude);
    
    v.EH = TriangleSolver.hypoteneusFromOpposite(90 - v.latitude, v.starDeclination);
    v.EK = TriangleSolver.adjacent(90 - v.latitude, v.EH);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.variables, 'latitude', 0, 90, { formatter: northSouthFormatter });
    this.declinationSlider = gui.addSlider('Star Declination', this.variables, 'starDeclination', 0, 90);
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


