import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, pole, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round, mod } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { Label } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition13, proposition14, proposition16, proposition18, proposition2, proposition5 } from "../math/propositions";
import { LatitudeCircle } from "../geometry/latitude_circle";

export class Proposition43 extends Model {

  constructor() {
    super();
    this.variables = {
      latitude: 60,
      sunRadius: 10,
      moonRadius: 7,
      moonLatitude: 10,
      sunLongitude: 50,
      solarTime: 9,
      obliquity: 23.5,
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {};
    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      meridian: new Equator(Point(0, 0)),
      horizon: new Equator(Point(0, 90)),
    };

    p.Z = Point(0,90);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.X = Point(90, () => v.latitude);
    p.O = Point(0,0);
    p.S_e = distanceAlongSmallCircle(p.X, p.O, () => v.SO, 0);
    p.S = distanceAlongArc(p.S_e, p.X, () => v.sunDeclination);
    p.H = distanceAlongArc(p.Z, p.S, 90);
    p.S_p = distanceAlongSmallCircle(p.S, p.Z, () => -v.ZSC, 0);
    p.P = pole(p.S, p.S_p);
    p.G = distanceAlongSmallCircle(p.P, p.S, () => v.SG, 0);
    p.L = distanceAlongArc(p.G, p.P, () => v.moonLatitude);
    p.K = distanceAlongArc(p.S, p.L, () => -v.SK);
    p.E = distanceAlongArc(p.S, p.S_p, () => v.SE);
    p.A = distanceAlongSmallCircle(p.P, p.O, -90, 0);
    p.C = distanceAlongSmallCircle(p.P, p.O, 90, 0);

    // *** Geometry ***
    g.equator = new Equator(Point(90, () => v.latitude));
    g.ZH = new Arc(p.Z, p.H);
    g.ecliptic = new Equator(p.P);
    g.sun = new LatitudeCircle(p.S, () => 90 - v.sunRadius, {thickness:1});
    g.moon = new LatitudeCircle(p.L, () => 90 - v.moonRadius, {thickness: 1});
    g.LG = new Arc(p.L, p.G);
    g.LS = new Arc(p.L, p.S);
    g.SK = new Arc(p.S, p.K);
    g.SH = new Arc(p.S, p.H);

    g.LGS = new RightAngle(p.G, p.L, p.S);
    g.SHK = new RightAngle(p.H, p.S, p.K);

    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.equator, g.S_e, g.S_p]);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    this.moonLatSlider?.setRange(0, v.sunRadius + v.moonRadius);

    v.SO = 90 - v.solarTime * 180 / 12;
    v.sunDeclination = proposition2(v.sunLongitude, v.obliquity);
    v.SH = proposition13(v.sunDeclination, 90 + v.SO, v.latitude);
    v.ZSC = proposition18(v.sunLongitude, 90-v.SO, v.latitude, v.obliquity);
    v.LSG = TriangleSolver.angleFromOppositeAndHypotenuse(v.moonLatitude, v.sunRadius + v.moonRadius);
    v.SG = TriangleSolver.adjacent(v.LSG, v.sunRadius + v.moonRadius);
    v.LSZ = v.ZSC - v.LSG;
    v.SK = TriangleSolver.hypoteneusFromAdjacent(v.LSZ, v.SH);
    v.SE = TriangleSolver.hypoteneusFromAdjacent(180-v.ZSC, v.SH);
  }

  setupGui(gui) {
    gui.addSlider('Latitude', this.variables, 'latitude', 0, 90);
    gui.addSlider('Solar Time', this.variables, 'solarTime', 0, 12);
    gui.addSlider('Sun Ecliptic Longitude', this.variables, 'sunLongitude', -180, 180);
    this.moonLatSlider = gui.addSlider('Moon Ecliptic Latitude', this.variables, 'moonLatitude', 0, 20);
    gui.addSlider('Sun Radius', this.variables, 'sunRadius', 0, 20);
    gui.addSlider('Moon Radius', this.variables, 'moonRadius', 0, 20);
  }

}


