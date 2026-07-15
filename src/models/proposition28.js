import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";

export class Proposition28 extends Model {

  constructor() {
    super();
    this.parameters = {
      time: 10,
      latitude: 30,
      meridianInclination: 60,
      horizonInclination: 75,
      obliquity: 23.5,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;

    const p = this.points = {};

    p.X = Point(0, 90);
    p.E = Point(() => 90 - c.ED, 0);
    p.A = Point(90, () => c.AD);
    p.A_c = Point(90, () => c.AD - 90);
    p.A_p = distanceAlongSmallCircle(p.A, p.A_c, () => 180 - this.parameters.meridianInclination, 0);
    p.B = Point(-90, 0); // Horizon Left
    p.D = Point(90, 0);  // Horizon Right
    p.Z = Point(90, () => this.parameters.latitude);
    p.Z_p = Point(90, () => this.parameters.latitude - 90);
    p.H_p = distanceAlongSmallCircle(p.Z, p.Z_p, () => -this.parameters.time * 180 / 12, 0);
    p.T = Point(-90, () => -this.parameters.latitude);
    p.C = Point(0, -90);
    p.L = distanceAlongArc(p.A, p.A_p, () => -c.AL); 
    p.H = distanceAlongArc(p.A, p.A_p, () => -c.AH);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(Point(0, 0)),
      horizon: new Equator(Point(0, 90)),
      circle: new Arc(p.A, p.A_p, {length: 360}),
      hourCircle: new Arc(p.Z, p.H_p, {length: 180}),
      ZL: new Arc(p.Z, p.L),
      ZH: new Arc(p.Z, p.H),

      AED: new AngleElement(p.E, p.A, p.D),
      DAE: new AngleElement(p.A, p.Z, p.L),
      ABE: new RightAngle(p.B, p.A, p.D),
      ALZ: new RightAngle(p.L, p.A, p.Z), 
      HZD: new AngleElement(p.Z, p.H_p, p.D),
    };

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.Z_p, g.H_p, g.A_c, g.A_p]);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;

    this.horizonSlider?.setRange(Math.max(0, 90 - p.meridianInclination, p.meridianInclination - 90), 180-Math.max(0, 90 - p.meridianInclination, p.meridianInclination - 90));
    const AZH = 180 - p.time * 180 / 12;

    c.AD = acos(cos(p.horizonInclination) / sin(p.meridianInclination));
    c.ED = acos(cos(p.meridianInclination) / sin(p.horizonInclination));

    if (Math.abs(p.horizonInclination + p.meridianInclination - 90) < 0.01) {
      c.AD = 0;
      c.ED = 0;
    } else if (Math.abs(180 + p.horizonInclination - p.meridianInclination - 90) < 0.01) {
      c.AD = 0;
      c.ED = 180;
    } else if (Math.abs(180 - p.horizonInclination + p.meridianInclination - 90) < 0.01) {
      c.AD = 180;
      c.ED = 0;
    } else if (Math.abs(360 - p.horizonInclination - p.meridianInclination - 90) < 0.01) {
      c.AD = 180;
      c.ED = 180;
    } else {
      c.AD = acos(cos(p.horizonInclination) / sin(p.meridianInclination));
      c.ED = acos(cos(p.meridianInclination) / sin(p.horizonInclination));
    }
    
    c.AZ = c.AD - p.latitude;
    c.ZL = TriangleSolver.opposite(p.meridianInclination, c.AZ);
    c.AL = TriangleSolver.adjacent(p.meridianInclination, c.AZ);

    if (p.meridianInclination > 90) {
      c.ZL = 180 - c.ZL;
      c.AL = 180 - c.AL;
    }

    c.AZL = TriangleSolver.oppositeAngle(p.meridianInclination, c.AL);
    c.HZL = p.meridianInclination < 90 ? c.AZL - AZH : -c.AZL - AZH;
    c.ZH = TriangleSolver.hypoteneusFromAdjacent(c.HZL, c.ZL);
    c.HL = TriangleSolver.opposite(c.HZL, c.ZH);
    c.AH = c.AL - c.HL;
   
    if (c.AZ == 0) {
      c.ZL = 0;
      c.AL = 0;
      c.AH = 0;
    }

  }

  setupGui(gui) {
    gui.addSlider('Solar Time', this.parameters, 'time', 0, 12);
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    gui.addSlider('Inclination to Meridian', this.parameters, 'meridianInclination', 0, 180);
    this.horizonSlider = gui.addSlider('Inclination to Horizon', this.parameters, 'horizonInclination', 0, 180);
  }

}


