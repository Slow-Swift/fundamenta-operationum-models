import { distanceAlongArc, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { Model } from "../core/model";
import { Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import { round } from "../math/degMath";

export class Proposition14 extends Model {

  constructor() {
    super();
    this.parameters = {
      latitude: 40,
      declination: 20,
    };

    this.calculations = {};
  }

  createModel() {
    const c = this.calculations;

    const p = this.points = {
      E: Point(0, 0),   // Horizon Centre
      B: Point(-90, 0), // Horizon Left
      D: Point(90, 0),  // Horizon Right

      A: () => Point(-90, 90 - this.parameters.latitude), // Equator Horizon Left
      C: () => Point(90, this.parameters.latitude - 90), // Equator Horizon Right

      H: Point(0, 90), // Zenith
      O: () => Point(0, c.altitude),
      Z: () => Point(90, this.parameters.latitude),
      M: Point(0, 0),
    };

    p.M = distanceAlongArc(p.Z, p.O, 90);

    this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      equator: new Equator(p.Z), 
      horizon: new Equator(p.H), 
      edge: new Equator(p.E),
      HO: new Arc(p.H, p.E),
      ZO: new Arc(p.Z, p.M),
      
      altitudeLabel: new Label(() => round(c.altitude, 1), Point(0, () => c.altitude / 2)),

      // Angles
      angle_B: new RightAngle(p.B, p.A, p.E),
      angle_A: new RightAngle(p.A, p.H, p.E),
      angle_H: new RightAngle(p.H, Point(90, 45), p.E),
      angle_M: new RightAngle(p.M, p.O, p.E),
      angle_E: new AngleElement(p.E, p.M, p.O),
    };

    this.createPointGeometries(p);
  }

  updateCalculations() {
    const c = this.calculations;

    this.declinationSlider?.setRange(0, Math.min(this.parameters.latitude, 23.5));

    const altitude = radToDeg(Math.asin(Math.sin(degToRad(this.parameters.declination)) / Math.sin(degToRad(this.parameters.latitude))));
    c.altitude = altitude;

    // if (!isNaN(altitude)) {
    //   this.geometry.altitudeLabel.text = Math.round(altitude*10)/10;
    //   this.geometry.altitudeLabel.position = Point(10, altitude / 2);
    // } else {
    //   this.geometry.altitudeLabel.text = "Undefined";
    //   this.geometry.altitudeLabel.position = Point(20, 45);
    // }
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.parameters, 'latitude', 0, 90);
    this.declinationSlider = gui.addSlider('Declination', this.parameters, 'declination', 0, 23.5);
  }

}


