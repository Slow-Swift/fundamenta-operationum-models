import * as THREE from "three";
import { distanceAlongArc, Point } from "../math/spherical";
import { PointGeom } from "../geometry/point_geometry";
import { Arc, Equator } from "../geometry/great_circle";
import GUI from "lil-gui";

export class Proposition14 {

  constructor() {
    this.scene = new THREE.Scene();
    this.Setup();
  }

  Setup() {
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
    }

    this.geometry = {
      // ** Render Points ** //
      E: new PointGeom(p.E),
      A: new PointGeom(p.A),
      C: new PointGeom(p.C),
      B: new PointGeom(p.B),
      D: new PointGeom(p.D),
      H: new PointGeom(p.H),
      z: new PointGeom(p.Z),

      // ** Render Arcs ** //
      equator: new Equator({ pole: p.Z }), 
      horizon: new Equator({ pole: p.H }),
      edge: new Equator({ pole: p.E }),
    };
``
    for (const geometry in this.geometry) {
      this.scene.add(this.geometry[geometry].mesh);
    }

    this.gui = new GUI();
    this.gui.add(this.parameters, 'latitude', 0, 90);
    this.gui.add(this.parameters, 'declination', 0, 360);
  }

  Update() {
    // this.points.B.copy(Point(90, this.parameters.obliquity));
    // this.points.D.copy(Point(-90, -this.parameters.obliquity));
    // this.points.G.copy(distanceAlongArc(this.points.E, this.points.B, this.parameters.g_angle));
    // this.points.H.copy(distanceAlongArc(this.points.F, this.points.G, 90));

    // this.geometry.FG.point2 = this.parameters.g_angle > 180 ? this.points.H : this.points.G;
       
    for (const geometry in this.geometry) {
      this.geometry[geometry].Update();
    }
  }

}


