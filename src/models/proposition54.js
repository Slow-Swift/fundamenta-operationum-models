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

export class Proposition54 extends Model {

  constructor() {
    super();
    this.variables = {
      radius: 9, 
      aries: 30,
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
    p.Z = Point(0, 90);
    p.A = Point(0, () => v.radius);
    p.D = Point(0, () => -v.radius);
    p.G = Point(() => -v.radius, 0);
    p.C = Point(() => v.radius, 0);
    p.B = distanceAlongSmallCircle(p.E, p.Z, () => -v.aries, () => 90 - v.radius);
    p.H = distanceAlongArc(p.Z, p.B, 90);
    p.K = Point(90, 0);

    g.circle = new LatitudeCircle(p.E, () => 90 - v.radius);
    g.ZE = new Arc(p.Z, p.E);
    g.ED = new Arc(p.E, p.D);
    g.ZH = new Arc(p.Z, p.H);
    g.BH = new Arc(p.B, p.H);
    g.EK = new Arc(p.E, p.K);
    g.EG = new Arc(p.G, p.E);
    g.KB = new Arc(p.K, p.B);
    g.KB_p = new Arc(p.K, p.B, {length: 90});
    g.BE = new Arc(p.B, p.E);

    g.EHB = new RightAngle(p.H, p.B, p.E, { maxdst: 3 });

    g.BE_label = new ArcLabel(p.E, p.B);
    g.BEH = new AngleElement(p.E, p.H, p.B );
    g.EH = new ArcLabel(p.E, p.H);

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;
    
    this.setGeometryVisibility(v.radius < 90, [g.KB, g.KB_p]);

    this.setGeometryVisibility(v.showLabels, [ g.BE_label, g.BEH, g.EH ]);
  }

  setupGui(gui) {
    gui.addSlider('Radius', this.variables, 'radius', 0, 90);
    gui.addSlider('Aries', this.variables, 'aries', 0, 360);
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


