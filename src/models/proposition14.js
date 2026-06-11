import { distanceAlongArc, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { Model } from "../core/model";
import { Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";

export class Proposition14 extends Model {

  constructor() {
    super();
    this.parameters = {
      latitude: 40,
      declination: 20,
    };
  }

  createModel() {
    const p = this.points = {
      E: Point(0, 0),   // Horizon Centre
      B: Point(-90, 0), // Horizon Left
      D: Point(90, 0),  // Horizon Right

      A: Point(), // Equator Horizon Left
      C: Point(), // Equator Horizon Right

      H: Point(0, 90), // Zenith
      Z: Point(),
      O: Point(0, 0),
      M: Point(0, 0),
    }

    this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      equator: new Equator(p.Z), 
      horizon: new Equator(p.H), 
      edge: new Equator(p.E),
      HO: new Arc(p.H, p.E),
      ZO: new Arc(p.Z, p.M),
      
      altitudeLabel: new Label('0', Point()),
    };

    this.createPointGeometries(p);
  }

  setupGui(gui) {
    gui.add(this.parameters, 'latitude', 0, 90);
    gui.add(this.parameters, 'declination', 0, 90);
  }

  updateCalculations() {
    this.points.Z.copy(Point(90, this.parameters.latitude));
    this.points.A.copy(Point(-90, 90 - this.parameters.latitude ));
    this.points.D.copy(Point(90, -90 + this.parameters.latitude));

    const altitude = radToDeg(Math.asin(Math.sin(degToRad(this.parameters.declination)) / Math.sin(degToRad(this.parameters.latitude))));
    this.points.O.copy(Point(0, altitude));
    this.points.M.copy(distanceAlongArc(this.points.Z, this.points.O, 90));

    console.log(altitude);
    if (!isNaN(altitude)) {
      this.geometry.altitudeLabel.text = Math.round(altitude*10)/10;
      this.geometry.altitudeLabel.position = Point(10, altitude / 2);
    } else {
      this.geometry.altitudeLabel.text = "Undefined";
      this.geometry.altitudeLabel.position = Point(20, 45);
    }
  }

}


