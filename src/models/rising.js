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

export class Rising extends Model {

  constructor() {
    super();

    this.parameters = {
      latitude: 40,
      time: 0,
      declination: 30,
      obliquity: 23.44,
      ortiveAmplitude: 40,
      date: 0,
    };
  }

  createModel() {
    const p = this.points = {
      Z: Point(-90, () => -this.parameters.latitude), // South Pole
      X: Point(90, () => this.parameters.latitude), // North Pole
      A: Point(0, 90), // Zenith

      S: Point(-90, 0),
      N: Point(90, 0),
      E: Point(),
      W: Point(-180),

      H: () => distanceAlongArc(Point(), Point(-90, 90 - this.parameters.latitude), this.parameters.time * 360/24),
      Y: () => distanceAlongSmallCircle(p.X(), Point(-90, 90-this.parameters.latitude), -this.parameters.time * 360/24, 90 - this.parameters.obliquity),
      Sun: () => distanceAlongSmallCircle(p.Y(), p.H(), this.parameters.date, 0),
    };


    this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(p.A),
      equator: new Equator(p.X),
      ecliptic: new Equator(p.Y),
      // equator: new Equator(p.Z),
      // meridian: new Equator(p.E),
      // ZK: new Arc(p.Z, p.K, {end: 90}), 
      // declinationLabel: new Label('0', Point()),
      // ortiveAmplitudeLabel: new Label('0', Point()),
      // EK_complement_label: new Label('0', Point()),
      // urnal_label: new Label(),
      // latitude: new SmallCircleArc(p.H, p.L, p.Z),
      //
      // latLabel: new Label(),
      // latComplement: new Label(),
      // // Angles
      // angle_B: new RightAngle(p.B, p.A, p.E),
      // angle_A: new RightAngle(p.A, Point(90, 45), p.E),
      // angle_K: new RightAngle(p.K, p.E, p.H),
      // angle_E: new AngleElement(p.E, p.H, p.K),
    };

    this.createPointGeometries(p);
  }

  updateCalculations() {
    const p = this.points;
    const g = this.geometry;
    const lat = this.parameters.latitude;
    const ortiveAmplitude = this.parameters.ortiveAmplitude;
    const declination = asin(sin(90 - lat) * sin(ortiveAmplitude));
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.parameters, 'latitude', -90, 90);
    gui.addSlider('Time', this.parameters, 'time', 0, 24);
    gui.addSlider('Date', this.parameters, 'date', 0, 360);
  }

}
