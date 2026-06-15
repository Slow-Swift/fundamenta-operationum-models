import { distanceAlongArc, distanceAlongLatitude, Point } from "../math/spherical";
import { Equator } from "../geometry/great_circle";
import { Label } from "../geometry/label";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { Model } from "../core/model";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { AngleElement } from "../geometry/angle_element";
import { sin, cos, tan, asin, acos, atan } from "../math/degMath";

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
      obliquityLabel: new Label(),
      g_angleLabel: new Label(),

      GH: new Arc(p.G, p.H),
      EG: new Arc(p.E, p.G),
      EH: new Arc(p.E, p.H),
      angle: new AngleElement(p.E, p.B, p.A), 
    };

    this.createPointGeometries(p);
    this.state = 1;
  }

  updateCalculations() {
    this.points.B.copy(Point(90, this.parameters.obliquity));
    this.points.D.copy(Point(-90, -this.parameters.obliquity));
    this.points.G.copy(distanceAlongArc(this.points.E, this.points.B, this.parameters.g_angle));
    this.points.H.copy(distanceAlongArc(this.points.F, this.points.G, 90));

    this.geometry.FG.point2 = this.parameters.g_angle > 0 ? this.points.H : this.points.G;

    const declination = Math.asin(Math.sin(degToRad(this.parameters.obliquity)) * Math.sin(degToRad(this.parameters.g_angle)));
    const decLabelPos = distanceAlongArc(this.points.G, this.points.H, radToDeg(Math.abs(declination)) / 2);
    const rightAscension = acos(cos(this.parameters.g_angle) / cos(radToDeg(declination)));
    decLabelPos.x += 0.15;
    this.geometry.declinationLabel.position = Point(rightAscension + 5, radToDeg(declination) / 2);
    this.geometry.declinationLabel.text = Math.round(radToDeg(declination * 10))/10;

    this.geometry.obliquityLabel.text = Math.round(this.parameters.obliquity * 10)/10;
    this.geometry.obliquityLabel.position = distanceAlongLatitude(this.points.E, 80, 90 + this.parameters.obliquity / 2);

    this.geometry.g_angleLabel.text = Math.round(this.parameters.g_angle * 10)/10;
    this.geometry.g_angleLabel.position = distanceAlongLatitude(Point(-90, 90-this.parameters.obliquity), 5, this.parameters.g_angle / 2);
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
          this.gui.clearTextLines();
          this.gui.addTextLine(
            "<Strong>Task</Strong>: Given a point $G$ on eclipic $DEB$, find the declination of $G$ to the equator CEA."
          );
          this.setGeometryVisibility(true, [g.equator, g.ecliptic, g.E, g.B, g.D, g.C, g.A, g.G, g.obliquityLabel, g.g_angleLabel]);
          break;
        case 2:
          this.gui.addTextLine(
            "Draw an arc from the North Pole $F$ through $G$, intersecting the equator at $H$."
          );
          this.setGeometryVisibility(true, [g.F, g.H, g.FG, g.GH]);
          break;
        case 3:
          this.gui.clearTextLines();
          this.gui.addTextLine("Consider triangle $EHG$.");
          this.setGeometryVisibility(true, [g.EG, g.GH, g.EH]);
          this.setGeometryVisibility(false, [g.F, g.ecliptic, g.equator, g.FG, g.C, g.D, g.B, g.A]);
          break;
        case 4:
          this.gui.addTextLine("$\\angle H$ is right, $\\angle E$ is the obliquity, and side EG is given");
          break;
        case 5:
          this.gui.addTextLine("The law of sines gives: $$\\frac{\\sin{ EG}}{\\sin{\\angle H}} = \\frac{\\sin{GH}}{\\sin{\\angle E}}$$");
          break;
        case 6:
          this.gui.addTextLine("Solving for $\\sin{GH}$ gives: $$\\sin{GH} = \\sin{EG}\\cdot \\sin{\\angle E}$$");
          break;
        case 7:
          this.gui.addTextLine("Which is the sought declination");
          this.setGeometryVisibility(true, [g.declinationLabel]);
          break;
        case 8:
          this.gui.clearTextLines();
          this.setGeometryVisibility(true, [g.F, g.ecliptic, g.equator, g.FG]);
          break;
      }
    }
  }

  advanceAnimation() {
    if (this.state >= 8) return;
    this.state++;
    this.setState(this.state);
  }

  reverseAnimation() {
    if (this.state <= 1) return;
    this.state--;
    this.setState(this.state);
  }

  setupGui(gui, newGui) {
    gui.add(this.parameters, 'obliquity', 0, 90);
    gui.add(this.parameters, 'g_angle', -179, 179);
    newGui.addArrows(this.reverseAnimation.bind(this), this.advanceAnimation.bind(this));
    this.gui = newGui;
  }

}
