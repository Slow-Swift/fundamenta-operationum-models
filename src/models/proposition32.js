import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, pole, smallCircleArc } from "../math/spherical";
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
import { proposition16, proposition2, proposition5 } from "../math/propositions";

export class Proposition32 extends Model {

  constructor() {
    super();
    this.variables = {
      midheavenLongitude: 25,
      ascendantLongitude: 110,
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

    p.G = Point(0,0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.P = Point(0, 90);
    p.A = Point(-90, () => v.BA);
    p.C = Point(90, () => -v.BA);
    p.A_c = distanceAlongSmallCircle(p.A, p.A_p, () => - v.ZAE, 0);
    p.Z = Point(90, () => v.ZD);
    p.V = distanceAlongArc(p.A, p.A_c, () => -v.midheavenLongitude);
    p.E = Point(() => v.BE - 90, 0); 
    p.O = Point(-90, () => v.BO);
    p.V_p = pole(p.A, p.A_c);

    // *** Geometry ***
    g.ecliptic = new Arc(p.A, p.A_c, {length: 360});
    g.ZD = new Arc(p.Z, p.E);
    g.equator = new Equator(p.Z, { thickness: 2});
    g.AVE = new AngleElement(p.V, p.A, p.G);

    g.VA_label = new ArcLabel(p.V, p.A, { pole: p.V_p, shortest: false });
    g.AE_label = new ArcLabel(p.A, p.E, { pole: p.V_p, shortest: false });
    g.ED_label = new ArcLabel(p.E, p.D, { pole: p.P });
    g.ZE_label = new ArcLabel(p.E, p.Z);
    g.ZD_label = new ArcLabel(p.D, p.Z, { pole: p.G, formatter: northSouthFormatter });

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.A_c, g.V_p ]);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.ZAE = proposition16(v.midheavenLongitude, v.obliquity);
    v.BAE = 180 - v.ZAE;
    v.BE = 180 - asin(sin(v.BAE) * sin(v.ascendantLongitude));
    v.BA = TriangleSolver.thirdSide(v.ascendantLongitude, v.BE);

    v.VE = v.midheavenLongitude + v.ascendantLongitude;
    v.A_declination = proposition2(v.midheavenLongitude, v.obliquity);
    v.BO = v.BA - v.A_declination;
    v.ZD = v.OP = 90 - v.BO;

    this.setGeometryVisibility(v.showEquator, [ g.equator, g.V ]);
    this.setGeometryVisibility(v.showEquator && v.showLabels, [ g.VA_label, g.AVE ]);
    this.setGeometryVisibility(v.showLabels, [ g.AE_label, g.ED_label, g.ZD_label, g.ZE_label ]);
  }

  setupGui(gui) {
    gui.addSlider('Midheaven Ecliptic Longitude', this.variables, 'midheavenLongitude', 0, 90);
    this.ortiveSlider = gui.addSlider('Midheaven - Ascendant', this.variables, 'ascendantLongitude', 90, 180);
    gui.addToggle('Show Equator', this.variables, 'showEquator');
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


