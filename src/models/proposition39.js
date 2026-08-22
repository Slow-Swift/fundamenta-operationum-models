import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, pole, smallCircleArc } from "../math/spherical";
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
import { distance } from "three/tsl";

export class Proposition39 extends Model {

  constructor() {
    super();
    this.variables = {
      latitudeX: 50,
      angleOfPosition: 75,
      distance: 40, 
      latitudeH: 20,
      longitude: 60,
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
    };

    p.X = Point(0, 90);
    p.X_p = Point(() => -90 + v.angleOfPosition, 0);
    p.E = Point(0,0);
    p.A = Point(-90, () => 90 - v.latitudeX);
    p.B = Point(90, () => v.latitudeX - 90);
    p.Z = Point(90, () => v.latitudeX);
    p.H = distanceAlongArc(p.X, p.X_p, () => v.distance);
    p.K = Point(-90, () => 90 - v.XK);
    p.L = distanceAlongArc(p.Z, p.H, 90);

    // *** Geometry ***
    g.equator = new Equator(p.Z);
    g.ZL = new Arc(p.Z, p.L);
    g.LH = new Arc(p.L, p.H);
    g.XH = new Arc(p.X, p.H);
    g.HK = new Arc(p.H, p.K);
    g.ZK = new Arc(p.Z, p.K);
    g.XK = new Arc(p.X, p.K);

    g.ZAL = new RightAngle(p.A, p.Z, p.E);
    g.ALZ = new RightAngle(p.L, p.A, p.Z);
    g.XKH = new RightAngle(p.K, p.X, p.H);

    g.KHX = new AngleElement(p.X, distanceAlongSmallCircle(p.E, p.X, () => v.XK/1.25, 0), p.X_p);
    g.XH_label = new ArcLabel(p.X, p.H, { pole: distanceAlongSmallCircle(p.X, Point(-90, 0), () => v.angleOfPosition + 90, 0) });
    g.KH_label = new ArcLabel(p.K, p.H);
    g.XK_label = new ArcLabel(p.X, p.K, { pole: p.E });
    g.ZH_label = new ArcLabel(p.Z, p.H, { pole: pole(p.Z, p.L) });
    g.ZXH = new AngleElement(p.Z, p.X, () => Math.abs(v.XH) < 160 ? p.H() : p.L());
    g.XZ_label = new ArcLabel(p.Z, p.X, { pole: p.E});

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.E, g.X_p])
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.XK = v.angleOfPosition <= 90 ? 
      TriangleSolver.adjacent(v.angleOfPosition, v.distance) : 
      -TriangleSolver.adjacent(180 - v.angleOfPosition, v.distance);

    this.setGeometryVisibility(v.distance != 180, [ g.XK ]);
    this.setGeometryVisibility(v.angleOfPosition != 0 && v.angleOfPosition != 180, [ g.L, g.LH, g.ZL, g.ALZ ]);

    this.setGeometryVisibility(v.showLabels, [g.KHX, g.XH_label, g.KH_label, g.XK_label, g.ZH_label, g.ZXH, g.XZ_label ]);
  }

  setupGui(gui) {
    gui.addSlider('Latitude X', this.variables, 'latitudeX', 0, 90, { formatter: northSouthFormatter });
    gui.addSlider('Angle of Position', this.variables, 'angleOfPosition', 0, 180);
    gui.addSlider('Distance', this.variables, 'distance', 0, 180);
    gui.addToggle('Show Labels', this.variables, 'showLabels');
  }

}


