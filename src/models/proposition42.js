import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round, mod } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { ArcLabel, Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition14, proposition16, proposition2, proposition5 } from "../math/propositions";

export class Proposition42 extends Model {

  constructor() {
    super();
    this.variables = {
      latitude: 40,
      siderealTime: 3,
      moonDirection: 110,
      parallax: 15,
      obliquity: 23.5,
      showEquator: false,
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

    p.Z = Point(0,90);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.F = Point(0,0);
    p.V = distanceAlongArc(p.F, Point(-90, () => 90-v.latitude), () => v.siderealTime / 24 * 360);
    p.X = distanceAlongSmallCircle(Point(90, () => v.latitude), p.F, () => 270 - v.siderealTime / 24 * 360, 90 - v.obliquity);
    p.G = distanceAlongArc(p.X, p.F, 90);
    p.A = distanceAlongSmallCircle(p.X, p.G, -90, 0);
    p.C = distanceAlongSmallCircle(p.X, p.G, 90, 0);
    p.E = Point(() => v.FE, 0);
    p.K = Point(() => 90 - v.moonDirection, 0);
    p.O = distanceAlongSmallCircle(p.X, p.E, () => -v.EO, 0);
    p.Q = distanceAlongArc(p.O, p.Z, () => -v.parallax);
    p.S = distanceAlongArc(p.X, p.Q, 90);

    // *** Geometry ***
    g.equator = new Equator(Point(90, () => v.latitude), { thickness: 2 });
    g.ecliptic = new Equator(p.X);
    g.VFG = new AngleElement(p.F, p.V, p.G);
    g.ZK = new Arc(p.Z, p.K);
    g.XO = new Arc(p.X, p.O);
    g.KO = new Arc(p.K, p.O);
    g.XQ = new Arc(p.X, p.Q);
    g.OQ = new Arc(p.O, p.Q);
    g.OKE = new RightAngle(p.K, p.O, p.E);
    g.XSE = new RightAngle(p.S, p.X, p.E);


    g.OQ_label = new ArcLabel(p.O, p.Q);
    g.DZO = new AngleElement(p.Z, p.D, p.O);
    g.AOZ = new AngleElement(p.O, p.Z, p.A);
    g.OS_label = new ArcLabel(p.O, p.S);
    g.SQ_label = new ArcLabel(p.S, p.Q);
    g.OQS = new AngleElement(p.Q, p.S, p.O, { maxdistance: 4 });
    g.ZOX = new AngleElement(p.O, p.Z, p.X, { maxdistance: 9 });
    g.latitude_label = new ArcLabel(p.Z, Point(-90, () => 90 - v.latitude));

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.F, g.G, g.VFG]);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.FV = v.siderealTime * 360 / 24;
    v.FG = TriangleSolver.opposite(v.obliquity, v.FV); 
    v.VFG = TriangleSolver.adjacentAngle(v.obliquity, v.FG);
    if ((v.FV > 90) && (v.FV < 270)) v.VFG = 180 - v.VFG;
    v.GFE = 90 + v.latitude - v.VFG;
    v.FE = TriangleSolver.hypoteneusFromAdjacent(v.GFE, v.FG);
    if (v.FE > 90 && v.FE < 270) v.FE += 180;

    v.EK = v.moonDirection - 90 + v.FE;
    v.OEK = TriangleSolver.angleFromOppositeAndHypotenuse(v.FG, v.FE);
    if (v.FG==0) v.OEK = 90 - v.latitude + (v.siderealTime == 12 ? v.obliquity : -v.obliquity);
    v.EO = TriangleSolver.hypoteneusFromAdjacent(v.OEK, v.EK);

    this.setGeometryVisibility(v.showEquator, [ g.equator, g.V ]);
    this.setGeometryVisibility(v.showLabels && v.showEquator, [ g.latitude_label ]);
    this.setGeometryVisibility(v.showLabels, [ g.OQ_label, g.OS_label, g.SQ_label, g.ZOX, g.OQS, g.AOZ, g.DZO]);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.variables, 'latitude', 0, 90);
    gui.addSlider('Sidereal Time', this.variables, 'siderealTime', 0, 24, { formatter: (t) => round(t, 1).toString() });
    gui.addSlider('Moon Direction', this.variables, 'moonDirection', 0, 180);
    gui.addSlider('Parallax', this.variables, 'parallax', 0, 20);
    gui.addToggle('Show Equator', this.variables, 'showEquator');
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


