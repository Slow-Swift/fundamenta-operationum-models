import * as THREE from "three";
import { DistanceAlongArc, Point } from "../math/spherical";
import { PointGeom } from "../geometry/point_geometry";
import { Arc, Equator } from "../geometry/great_circle";
import GUI from "lil-gui";

export class Proposition2 {

  constructor() {
    this.scene = new THREE.Scene();
    this.Setup();
  }

  Setup() {
    this.parameters = {
      obliquity: 23.44,
      g_angle: 40,
      show_sphere: true,
    };

    const p = this.points = {
      E:  Point(0, 0), // Equator Centre
      A:  Point(90, 0), // Equator Horizon Right
      C:  Point(-90, 0), // Equator Horizon Left

      B: Point(90, this.parameters.obliquity), // Ecliptic-Horizon Right 
      D: Point(-90, -this.parameters.obliquity), // Ecliptic-Horizon Left

      F: Point(0, 90), // North Pole
    }
    p.G = DistanceAlongArc(p.E, p.B, this.parameters.g_angle);
    p.H = DistanceAlongArc(p.F, p.G, 90);

    this.geometry = {
      // ** Render Points ** //
      E: new PointGeom(p.E),
      A: new PointGeom(p.A),
      C: new PointGeom(p.C),
      B: new PointGeom(p.B),
      D: new PointGeom(p.D),
      F: new PointGeom(p.F),
      G: new PointGeom(p.G),
      H: new PointGeom(p.H),

      // ** Render Arcs ** //
      equator: new Equator({ pole: p.F }), 
      ecliptic: new Arc({ point1: p.E, point2: p.B, color: 0x0000ff, length: 360 }),
      horizon: new Arc({ point1: p.F, point2: p.A, length: 360 }),
      declination: new Arc({ point1: p.F, point2: p.H, color: 0xffff00 }),
    };

    for (const geometry in this.geometry) {
      this.scene.add(this.geometry[geometry].mesh);
    }

    const gui = new GUI();
    gui.add(this.parameters, 'show_sphere')
    gui.add(this.parameters, 'obliquity', 0, 90);
    gui.add(this.parameters, 'g_angle', 0, 360);
  }

  Update() {
    this.points.B.copy(Point(90, this.parameters.obliquity));
    this.points.D.copy(Point(-90, -this.parameters.obliquity));
    this.points.G.copy(DistanceAlongArc(this.points.E, this.points.B, this.parameters.g_angle));
    this.points.H.copy(DistanceAlongArc(this.points.F, this.points.G, 90));
   
    for (const geometry in this.geometry) {
      this.geometry[geometry].Update();
    }
  }

}


