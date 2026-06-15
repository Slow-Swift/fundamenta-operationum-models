import { distanceAlongArc, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { Label } from "../geometry/label";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { warn } from "jsxgraph";

export class Proposition2Animated extends Model {

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

      B: Point(false), // Ecliptic-Horizon Right 
      D: Point(), // Ecliptic-Horizon Left

      F: Point(0, 90), // North Pole
      G: Point(),
      H: Point(),
    };


    this.geometry = {
      sphere: new SphereElement(new Vector3(0,0,0), {color: 0xfbe6c3, darkColor: 0x2d253c}),
      equator: new Equator(p.F), 
      ecliptic: new Arc(p.E, p.B, { length: 360 }),
      FG: new Arc(p.F, p.G), 

      declinationLabel: new Label('0', Point()),

      GH: new Arc(p.G, p.H),
      EG: new Arc(p.E, p.G),
      EH: new Arc(p.E, p.H),
    };

    this.createPointGeometries(p);
    this.state = 1;
    this.setState(1);
  }

  updateCalculations() {
    this.points.B.copy(Point(90, this.parameters.obliquity));
    this.points.D.copy(Point(-90, -this.parameters.obliquity));
    this.points.G.copy(distanceAlongArc(this.points.E, this.points.B, this.parameters.g_angle));
    this.points.H.copy(distanceAlongArc(this.points.F, this.points.G, 90));

    this.geometry.FG.point2 = this.parameters.g_angle > 0 ? this.points.H : this.points.G;

    const declination = Math.asin(Math.sin(degToRad(this.parameters.obliquity)) * Math.sin(degToRad(this.parameters.g_angle)));
    const decLabelPos = distanceAlongArc(this.points.G, this.points.H, radToDeg(Math.abs(declination)) / 2);
    decLabelPos.x += 0.15;
    this.geometry.declinationLabel.position = decLabelPos;
    this.geometry.declinationLabel.text = Math.round(radToDeg(declination * 10))/10;
  }

  setState(state) {
    // Cancel Animations 
    
    const g = this.geometry;

    for (const geom in g) {
      g[geom].setVisible(false);
    }
    g.sphere.setVisible(true);
   
    for (let s = 1; s<=state; s++) {
      switch (s) {
        case 1:
          this.setGeometryVisibility(true, [g.equator, g.E, g.F]);
          break;
        case 2:
          this.setGeometryVisibility(true, [g.ecliptic, g.G]);
          break;
        case 3:
          this.setGeometryVisibility(true, [g.FG, g.H]);
          break;
        case 4:
          this.setGeometryVisibility(true, [g.EG, g.GH, g.EH]);
          this.setGeometryVisibility(false, [g.F, g.ecliptic, g.equator, g.FG]);
          break;
        case 5:
          this.setGeometryVisibility(true, [g.declinationLabel]);
          break;
        case 6:
          this.setGeometryVisibility(true, [g.F, g.ecliptic, g.equator, g.FG]);
      }
    }
  }

  advanceAnimation() {
    this.state++;
    this.setState(this.state);
  }

  reverseAnimation() {
    this.state--;
    this.setState(this.state);
  }

  setupGui(gui, newGui) {
    gui.add(this.parameters, 'obliquity', 0, 90);
    gui.add(this.parameters, 'g_angle', -179, 179);
    newGui.addArrows(this.reverseAnimation.bind(this), this.advanceAnimation.bind(this));
  }

}
