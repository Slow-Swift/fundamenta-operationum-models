import { distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { ArcLabel, Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import { proposition16, proposition2, proposition5 } from "../math/propositions";
import * as TriangleSolver from "../math/TriangleSolver";

export class Proposition17 extends Model {

  constructor() {
    super();
    this.parameters = {
      latitude: 40,
      ecliptic_longitude: 0,
      obliquity: 23.5,
      showEquator: false,
      arcLabels: false,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;
    const v = this.parameters;

    const p = this.points = {
      F: Point(0, 0),
      E: Point(() => c.FE, 0),   // Horizon Centre
      B: Point(-90, 0), // Horizon Left
      D: Point(90, 0),  // Horizon Right

      Z: () => Point(90, this.parameters.latitude),
      A: () => Point(-90, c.DC),
      C: () => Point(90, -c.DC),
    };

    p.L = distanceAlongArc(p.Z, p.E, 90);
    p.V = distanceAlongSmallCircle(p.Z, p.F, () => -c.FV);
    p.V_p = distanceAlongSmallCircle(p.Z, p.V, 270, 90 - v.obliquity);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)), 
      // ecliptic: new Arc(p.E, p.A, {length: 360}),
      ecliptic: new Equator(p.V_p),
      equator: new Equator(p.Z, { thickness: 2 }),
      edge: new Equator(p.F),
      ZE: new Arc(p.Z, p.E),
      angleV: new AngleElement(p.V, p.E, p.L),
      angleD: new RightAngle(p.D, p.E, p.Z),
    };

    g.ZED = new AngleElement(p.E, p.Z, p.D);
    g.DEC = new AngleElement(p.E, p.D, p.C);
    g.ZD = new ArcLabel(p.Z, p.D, { pole: p.F });
    g.VE = new ArcLabel(p.V, p.E, { pole: p.V_p, shortest: false });

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.L, g.V_p]);
  }
 
  updateCalculations() {
    const c = this.calculations;
    const p = this.parameters;
    const g = this.geometry;

    c.declination = proposition2(p.ecliptic_longitude, p.obliquity);
    c.rightAscension = proposition5(p.ecliptic_longitude, p.obliquity);
    if (p.ecliptic_longitude > 180) c.rightAscension = 360 - c.rightAscension;
    c.FE = TriangleSolver.hypoteneusFromOpposite(90 - p.latitude, c.declination);
    c.FL = TriangleSolver.adjacent(90 - p.latitude, c.FE);
    c.FV = c.rightAscension - c.FL;

    c.ZEC = proposition16(p.ecliptic_longitude, p.obliquity);
    c.ZED = asin(sin(p.latitude) / cos(c.declination));
    c.DEC = c.ZEC - c.ZED;
    c.EC = TriangleSolver.hypoteneusFromAdjacent(c.DEC, 90 - c.FE);
    c.DC = TriangleSolver.opposite(c.DEC, c.EC);

    this.setGeometryVisibility(p.showEquator, [g.equator, g.V, g.angleV, g.F]);
    this.setGeometryVisibility(p.arcLabels, [g.ZED, g.DEC, g.ZD]);
    this.setGeometryVisibility(p.showEquator && p.arcLabels, [g.VE, g.angleV]);
  }

  setupGui(gui) {
    this.latitudeSlider = gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90-this.parameters.obliquity);
    gui.addSlider('Ecliptic Longitude', this.parameters, 'ecliptic_longitude', 0, 360);
    gui.addToggle('Show Equator', this.parameters, 'showEquator');
    gui.addToggle('Show Labels', this.parameters, 'arcLabels');
  }

}


