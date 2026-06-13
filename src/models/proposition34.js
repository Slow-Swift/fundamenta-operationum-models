import { distanceAlongArc, distanceAlongLatitude, Point, pointFromPole } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { LatitudeCircle } from "../geometry/latitude_circle";
import { sin, cos, tan, asin, acos, atan } from "../math/degMath";


export class Proposition34 extends Model {

  constructor() {
    super();

    this.parameters = {
      latitude_1: 30,
      declination: 30,
      obliquity: 23.44,
      latitude_2: 60,
      longitude: 13,
    };
  }

  createModel() {
    const p = this.points = {
      X:  Point(0, 90), // Zenith
      E:  Point(0, 0), // Horizon Centre
      B:  Point(-90, 0), // Horizon South
      D:  Point(90, 0), // Horizon North
      
      A:  Point(), // Equator Horizon Left
      C:  Point(), // Equator Horizon Right

      Z: Point(), // North Pole
      M: Point(), // Arctic Circle Tangent Point
      O: Point(), // Arctic Circle Tangent Equator 1
      H: Point(), // Arctic Circle Tangent Point 2
      P: Point(), // Arctic Circle Tangent Equator 2
      L: Point(), // Intersection of dirunal arc and Horizon

      T: Point(), // Zenith 2
      N: Point(),
      S: Point(),
    };


    this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(p.X),
      equator: new Equator(p.Z),
      arcticCircle: new LatitudeCircle(p.Z, 90-23.44),
      meridian: new Equator(p.E),
      arcticTangent1: new Arc(p.X, p.M, {end: 20}),
      arcticTangent2: new Arc(p.X, p.H, {end: 20}),
      ZM: new Arc(p.Z, p.M),
      ZH: new Arc(p.Z, p.H), 
      ST: new Arc(p.S, p.T, { end:70 }),
      TZ: new Arc(p.T, p.Z),
      TN: new Arc(p.N, p.T),
    };

    this.createPointGeometries(p);
  }

  updateCalculations() {
    const p = this.points;
    const g = this.geometry;

    const lat1 = this.parameters.latitude_1;
    const lat2 = this.parameters.latitude_2;
    const lat1_C = 90 - lat1;
    const lat2_C = 90 - lat2;
    const lon = this.parameters.longitude;
    const obliquity = this.parameters.obliquity;
    const obliquity_C = 90 - this.parameters.obliquity;

    p.Z.copy(Point(90, lat1));
    p.A.copy(Point(-90, lat1_C));
    p.C.copy(Point(90, -lat1_C));

    g.arcticCircle.latitude = obliquity_C;

    const mZXH = asin(sin(obliquity) / sin(lat1_C));
    const XM = acos(cos(lat1_C)/cos(obliquity));
    const XO = atan( tan(lat1) / cos(mZXH) );
    p.M.copy(Point(90-mZXH, 90 - XM));
    p.H.copy(Point(90+mZXH, 90 - XM));
    p.O.copy(Point(-90-mZXH, 90-XO));
    p.P.copy(Point(-90+mZXH, 90-XO));
    g.arcticTangent1.start = -XO;
    g.arcticTangent2.start = -XO;

    p.T.copy(pointFromPole(p.Z, p.X, lat2, -lon));

    const TN = asin(sin(lat2_C) * sin(lon));
    const AN = asin(sin(lat2) / sin(90-TN));
    p.N.copy(distanceAlongArc(p.Z, p.X, 90-AN));

    const XN = AN - lat1;
    const TX = acos(cos(TN) * cos(XN));
    const mNXT = asin(sin(TN)/sin(TX));
    p.S.copy(Point(-90+mNXT, cos(mNXT) * lat1_C));
}

  setupGui(gui) {
    gui.add(this.parameters, 'latitude_1', 0, 90);
    gui.add(this.parameters, 'declination', 0, 90);
    gui.add(this.parameters, 'obliquity', 0, 90);
    gui.add(this.parameters, 'latitude_2', 0, 90);
    gui.add(this.parameters, 'longitude', -45, 45);
  }

}
