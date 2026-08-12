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
import { proposition3 } from "../math/propositions";

export class Proposition8 extends Model {

  constructor() {
    super();

    this.parameters = {
      latitude: 60,
      ortiveAmplitude: -30,
      obliquity: 23.5,
      arcLabels: false,
      showEcliptic1: false,
      showEcliptic2: false,
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
    p.X = distanceAlongArc(p.E, p.C, () => v.EK + 90);
    p.V_1 = distanceAlongArc(p.E, p.A, () => v.eclipticLongitude1 - v.EK);
    p.V_2 = distanceAlongArc(p.E, p.A, () => v.eclipticLongitude2 - v.EK);
    p.V_c1 = distanceAlongArc(p.E, p.A, () => v.eclipticLongitude1 - v.EK - 90);
    p.V_c2 = distanceAlongArc(p.E, p.A, () => v.eclipticLongitude2 - v.EK - 90);
    p.V_e1 = distanceAlongSmallCircle(p.V_1, p.V_c1, v.obliquity);
    p.V_e2 = distanceAlongSmallCircle(p.V_2, p.V_c2, v.obliquity);
    p.V_p1 = distanceAlongSmallCircle(p.V_1, p.V_e1, 90);
    p.V_p2 = distanceAlongSmallCircle(p.V_2, p.V_e2, 90);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)),
      equator: new Equator(p.Z),
      meridian: new Equator(p.E),
      ZK: new Arc(p.Z, p.K), 
      ZH: new Arc(p.Z, p.H),

      // Angles
      angle_B: new RightAngle(p.B, p.A, p.E),
      angle_A: new RightAngle(p.A, Point(90, 45), p.E),
      angle_K: new RightAngle(p.K, p.E, p.H),
      angle_E: new AngleElement(p.E, p.H, p.K),

      declinationLabel: new ArcLabel(p.H, p.K, { pole: p.X, formatter: northSouthFormatter}),
      ortiveAmplitudeLabel: new ArcLabel(p.E, p.H, { pole: Point(0, 90), formatter: northSouthFormatter}),
      latLabel: new ArcLabel(p.B, p.Z, { pole: p.E}),
      ecliptic1: new Arc(p.V_1, p.V_e1, { thickness: 2, length: 360 }),
      ecliptic2: new Arc(p.V_2, p.V_e2, {thickness: 2, length: 360 }),
      angle_V1: new AngleElement(p.V_1, p.V_c1, p.V_e1),
      angle_V2: new AngleElement(p.V_2, p.V_c2, p.V_e2),
      lognitudeLabel1: new ArcLabel(p.V_1, p.H, { pole: p.V_p1, shortest: false}),
      lognitudeLabel2: new ArcLabel(p.V_2, p.H, { pole: p.V_p2, shortest: false}),
    };

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.X, g.V_c1, g.V_e1, g.V_c2, g.V_e2, g.V_p1, g.V_p2]);
  }

  updateCalculations() {
    const v = this.parameters;
    const g = this.geometry;
    
    const maxOrtiveAmplitude = v.latitude == 90 ? 90 : TriangleSolver.hypoteneusFromOpposite(90 - v.latitude, Math.min(90 - v.latitude, v.obliquity));
    this.ortiveAmplitudeSlider?.setRange(-maxOrtiveAmplitude, maxOrtiveAmplitude);

    v.EK = TriangleSolver.adjacent(90 - v.latitude, v.ortiveAmplitude);

    const declination = TriangleSolver.opposite(90 - this.parameters.latitude, this.parameters.ortiveAmplitude); // asin(sin(90 - this.parameters.latitude) * sin(this.parameters.ortiveAmplitude));
    v.eclipticLongitude1 = proposition3(declination, v.obliquity);
    v.eclipticLongitude2 = 180 - v.eclipticLongitude1;
    // const equinoxDistance = asin(sin(declination) / sin(this.parameters.obliquity));

    // const GK = asin(tan(this.parameters.declination) / tan(23.5));
    // console.log(GK);
    // this.points.G.copy(distanceAlongArc(this.points.K, this.points.E, GK));
    // this.points.J.copy(distanceAlongArc(this.points.K, this.points.E, 180-GK));
    //
    // this.points.G.copy(distanceAlongSmallCircle(this.points.Z, this.points.E, this.parameters.time * 360/24, 90-23.5));

    this.setGeometryVisibility(v.arcLabels, [g.declinationLabel, g.ortiveAmplitudeLabel, g.latLabel, g.angle_E]);
    this.setGeometryVisibility(v.showEcliptic1, [g.ecliptic1, g.V_1]);
    this.setGeometryVisibility(v.showEcliptic2, [g.ecliptic2, g.V_2]);
    this.setGeometryVisibility(v.showEcliptic1 && v.arcLabels, [g.angle_V1, g.lognitudeLabel1]);
    this.setGeometryVisibility(v.showEcliptic2 && v.arcLabels, [g.angle_V2, g.lognitudeLabel2]);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    this.ortiveAmplitudeSlider = gui.addSlider('Ortive Amplitude', this.parameters, 'ortiveAmplitude', -90, 90, {formatter: northSouthFormatter});
    gui.addToggle('Show Labels', this.parameters, 'arcLabels');
    gui.addToggle('Ecliptic Candidate 1', this.parameters, 'showEcliptic1');
    gui.addToggle('Ecliptic Candidate 2', this.parameters, 'showEcliptic2');
    this.updateCalculations();
  }

}
