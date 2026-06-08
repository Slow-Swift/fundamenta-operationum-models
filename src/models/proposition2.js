import * as THREE from "three";
import { distanceAlongArc, Point } from "../math/spherical";
import { PointGeom } from "../geometry/point_geometry";
import { Arc, Equator } from "../geometry/great_circle";
import { Label } from "../geometry/label";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { Model } from "../core/model";

export class Proposition2 extends Model {

  constructor() {
    super();

    this.parameters = {
      obliquity: 23.44,
      g_angle: 40,
    };
  }

  createModel() {
    const p = this.points = {
      E:  Point(0, 0), // Equator Centre
      A:  Point(90, 0), // Equator Horizon Right
      C:  Point(-90, 0), // Equator Horizon Left

      B: Point(), // Ecliptic-Horizon Right 
      D: Point(), // Ecliptic-Horizon Left

      F: Point(0, 90), // North Pole
      G: Point(),
      H: Point(),
    };


    this.geometry = {
      equator: new Equator({ pole: p.F, color: 0x00ff00 }), 
      ecliptic: new Arc({ point1: p.E, point2: p.B, color: 0x0000ff, length: 360 }),
      horizon: new Arc({ point1: p.F, point2: p.A, length: 360 }),
      FG: new Arc({ point1: p.F, point2: p.G, color: 0xffff00 }),
      declination: new Arc({ point1: p.G, point2: p.H, color: 0xff8800, thickness: 8 }),
      g_angle: new Arc({point1: p.E, point2: p.G, color: 0xff8800, thickness: 8 }),
      right_ascension: new Arc({point1: p.E, point2: p.H, color: 0xff8800, thickness: 8 }),

      declinationLabel: new Label('0', Point()),
    };

    this.createPointGeometries(p);
  }

  updateCalculations() {
    this.points.B.copy(Point(90, this.parameters.obliquity));
    this.points.D.copy(Point(-90, -this.parameters.obliquity));
    this.points.G.copy(distanceAlongArc(this.points.E, this.points.B, this.parameters.g_angle));
    this.points.H.copy(distanceAlongArc(this.points.F, this.points.G, 90));

    this.geometry.FG.point2 = this.parameters.g_angle > 180 ? this.points.H : this.points.G;

    const declination = Math.asin(Math.sin(degToRad(this.parameters.obliquity)) * Math.sin(degToRad(this.parameters.g_angle)));
    const decLabelPos = distanceAlongArc(this.points.G, this.points.H, radToDeg(Math.abs(declination)) / 2);
    decLabelPos.x += 0.15;
    this.geometry.declinationLabel.position = decLabelPos;
    this.geometry.declinationLabel.text = Math.round(radToDeg(declination * 10))/10;
  }

  setupGui(gui) {
    gui.add(this.parameters, 'obliquity', 0, 90);
    gui.add(this.parameters, 'g_angle', 0, 360);
  }

}
