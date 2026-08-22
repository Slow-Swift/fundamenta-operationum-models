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

export class Proposition40 extends Model {

  constructor() {
    super();
    this.variables = {
      sunRadius: 15,
      moonRadius: 12,
      latitude: 18,
      obliquity: 23.5,
      showSun: false,
      showLabels: false,
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {};
    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
    };

    p.Z = Point(0, 90);
    p.C = Point(0,0);
    p.A = Point(0, () => v.latitude)
    p.B = Point(() => v.CB, 0);
    p.H = distanceAlongArc(p.A, p.B, -20);
    p.G = Point(-30, 0); 
    p.D = distanceAlongArc(p.A, p.B, () => v.sunRadius);

    // *** Geometry ***
    g.ZC = new Arc(p.Z, p.C);
    g.sun = new LatitudeCircle(p.A, () => 90-v.sunRadius, {thickness: 2});
    g.moon = new LatitudeCircle(p.B, () => 90-v.moonRadius, {thickness: 2});
    g.GB = new Arc(p.B, p.G);
    g.HB = new Arc(p.B, p.H);
    g.ZB = new Arc(p.Z, p.B);

    g.ACB = new RightAngle(p.C, p.A, p.B);
    
    g.AD_label = new ArcLabel(p.A, p.D);
    g.BD_label = new ArcLabel(p.B, p.D);
    g.AC_label = new ArcLabel(p.A, p.C, { pole: Point(90, 0)});
    g.ABC = new AngleElement(p.B, p.A, p.C);
    g.BAC = new AngleElement(p.A, p.B, p.C);
    g.BC = new ArcLabel(p.C, p.B, { pole: p.Z });

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    this.latitudeSlider?.setRange(0, v.sunRadius + v.moonRadius);

    v.CB = TriangleSolver.thirdSide(v.sunRadius + v.moonRadius, v.latitude);

    this.setGeometryVisibility(v.sunRadius + v.moonRadius > 0, [ g.H ]);
    this.setGeometryVisibility(v.showSun, [ g.sun, g.moon ]);
    this.setGeometryVisibility(v.showLabels, [ g.AD_label, g.BD_label, g.AC_label, g.ABC, g.BAC, g.BC ]);
  }

  setupGui(gui) {
    gui.addSlider('Sun Radius', this.variables, 'sunRadius', 0, 20);
    gui.addSlider('Moon Radius', this.variables, 'moonRadius', 0, 20);
    this.latitudeSlider = gui.addSlider('Latitude', this.variables, 'latitude', 0, 20);
    gui.addToggle('Show Sun and Moon', this.variables, 'showSun');
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


