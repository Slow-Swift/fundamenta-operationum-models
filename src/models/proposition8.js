import { distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { Label } from "../geometry/label";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";

export class Proposition8 extends Model {

  constructor() {
    super();

    this.parameters = {
      latitude: 40,
      ortiveAmplitude: 30,
      obliquity: 23.5,
      time: 0,
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
      K: Point(), // Projection of H
      H: Point(), // Intersection of Horizon and Ecliptic

      // G: Point(45, 5), // A second point on the ecliptic
      // J: Point(),
    };


    this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)),
      equator: new Equator(p.Z),
      meridian: new Equator(p.E),
      ZK: new Arc(p.Z, p.K), 
      ZH: new Arc(p.Z, p.H),
      declinationLabel: new Label('0', Point()),
      ortiveAmplitudeLabel: new Label('0', Point()),

      // Angles
      angle_B: new RightAngle(p.B, p.A, p.E),
      angle_A: new RightAngle(p.A, Point(90, 45), p.E),
      angle_K: new RightAngle(p.K, p.E, p.H),
      angle_E: new AngleElement(p.E, p.H, p.K),

      latLabel: new Label(),
      latComplement: new Label(),
      // ecliptic: new Equator(p.G),
      // ecliptic: new Arc(p.H, p.G, { thickness: 1, length: 360 }),
      // ecliptic2: new Arc(p.H, p.J, {thickness: 1, length: 360 }),
    };

    this.createPointGeometries(p);
  }

  updateCalculations() {
    this.points.Z.copy(Point(-90, -this.parameters.latitude));
    this.points.A.copy(Point(-90, 90-this.parameters.latitude));
    this.points.C.copy(Point(90, -90+this.parameters.latitude));

    this.points.H.copy(Point(-this.parameters.ortiveAmplitude, 0));
    this.points.K.copy(distanceAlongArc(this.points.Z, this.points.H, 90));

    const declination = TriangleSolver.opposite(90 - this.parameters.latitude, this.parameters.ortiveAmplitude); // asin(sin(90 - this.parameters.latitude) * sin(this.parameters.ortiveAmplitude));
    
    this.geometry.ortiveAmplitudeLabel.text = Math.round(this.parameters.ortiveAmplitude*10)/10;
    this.geometry.ortiveAmplitudeLabel.position = Point(-this.parameters.ortiveAmplitude / 2, 0);

    this.geometry.declinationLabel.text = round(declination, 1);
    this.geometry.declinationLabel.position = distanceAlongArc(this.points.H, this.points.K, Math.abs(declination)/2);
   
    this.geometry.latLabel.text = this.parameters.latitude;
    this.geometry.latLabel.position = distanceAlongArc(this.points.Z, this.points.B, this.parameters.latitude/2);
    this.geometry.latComplement.text = round(90 - this.parameters.latitude, 1);
    this.geometry.latComplement.position = distanceAlongArc(this.points.B, this.points.A, (90 - this.parameters.latitude) / 2);
    // const equinoxDistance = asin(sin(declination) / sin(this.parameters.obliquity));

    // const GK = asin(tan(this.parameters.declination) / tan(23.5));
    // console.log(GK);
    // this.points.G.copy(distanceAlongArc(this.points.K, this.points.E, GK));
    // this.points.J.copy(distanceAlongArc(this.points.K, this.points.E, 180-GK));
    //
    // this.points.G.copy(distanceAlongSmallCircle(this.points.Z, this.points.E, this.parameters.time * 360/24, 90-23.5));
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    this.declinationSlider = gui.addSlider('Ortive Amplitude', this.parameters, 'ortiveAmplitude', -90, 90);
    // gui.addSlider('Time', this.parameters, 'time', 0, 24);
  }

}
