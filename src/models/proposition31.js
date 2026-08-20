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

export class Proposition31 extends Model {

  constructor() {
    super();
    this.variables = {
      midheavenLongitude: 25,
      ortiveAmplitude: 30,
      obliquity: 23.5,
      showEquator: false, 
      arcLabels: false,
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
    p.E = Point(() => v.ortiveAmplitude, 0);
    p.A = Point(-90, () => v.BA);
    p.C = Point(90, () => -v.BA);
    p.A_p = Point(-90, () => v.BA + 90);
    p.A_c = distanceAlongSmallCircle(p.A, p.A_p, () => - v.ZAE, 0);
    p.Z = Point(90, () => v.ZD);
    p.V = distanceAlongArc(p.A, p.A_c, () => -v.midheavenLongitude);
    p.O = Point(-90, () => 90 - v.ZD);

    // *** Geometry ***
    g.ecliptic = new Arc(p.A, p.A_c, {length: 360});
    g.ZE = new Arc(p.Z, p.E);
    g.equator = new Equator(p.Z, { thickness: 2 });
    g.AVE = new AngleElement(p.V, p.A, p.G);
    g.ZAE = new AngleElement(p.A, p.Z, p.A_c);
    g.PBG = new RightAngle(p.B, p.P, p.G)

    g.GE_label = new ArcLabel(p.G, p.E, { pole: p.P, formatter: northSouthFormatter });
    g.VA_label = new ArcLabel(p.V, p.A);
    g.ZD_label = new ArcLabel(p.D, p.Z, { pole: p.G, formatter: northSouthFormatter});
    g.AE_label = new ArcLabel(p.A, p.E, { pole: pole(p.A, p.A_c), shortest: false });
    g.ZE_label = new ArcLabel(p.Z, p.E);

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.A_p, g.A_c ]);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.ZAE = proposition16(v.midheavenLongitude, v.obliquity);
    this.ortiveSlider?.setRange(90 - v.ZAE, 90);
    
    v.BAE = 180 - v.ZAE;
    v.AE = TriangleSolver.hypoteneusFromOpposite(v.BAE, 90 + v.ortiveAmplitude);
    v.BA = -TriangleSolver.adjacent(v.BAE, v.AE);
    if (v.BAE == 90) v.AE = 180 - v.AE;

    v.VE = v.midheavenLongitude + v.AE;
    v.E_declination = proposition2(v.VE, v.obliquity);
    v.ZE = 90 - v.E_declination;
    v.ZD = TriangleSolver.thirdSide(v.ZE, 90-v.ortiveAmplitude);

    this.setGeometryVisibility(v.showEquator, [ g.equator, g.V, g.AVE ]);
    this.setGeometryVisibility(v.arcLabels, [ g.GE_label, g.AE_label, g.ZE_label, g.ZD_label, g.ZAE ]);
    this.setGeometryVisibility(v.showEquator && v.arcLabels, [ g.VA_label, g.AVE ]);
  }

  setupGui(gui) {
    gui.addSlider('Midheaven Ecliptic Longitude', this.variables, 'midheavenLongitude', 0, 90);
    this.ortiveSlider = gui.addSlider('Ortive Amplitude', this.variables, 'ortiveAmplitude', 0, 90);
    gui.addToggle('Show Equator', this.variables, 'showEquator');
    gui.addToggle('Show Labels', this.variables, 'arcLabels');
  }

}


