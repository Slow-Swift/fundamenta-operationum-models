import * as THREE from "three";
import { distanceAlongArc, Point } from "../math/spherical";
import { PointGeom } from "../geometry/point_geometry";
import { Arc, Equator } from "../geometry/great_circle";
import GUI from "lil-gui";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";

export class Proposition14 {

  constructor() {
    this.scene = new THREE.Scene();
    this.setup();
  }

  setup() {
    this.parameters = {
      latitude: 40,
      declination: 10,
    };

    const p = this.points = {
      E: Point(0, 0),   // Horizon Centre
      B: Point(-90, 0), // Horizon Left
      D: Point(90, 0),  // Horizon Right

      A: Point(-90, 90 - this.parameters.latitude), // Equator Horizon Left
      C: Point(90, -90 + this.parameters.latitude), // Equator Horizon Right

      H: Point(0, 90), // Zenith
      Z: Point(90, this.parameters.latitude),
      O: Point(0, 0),
      M: Point(0, 0),
    }

    this.geometry = {
      // ** Render Points ** //
      E: new PointGeom(p.E), // Centre
      A: new PointGeom(p.A), // Equator-Right
      C: new PointGeom(p.C), // Equator-Left
      B: new PointGeom(p.B), // Horizon-Left
      D: new PointGeom(p.D), // Horizon-Right
      H: new PointGeom(p.H, 0x0000ff), // Zenith
      Z: new PointGeom(p.Z, 0x00ff00), // North Pole
      O: new PointGeom(p.O, 0xff8800, 0.08),
      M: new PointGeom(p.M),

      // ** Render Arcs ** //
      equator: new Equator({ pole: p.Z, color: 0x00ff00 }), 
      horizon: new Equator({ pole: p.H, color: 0x0000ff }),
      edge: new Equator({ pole: p.E }),
      HE: new Arc({ point1: p.H, point2: p.E, color:0xff5500 }),
      declination: new Arc({ point1: p.O, point2: p.M }),
      ZO: new Arc({ point1: p.Z, point2: p.O }),
    };
``
    for (const geometry in this.geometry) {
      this.scene.add(this.geometry[geometry].mesh);
    }
  }

  setupGui(gui) {
    gui.add(this.parameters, 'latitude', 0, 90);
    gui.add(this.parameters, 'declination', 0, 90);
  }

  update() {
    this.points.Z.copy(Point(90, this.parameters.latitude));
    this.points.A.copy(Point(-90, 90 - this.parameters.latitude ));
    this.points.D.copy(Point(90, -90 + this.parameters.latitude));

    const altitude = radToDeg(Math.asin(Math.sin(degToRad(this.parameters.declination)) / Math.sin(degToRad(this.parameters.latitude))));
    this.points.O.copy(Point(0, altitude));
    this.points.M.copy(distanceAlongArc(this.points.Z, this.points.O, 90));
       
    for (const geometry in this.geometry) {
      this.geometry[geometry].update();
    }
  }

  dispose() {
    for (const geometry in this.geometry) {
      this.scene.remove(this.geometry[geometry].mesh);
      this.geometry[geometry].dispose();
    }

    this.geometry = {};
    this.points = {};
  }

}


