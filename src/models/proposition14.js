import * as THREE from "three";
import { distanceAlongArc, Point } from "../math/spherical";
import { PointGeom } from "../geometry/point_geometry";
import { Arc, Equator } from "../geometry/great_circle";
import GUI from "lil-gui";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { Model } from "../core/model";
import { Label } from "../geometry/label";

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
      equator: new Equator({ pole: p.Z, color: 0x00ff00 }), 
      horizon: new Equator({ pole: p.H, color: 0x0000ff }),
      edge: new Equator({ pole: p.E }),
      HO: new Arc({ point1: p.H, point2: p.O, color:0xffff00 }),
      declination: new Arc({ point1: p.O, point2: p.M, color: 0xff8800, thickness: 8}),
      ZO: new Arc({ point1: p.Z, point2: p.O, color: 0xaa00ff }),
      altitude: new Arc({ point1: p.O, point2: p.E, color: 0xff8800, thickness: 8}),
      equatorLength: new Arc({ point1: p.M, point2: p.E, color: 0xff8800, thickness: 8}),
      
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


