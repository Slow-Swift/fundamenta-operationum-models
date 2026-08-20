import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { ArcLabel, Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition27 } from "../math/propositions";

export class Proposition27 extends Model {

  constructor() {
    super();
    this.parameters = {
      time: 9,
      latitude: 40,
      angleOfInclination: 40,
      obliquity: 23.5,
      arcLabels: false,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;

    const p = this.points = {};

    p.F = Point(0, 0);
    p.E = Point(() => 90 - this.parameters.angleOfInclination, 0);
    p.B = Point(-90, 0); // Horizon Left
    p.D = Point(90, 0);  // Horizon Right
    p.Z = Point(90, () => this.parameters.latitude);
    p.Z_p = Point(90, () => this.parameters.latitude - 90);
    p.H_p = distanceAlongSmallCircle(p.Z, p.Z_p, () => -this.parameters.time * 180 / 12, 0);
    p.T = Point(-90, () => -this.parameters.latitude);
    p.A = Point(0, 90);
    p.C = Point(0, -90);
    p.L = Point(() => 90 - this.parameters.angleOfInclination, () => 90 - c.AL);
    p.H = distanceAlongArc(p.A, p.E, () => c.AH);
    p.C_p = Point(() => 180 - this.parameters.angleOfInclination, 0);
    p.H_c = distanceAlongArc(p.Z, p.H_p, () => Math.min(90, c.ZH));

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(Point(0, 0)),
      horizon: new Equator(Point(0, 90)),
      easternCircle: new Equator(Point(() => 180 - this.parameters.angleOfInclination, 0)),
      hourCircle: new Arc(p.Z, p.H_p, {length: 180}),
      ZL: new Arc(p.Z, p.L),

      AED: new RightAngle(p.E, p.A, p.D),
      ZAL: new AngleElement(p.A, p.Z, p.L),
      ABE: new RightAngle(p.B, p.A, p.D),
      ALZ: new RightAngle(p.L, p.A, p.Z), 
      AZH: new AngleElement(p.Z, p.H_c, p.A),
    };

    g.AZ_label = new ArcLabel(p.Z, p.A, { pole: p.F });
    g.HZL = new AngleElement(p.Z, p.H_c, p.L);
    g.AH_label = new ArcLabel(p.A, p.H, { pole: p.C_p });
    g.HL_label = new ArcLabel(p.H, p.L, { pole: p.C_p });
    g.LZ_label = new ArcLabel(p.Z, p.L);

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.F, g.Z_p, g.H_p, g.H_c, g.C_p]);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;
    const g = this.geometry;

    const AZH = 180 - p.time * 180 / 12;

    c.ZL = TriangleSolver.opposite(p.angleOfInclination, 90 - p.latitude);
    c.AL = TriangleSolver.adjacent(p.angleOfInclination, 90 - p.latitude);

    if (p.angleOfInclination > 90) {
      c.ZL = 180 - c.ZL;
      c.AL = 180 - c.AL;
    }

    c.AZL = TriangleSolver.oppositeAngle(p.angleOfInclination, c.AL);
    c.HZL = p.angleOfInclination < 90 ? c.AZL - AZH : -c.AZL - AZH;
    c.ZH = TriangleSolver.hypoteneusFromAdjacent(c.HZL, c.ZL);
    c.HL = TriangleSolver.opposite(c.HZL, c.ZH);
    c.AH = c.AL - c.HL;
   
    if (p.latitude == 90) {
      c.ZL = 0;
      c.AL = 0;
      c.AH = 0;
    }
  
    this.setGeometryVisibility(p.arcLabels, [g.AZ_label, g.AH_label, g.HL_label, g.LZ_label, g.ZAL, g.AZH, g.HZL]);
  }

  setupGui(gui) {
    gui.addSlider('Solar Time', this.parameters, 'time', 0, 24, { formatter: (t) => round(t, 1).toString() });
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    gui.addSlider('Angle of Inclination', this.parameters, 'angleOfInclination', 0, 180);
    gui.addToggle('Show Labels', this.parameters, 'arcLabels');
  }

}


