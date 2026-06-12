import { distanceAlongArc, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { Label } from "../geometry/label";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { LatitudeCircle } from "../geometry/latitude_circle";
import { SmallCircleArc } from "../geometry/small_circle_arc";

export class Proposition9 extends Model {

  constructor() {
    super();

    this.parameters = {
      latitude: 40,
      declination: 30,
      obliquity: 23.44,
    };
  }

  createModel() {
    const p = this.points = {
      E:  Point(0, 0), // Horizon Centre
      B:  Point(-90, 0), // Horizon South
      D:  Point(90, 0), // Horizon North
      
      A:  Point(), // Equator Horizon Left
      C:  Point(), // Equator Horizon Right

      Z: Point(), // South Pole
      K: Point(), // Projection of H
      H: Point(), // Intersection of Horizon and Ecliptic
      L: Point(), // Intersection of dirunal arc and Horizon
    };


    this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      horizon: new Equator(Point(0, 90)),
      equator: new Equator(p.Z),
      meridian: new Equator(p.E),
      ZK: new Arc(p.Z, p.K), 
      declinationLabel: new Label('0', Point()),
      ortiveAmplitudeLabel: new Label('0', Point()),
      urnalLabel: new Label('0', Point()),
      latitude: new SmallCircleArc(p.H, p.L, p.Z),
    };

    this.createPointGeometries(p);
  }

  updateCalculations() {
    this.points.Z.copy(Point(-90, -this.parameters.latitude));
    this.points.A.copy(Point(-90, 90-this.parameters.latitude));
    this.points.D.copy(Point(90, -90+this.parameters.latitude));

    this.points.L.copy(Point(-90, 90-this.parameters.latitude-this.parameters.declination));

    const ortiveSin = Math.sin(degToRad(this.parameters.declination))/Math.sin(degToRad(90-this.parameters.latitude));
    const ortiveAmplitude = radToDeg(Math.asin(ortiveSin));
    this.points.H.copy(Point(-ortiveAmplitude, 0));
    this.points.K.copy(distanceAlongArc(this.points.Z, this.points.H, 90));
    this.geometry.latitude.latitude = this.parameters.declination;

    const urnal = radToDeg(Math.asin(Math.sin(degToRad(90 - ortiveAmplitude))/Math.sin(degToRad(90-this.parameters.declination))));
    
    if (!isNaN(ortiveAmplitude)) {
      this.geometry.ortiveAmplitudeLabel.text = Math.round(ortiveAmplitude*10)/10;
      this.geometry.ortiveAmplitudeLabel.position = Point(-ortiveAmplitude / 2, -5);

      this.geometry.declinationLabel.text = Math.round(this.parameters.declination * 10 / 10);
      this.geometry.declinationLabel.position = distanceAlongArc(this.points.H, this.points.K, this.parameters.declination/2);

      this.geometry.urnalLabel.text = Math.round(urnal * 10)/10; 
      this.geometry.urnalLabel.position = distanceAlongArc(this.points.K, this.points.A, urnal/2);
    } else {
      this.geometry.ortiveAmplitudeLabel.text = "Undefined";
      this.geometry.ortiveAmplitudeLabel.position = Point(-45, -5);
      this.geometry.declinationLabel.text = this.parameters.declination;
      this.geometry.declinationLabel.position = Point(-90, (90 - this.parameters.latitude) / 2);
      this.geometry.urnalLabel.text = "Undefined"; 
      this.geometry.urnalLabel.position = distanceAlongArc(this.points.E, this.points.A, 45);
    }

  }

  setupGui(gui) {
    gui.add(this.parameters, 'latitude', 0, 90);
    gui.add(this.parameters, 'declination', 0, 90);
  }

}
