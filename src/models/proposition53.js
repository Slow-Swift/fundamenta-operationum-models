import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
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
import { proposition14, proposition16, proposition2, proposition5 } from "../math/propositions";
import { LatitudeCircle } from "../geometry/latitude_circle";

export class Proposition53 extends Model {

  constructor() {
    super();
    this.variables = {
      latitude: 50,
      starLatitude: 10, 
      starLongitude: 50,
      arcOfVision: 13,
      obliquity: 23.5
    };
  }

  createModel() {
    const v = this.variables;
    const p = this.points = {};
    const g = this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)),
      meridian: new Equator(Point(0, 0)),
    };

    p.F = Point(0,0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.Z = Point(0, 90);
    p.X = Point(90, () => v.latitude);
    p.O = Point(() => 90 - v.OD, 0);
    p.N = distanceAlongArc(p.O, p.X, () => v.XO + v.obliquity);
    p.P = distanceAlongArc(p.O, p.X, () => v.XO - v.obliquity);
    p.Y = distanceAlongSmallCircle(p.X, p.N, () => (v.starLongitude > 90 && v.starLongitude < 270 ? -1 : 1) * (180 - v.MXO - v.YXM), 90 - v.obliquity);
    p.V = distanceAlongSmallCircle(p.Y, p.X, -90, 0);
    p.V_c = distanceAlongArc(p.Y, p.X, 90);
    p.L = distanceAlongArc(p.V, p.V_c, () => v.starLongitude);
    p.M = distanceAlongArc(p.Y, p.L, () => v.YM);
    p.E = distanceAlongArc(p.V, p.V_c, () => v.starLongitude - v.EL);
    p.H = distanceAlongSmallCircle(p.Z, p.E, () => v.EH, 0);
    p.K = distanceAlongArc(p.V, p.V_c, () => v.starLongitude + v.LK);
    p.A = distanceAlongSmallCircle(p.Y, p.F, -90, 0);
    p.D = distanceAlongSmallCircle(p.Y, p.F, 90, 0);

    g.arcticCircle = new LatitudeCircle(p.X, 90 - v.obliquity);
    g.equator = new Equator(p.X, {thickness: 2});
    g.ecliptic = new Equator(p.Y);
    g.ON = new Arc(p.N, p.O);
    g.YL = new Arc(p.Y, p.L);
    g.XM = new Arc(p.X, p.M);
    g.XY = new Arc(p.X, p.Y);
    g.ZK = new Arc(p.Z, p.K);


    this.createPointGeometries(p);
    this.setGeometryVisibility(false, [g.equator, g.V, g.V_c, g.F]);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.MYX = v.starLongitude - 90;
    v.MX = TriangleSolver.opposite(v.MYX, v.obliquity);
    v.YM = TriangleSolver.adjacent(v.MYX, v.obliquity);
    v.YXM = TriangleSolver.oppositeAngle(v.MYX, v.YM);
    v.minMO = TriangleSolver.thirdSide(v.latitude, v.MX);
    v.maxStarLat = 90 - (v.minMO + v.YM);
    this.starLatitudeSlider?.setRange(0, v.maxStarLat);
    v.OM = 90 - v.starLatitude - v.YM;
    v.XO = acos(cos(v.OM) * cos(v.MX));
    v.DOX = TriangleSolver.angleFromOppositeAndHypotenuse(v.latitude, v.XO);
    
    v.XOM = TriangleSolver.angleFromOppositeAndHypotenuse(v.MX, v.XO);
    v.MXO = TriangleSolver.angleFromOppositeAndHypotenuse(v.OM, v.XO);
    v.OD = TriangleSolver.thirdSide(v.XO, v.latitude);

    v.YOD = v.DOX - v.XOM;
    v.OEL = TriangleSolver.oppositeAngle(v.YOD, v.starLatitude);
    this.aovSlider?.setRange(0, v.OEL);
    v.OE = TriangleSolver.hypoteneusFromAdjacent(v.YOD, v.starLatitude);
    v.EL = TriangleSolver.adjacent(v.OEL, v.OE);
    v.EK = TriangleSolver.hypoteneusFromOpposite(v.OEL, v.arcOfVision);
    v.EH = TriangleSolver.adjacent(v.OEL, v.EK);
    v.LK = v.EK - v.EL;

    if (v.starLongitude > 180) v.YM = 180-v.YM;
  

    // v.VJ = TriangleSolver.hypoteneusFromAdjacent(v.obliquity, v.starLongitude);
    // v.OJ = TriangleSolver.opposite(v.obliquity, v.VJ) + v.starLatitude;
    // v.VJO = TriangleSolver.oppositeAngle(v.obliquity, v.starLongitude); 
    // v.starDeclination = TriangleSolver.opposite(v.VJO, v.OJ);
    
  }

  setupGui(gui) {
    const v = this.variables;
    gui.addSlider('Latitude', this.variables, 'latitude', 0, 90 - v.obliquity);
    gui.addSlider('Star Longitude', this.variables, 'starLongitude', 0, 90);
    this.starLatitudeSlider = gui.addSlider('Star Latitude', this.variables, 'starLatitude', 0, 90);
    this.aovSlider = gui.addSlider('Arc of Vision', this.variables, 'arcOfVision', 0, 20);
  }

}


