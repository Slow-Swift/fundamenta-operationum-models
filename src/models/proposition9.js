import { distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { Label } from "../geometry/label";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { LatitudeCircle } from "../geometry/latitude_circle";
import { SmallCircleArc } from "../geometry/small_circle_arc";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";

export class Proposition9 extends Model {

  constructor() {
    super();

    this.parameters = {
      latitude: 40,
      declination: 30,
      obliquity: 23.44,
      ortiveAmplitude: 40,
    };
  }

  createModel() {
    const p = this.points = {
      E:  Point(0, 0), // Horizon Centre
      B:  Point(-90, 0), // Horizon South
      D:  Point(90, 0), // Horizon North
      
      A:  Point(), // Equator Horizon Left
      C:  Point(), // Equator Horizon Right

      Z: Point(), // South Pole
      X: Point(), // North Pole
      K: Point(), // Projection of H
      H: Point(), // Intersection of Horizon and Ecliptic
      L: Point(), // Intersection of dirunal arc and Horizon
    };


    this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)),
      equator: new Equator(p.Z),
      meridian: new Equator(p.E),
      ZK: new Arc(p.Z, p.K, {end: 90}), 
      declinationLabel: new Label('0', Point()),
      ortiveAmplitudeLabel: new Label('0', Point()),
      EK_complement_label: new Label('0', Point()),
      urnal_label: new Label(),
      latitude: new SmallCircleArc(p.H, p.L, p.Z),

      latLabel: new Label(),
      latComplement: new Label(),
      // Angles
      angle_B: new RightAngle(p.B, p.A, p.E),
      angle_A: new RightAngle(p.A, Point(90, 45), p.E),
      angle_K: new RightAngle(p.K, p.E, p.H),
      angle_E: new AngleElement(p.E, p.H, p.K),
    };

    this.createPointGeometries(p);
  }

  updateCalculations() {
    const p = this.points;
    const g = this.geometry;
    const lat = this.parameters.latitude;
    const ortiveAmplitude = this.parameters.ortiveAmplitude;
    const declination = asin(sin(90 - lat) * sin(ortiveAmplitude));

    p.Z.copy(Point(-90, -lat));
    p.X.copy(Point(90, lat));
    p.A.copy(Point(-90, 90-lat));
    p.C.copy(Point(90, -90+lat));

    p.L.copy(Point(-90, 90-lat-declination));

    p.H.copy(Point(-ortiveAmplitude, 0));
    p.K.copy(lat > 0 ? distanceAlongArc(this.points.Z, this.points.H, 90) : Point(0, 0));
    g.latitude.latitude = declination;

    const urnal = declination < 90 ? asin(sin(90-ortiveAmplitude)/sin(90-declination)) : 90; 
    
    g.ortiveAmplitudeLabel.text = round(ortiveAmplitude, 1);
    g.ortiveAmplitudeLabel.position = Point(-ortiveAmplitude / 2, 0);

    g.declinationLabel.text = round(declination, 1);
    g.declinationLabel.position = distanceAlongArc(this.points.H, this.points.K, Math.abs(declination/2));

    g.EK_complement_label.text = round(urnal, 1); 
    g.EK_complement_label.position = distanceAlongArc(this.points.K, ortiveAmplitude > 0 ? p.A : p.C, Math.abs(urnal)/2);
    g.urnal_label.text = round(ortiveAmplitude > 0 ? urnal : 180 - urnal, 1);
    g.urnal_label.position = distanceAlongSmallCircle(p.Z, p.H, (ortiveAmplitude > 0 ? urnal : 180 - urnal) / 2, declination);

    g.latLabel.text = this.parameters.latitude;
    g.latLabel.position = distanceAlongArc(this.points.Z, this.points.B, this.parameters.latitude/2);
    g.latComplement.text = round(90 - this.parameters.latitude, 1);
    g.latComplement.position = distanceAlongArc(this.points.B, this.points.A, (90 - this.parameters.latitude) / 2);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    this.ortiveAmplitudeSlider = gui.addSlider('Ortive Amplitude', this.parameters, 'ortiveAmplitude', -90, 90);
  }

}
