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
import { LatitudeCircle } from "../geometry/latitude_circle";

export class Proposition55_Case1 extends Model {

  constructor() {
    super();
    this.variables = {
      radius: 20, 
      argument: 30,
      obliquity8: 23.77,
      obliquity9: 23.6,
      showLabels: false,
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {};
    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
    };

    p.E = Point(0,0);
    p.D = Point(() => -v.radius, 0);
    p.A = distanceAlongSmallCircle(p.E, p.D, -v.obliquity9, () => 90 - v.radius);
    p.B = distanceAlongSmallCircle(p.E, p.D, () => -v.obliquity9-v.argument, () => 90 - v.radius);
    p.C = distanceAlongSmallCircle(p.E, Point(90, 0), -v.obliquity9, () => 90 - v.radius);
    p.H = distanceAlongArc(p.E, p.A, () => v.EH);
    p.G = distanceAlongArc(p.E, p.A, () => v.EH + v.GH);
    p.K = Point(() => v.EK, 0);
    p.L = distanceAlongArc(p.E, p.C, () => v.EL);

    g.circle = new LatitudeCircle(p.E, () => 90 - v.radius);
    g.DE = new Arc(p.D, p.K, {start: -20});
    g.equator = new Arc(p.A, p.L);
    g.EB = new Arc(p.E, p.B);
    g.BH = new Arc(p.B, p.H);
    g.GA = new Arc(p.G, p.A);
    g.GB = new Arc(p.G, p.K);
    g.KL = new Arc(p.K, p.L);

    g.KLG = new RightAngle(p.L, p.K, p.C);
    g.BHE = new RightAngle(p.H, p.B, p.E);

    g.BEH = new AngleElement(p.E, p.B, p.H);
    g.BE_label = new ArcLabel(p.B, p.E);
    g.HGB = new AngleElement(p.G, p.B, p.H);
    g.BH_label = new ArcLabel(p.B, p.H);
    g.GB_label = new ArcLabel(p.G, p.B);

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.EH = TriangleSolver.adjacent(v.argument, v.radius);
    if (v.argument > 90 && v.argument < 270) v.EH = 180 - v.EH;
    v.BH = TriangleSolver.opposite(v.argument, v.radius);
    v.GB = TriangleSolver.hypoteneusFromOpposite(v.obliquity8, v.BH);
    v.GH = TriangleSolver.adjacent(v.obliquity8, v.GB);

    v.GE = mod(v.GH + v.EH + 180, 360) - 180;
    v.GJ = TriangleSolver.adjacent(v.obliquity8, v.GE);
    v.EJ = TriangleSolver.opposite(v.obliquity8, v.GE);
    v.JEG = TriangleSolver.oppositeAngle(v.obliquity8, v.GJ);
    v.JEK = mod(180 - v.JEG - v.obliquity9 + 180, 360) - 180;
    v.EK = mod(TriangleSolver.hypoteneusFromAdjacent(v.JEK, v.EJ) + 180, 360) - 180;
    v.EL = TriangleSolver.adjacent(v.obliquity9, v.EK);

    this.setGeometryVisibility(v.radius > 0, [g.K, g.L, g.KL, g.GB, g.equator, g.DE]);
    this.setGeometryVisibility(v.showLabels, [ g.GB_label, g.BH_label, g.HGB, g.BE_label, g.BEH ]); 
  }

  setupGui(gui) {
    gui.addSlider('Radius', this.variables, 'radius', 0, this.variables.obliquity8);
    gui.addSlider('Aries', this.variables, 'argument', 0, 360);
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


