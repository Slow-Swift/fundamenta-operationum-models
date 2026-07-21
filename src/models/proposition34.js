import { distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { LatitudeCircle } from "../geometry/latitude_circle";
import { sin, cos, tan, asin, acos, atan } from "../math/degMath";
import * as TriangleSolver from "../math/TriangleSolver";


export class Proposition34 extends Model {

  constructor() {
    super();

    this.variables = {
      latitude_1: 30,
      declination: 30,
      obliquity: 23.5,
      latitude_2: 60,
      longitude: 13,
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {
      // X:  Point(0, 90), // Zenith
      // E:  Point(0, 0), // Horizon Centre
      // B:  Point(-90, 0), // Horizon South
      // D:  Point(90, 0), // Horizon North
      //
      // A:  Point(), // Equator Horizon Left
      // C:  Point(), // Equator Horizon Right
      //
      // Z: Point(), // North Pole
      // M: Point(), // Arctic Circle Tangent Point
      // O: Point(), // Arctic Circle Tangent Equator 1
      // H: Point(), // Arctic Circle Tangent Point 2
      // P: Point(), // Arctic Circle Tangent Equator 2
      // L: Point(), // Intersection of dirunal arc and Horizon
      //
      // T: Point(), // Zenith 2
      // N: Point(),
      // S: Point(),
    };

    p.X = Point(0, 90);
    p.E = Point(0,0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.Z = Point(90, () => v.latitude_1);
    p.A = Point(-90, () => 90-v.latitude_1);
    p.C = Point(90, () => v.latitude_1 - 90);
    p.H = Point(() => 90 + v.ZXH, () => 90 - v.XH);
    p.M = Point(() => 90 - v.ZXH, () => 90 - v.XH);
    p.P = () => v.XH != 0 ? distanceAlongArc(p.X, p.H(), -v.XO) : Point(0, 0);
    p.O = () => v.XH != 0 ? distanceAlongArc(p.X, p.M(), -v.XO) : Point(180, 0);
    p.T = distanceAlongSmallCircle(p.Z, p.X, () => -v.longitude, () => v.latitude_2);

    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)),
      meridian: new Equator(Point(0, 0)),
      // ST: new Arc(p.S, p.T, { end:70 }),
      // TZ: new Arc(p.T, p.Z),
      // TN: new Arc(p.N, p.T),
    };

    g.equator = new Equator(p.Z); 
    g.arcticCircle = new LatitudeCircle(p.Z, () => 90 - v.obliquity);
    g.XH = new Arc(p.P, p.H, { end: 20 });
    g.XM = new Arc(p.O, p.M, { end: 20 });
    g.ZM = new Arc(p.Z, p.M);
    g.ZH = new Arc(p.Z, p.H);

    this.createPointGeometries(p);
  }

  updateCalculations() {
    const v = this.variables;
    this.lat_x_slider?.setRange(0, 90-this.variables.obliquity);
    this.lat_t_slider?.setRange(this.variables.latitude_1, 90-this.variables.obliquity);

    v.ZXH = TriangleSolver.angleFromOppositeAndHypotenuse(v.obliquity, 90 - v.latitude_1); 
    v.XH = TriangleSolver.thirdSide(90 - v.latitude_1, v.obliquity);
    v.XO = TriangleSolver.hypoteneusFromAdjacent(v.ZXH, v.latitude_1);

    // p.T.copy(distanceAlongSmallCircle(p.Z, p.X, -lon, lat2));
    //
    // const TN = asin(sin(lat2_C) * sin(lon));
    // const AN = asin(sin(lat2) / sin(90-TN));
    // p.N.copy(distanceAlongArc(p.Z, p.X, 90-AN));
    //
    // const XN = AN - lat1;
    // const TX = acos(cos(TN) * cos(XN));
    // const mNXT = asin(sin(TN)/sin(TX));
    // p.S.copy(Point(-90+mNXT, cos(mNXT) * lat1_C));
  }

  setupGui(gui) {
    this.lat_x_slider = gui.addSlider('Latitude X', this.variables, 'latitude_1', 0, 90);
    this.lat_t_slider = gui.addSlider('Latitude T', this.variables, 'latitude_2', 0, 90);
    this.lon_slider = gui.addSlider('Longitude', this.variables, 'longitude', -180, 180);
    // this.obliquity_slider = gui.addSlider('Obliquity', this.variables, 'obliquity', 0, 90);
  //   gui.add(this.parameters, 'latitude_1', 0, 90);
  //   gui.add(this.parameters, 'declination', 0, 90);
  //   gui.add(this.parameters, 'obliquity', 0, 90);
  //   gui.add(this.parameters, 'latitude_2', 0, 90);
  //   gui.add(this.parameters, 'longitude', -45, 45);
  }

}
