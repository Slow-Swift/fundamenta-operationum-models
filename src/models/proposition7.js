import { distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { ArcLabel, Label, northSouthFormatter } from "../geometry/label";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";


export class Proposition7 extends Model {

  constructor() {
    super();

    this.parameters = {
      latitude: 60,
      declination: -15,
      obliquity: 23.44,
      arcLabels: false,
    };
  }

  createModel() {
    const v = this.parameters;
    const p = this.points = {
      E:  Point(0, 0), // Horizon Centre
      B:  Point(-90, 0), // Horizon South
      D:  Point(90, 0), // Horizon North
      
      A:  Point(-90, () => 90 - v.latitude), // Equator Horizon Left
      C:  Point(90, () => v.latitude - 90), // Equator Horizon Right

      Z: Point(-90, () => -v.latitude), // South Pole
      H: Point(() => v.ortiveAmplitude, 0), // Intersection of Horizon and Ecliptic

      // G: Point(45, 5), // A second point on the ecliptic
      // J: Point(),
    };

    p.K = distanceAlongArc(p.E, p.C, () => v.EK);
    p.X = distanceAlongSmallCircle(p.Z, p.K, -90);


    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)),
      equator: new Equator(p.Z),
      meridian: new Equator(p.E),
      ZK: new Arc(p.Z, p.K), 
      ZH: new Arc(p.Z, p.H),

      declinationLabel: new ArcLabel(p.H, p.K, { pole: p.X, formatter: northSouthFormatter}),
      ortiveAmplitudeLabel: new ArcLabel(p.E, p.H, { pole: Point(0, 90), formatter: northSouthFormatter}),
      latitudeLabel: new ArcLabel(p.B, p.Z, { pole: p.E }),

      // Angles
      angle_B: new RightAngle(p.B, p.A, p.E),
      angle_A: new RightAngle(p.A, Point(90, 45), p.E),
      angle_K: new RightAngle(p.K, p.E, p.H),
      angle_E: new AngleElement(p.E, p.H, p.K),
    };

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.X]);
  }

  updateCalculations() {
    const v = this.parameters;
    const p = this.points;
    const g = this.geometry;
    this.declinationSlider?.setRange(-90+this.parameters.latitude, 90-this.parameters.latitude, 23.5);

    v.ortiveAmplitude = TriangleSolver.hypoteneusFromOpposite(90 - this.parameters.latitude, this.parameters.declination); 
    v.EK = v.latitude == 90 ? 90 : TriangleSolver.adjacent(90 - v.latitude, v.ortiveAmplitude);
    this.setGeometryVisibility(v.latitude < 90, [g.K, g.H, g.angle_K]);
    this.setGeometryVisibility(v.arcLabels, [g.angle_E, g.declinationLabel, g.ortiveAmplitudeLabel, g.latitudeLabel]);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    this.declinationSlider = gui.addSlider('Declination', this.parameters, 'declination', this.parameters.latitude - 90, 90 - this.parameters.latitude, {formatter: northSouthFormatter});
    gui.addToggle('Show Labels', this.parameters, 'arcLabels');
  }

}
