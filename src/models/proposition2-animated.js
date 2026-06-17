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
import { RightAngle } from "../geometry/right_angle";
import { Animation } from "../core/animation";

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
      g_angleLabel: new Label(),

      GH: new Arc(p.G, p.H),
      EG: new Arc(p.E, p.G),
      EH: new Arc(p.E, p.H),
      obliquity_angle: new AngleElement(p.E, p.B, p.A), 
      e_angle: new AngleElement(p.E, p.G, p.H),
      h_angle: new RightAngle(p.H, p.E, p.G),
    };

    this.createPointGeometries(p);
    this.state = 1;
  }

  updateCalculations() {
    this.points.B.copy(Point(90, this.parameters.obliquity));
    this.points.D.copy(Point(-90, -this.parameters.obliquity));
    this.points.G.copy(distanceAlongArc(this.points.E, this.points.B, this.parameters.g_angle, true));
    this.points.H.copy(distanceAlongArc(this.points.F, this.points.G, 90));

    this.geometry.FG.point2 = this.parameters.g_angle > 0 ? this.points.H : this.points.G;

    const declination = Math.asin(Math.sin(degToRad(this.parameters.obliquity)) * Math.sin(degToRad(this.parameters.g_angle)));
    const decLabelPos = distanceAlongArc(this.points.G, this.points.H, radToDeg(Math.abs(declination)) / 2);
    const rightAscension = acos(cos(this.parameters.g_angle) / cos(radToDeg(declination)));
    decLabelPos.x += 0.15;
    this.geometry.declinationLabel.position = Point(rightAscension + 5, radToDeg(declination) / 2);
    this.geometry.declinationLabel.text = Math.round(radToDeg(declination * 10))/10;

    this.geometry.g_angleLabel.text = Math.round(this.parameters.g_angle * 10)/10;
    this.geometry.g_angleLabel.position = distanceAlongLatitude(Point(-90, 90-this.parameters.obliquity), 5, this.parameters.g_angle / 2);
  }

  setState(state) {
    this.cancelAnimations(); 
    const g = this.geometry;

    for (const geom in g) {
      g[geom].setVisible(false);
    }
    g.sphere.setVisible(true);
   
    for (let s = 1; s<=state; s++) {
      switch (s) {
        case 0:
        case 1:
          this.gui.clearTextLines();
          this.gui.addTextLine(
            "<Strong>Task</Strong>: Given a point $G$ on eclipic $DEB$, find the declination of $G$ to the equator CEA."
          );
          this.setGeometryVisibility(true, [g.equator, g.ecliptic, g.E, g.B, g.D, g.C, g.A, g.G, g.g_angleLabel, g.obliquity_angle]);
          break;
        case 2:
          this.gui.addTextLine(
            "Draw an arc from the North Pole $F$ through $G$, intersecting the equator at $H$."
          );
          this.setGeometryVisibility(true, [g.F, g.H, g.FG,  g.e_angle, g.h_angle]);
          this.setGeometryVisibility(false, [g.obliquity_angle]);
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
          this.setGeometryVisibility(true, [g.F, g.ecliptic, g.equator, g.FG, g.B, g.A, g.C, g.D]);
          break;
      }
    }
  }

  advanceAnimation() {
    if (this.state >= 8) return;
    this.state++;
    this.setState(this.state-1);

    const g = this.geometry;

    switch (this.state) {
      case 2:
        this.gui.addTextLine(
          "Draw an arc from the North Pole $F$ through $G$, intersecting the equator at $H$."
        );
        this.setGeometryVisibility(true, [g.F, g.FG, g.e_angle]);
        this.setGeometryVisibility(false, [g.obliquity_angle]);
        this.addAnimation([
          Animation.AnimateGeometry(g.FG, 'end', 0.5, (p) => -g.FG.angle() * (1-p), 0),
          Animation.AfterDelay(0.5, () => this.setGeometryVisibility(true, [g.H, g.h_angle])),
        ]);
        break;
      case 3:
        this.gui.clearTextLines();
        this.gui.addTextLine("Consider triangle $EHG$.");
        this.setGeometryVisibility(true, [g.EG, g.GH, g.EH]);
        this.setGeometryVisibility(false, [g.F, g.A, g.B, g.C, g.D]);
        this.addAnimation([
          Animation.AnimateGeometry(g.FG, 'start', 0.5, (p) => g.FG.angle() * p, 0),
          Animation.AnimateGeometry(g.equator, 'length', 0.65, (p) => 360 * (1-p), 360),
          Animation.AnimateGeometry(g.ecliptic, 'length', 0.9, (p) => 360 * (1-p), 360),
          Animation.AfterDelay(0.5, () => this.setGeometryVisibility(false, [g.FG])),
          Animation.AfterDelay(0.65, () => this.setGeometryVisibility(false, [g.equator])),
          Animation.AfterDelay(0.9, () => this.setGeometryVisibility(false, [g.ecliptic])),
        ]);
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
        this.setGeometryVisibility(true, [g.ecliptic, g.equator, g.FG]);
        this.addAnimation([
          Animation.AnimateGeometry(g.FG, 'start', 0.5, (p) => g.FG.angle() * (1-p), 0),
          Animation.AnimateGeometry(g.equator, 'length', 0.65, (p) => 360 * p, 360),
          Animation.AnimateGeometry(g.ecliptic, 'length', 0.9, (p) => 360 * p, 360),
          Animation.AfterDelay(0.5, () => this.setGeometryVisibility(true, [g.F])),
          Animation.AfterDelay(0.65, () => this.setGeometryVisibility(true, [g.B, g.D])),
          Animation.AfterDelay(0.9, () => this.setGeometryVisibility(true, [g.A, g.C])),
        ]);
        break;
    }
  }

  reverseAnimation() {
    if (this.state <= 1) return;
    this.state--;
    this.setState(this.state+1);

    const g = this.geometry;

    switch (this.state) {
      case 1:
        this.gui.removeTextLine();
        this.setGeometryVisibility(false, [g.H, g.h_angle, g.e_angle]);
        this.setGeometryVisibility(true, [g.obliquity_angle]);
        this.addAnimation([
          Animation.AnimateGeometry(g.FG, 'end', 0.5, (p) => -g.FG.angle() * p, 0),
          Animation.AfterDelay(0.5, () => this.setGeometryVisibility(false, [g.FG])),
        ]);
        break;
      case 2:
        this.gui.clearTextLines();
        this.gui.addTextLine(
          "<Strong>Task</Strong>: Given a point $G$ on eclipic $DEB$, find the declination of $G$ to the equator CEA."
        );
        this.gui.addTextLine(
          "Draw an arc from the North Pole $F$ through $G$, intersecting the equator at $H$."
        );

        this.setGeometryVisibility(true, [g.FG, g.equator, g.ecliptic]);
        this.addAnimation([
          Animation.AnimateGeometry(g.FG, 'start', 0.5, (p) => g.FG.angle() * (1-p), 0),
          Animation.AnimateGeometry(g.equator, 'length', 0.65, (p) => 360 * p, 360),
          Animation.AnimateGeometry(g.ecliptic, 'length', 0.9, (p) => 360 * p, 360),
          Animation.AfterDelay(0.5, () => this.setGeometryVisibility(true, [g.F])),
          Animation.AfterDelay(0.65, () => this.setGeometryVisibility(true, [g.B, g.D])),
          Animation.AfterDelay(0.9, () => this.setGeometryVisibility(true, [g.A, g.C])),
        ]);
       break;
      case 3:
      case 4:
      case 5:
        this.gui.removeTextLine();
        break;
      case 6:
        this.gui.removeTextLine();
        this.setGeometryVisibility(false, [g.declinationLabel]);
        break;
      case 7:
        this.gui.clearTextLines();
        this.gui.addTextLine("Consider triangle $EHG$.");
        this.gui.addTextLine("$\\angle H$ is right, $\\angle E$ is the obliquity, and side EG is given");
        this.gui.addTextLine("The law of sines gives: $$\\frac{\\sin{ EG}}{\\sin{\\angle H}} = \\frac{\\sin{GH}}{\\sin{\\angle E}}$$");
        this.gui.addTextLine("Solving for $\\sin{GH}$ gives: $$\\sin{GH} = \\sin{EG}\\cdot \\sin{\\angle E}$$");
        this.gui.addTextLine("Which is the sought declination");
        this.setGeometryVisibility(false, [g.F, g.B, g.D, g.A, g.C]);
        this.setGeometryVisibility(true, [g.ecliptic, g.equator, g.FG]);
        this.addAnimation([
          Animation.AnimateGeometry(g.FG, 'start', 0.5, (p) => g.FG.angle() * p, 0),
          Animation.AnimateGeometry(g.equator, 'length', 0.65, (p) => 360 * (1-p), 360),
          Animation.AnimateGeometry(g.ecliptic, 'length', 0.9, (p) => 360 * (1-p), 360),
          Animation.AfterDelay(0.5, () => this.setGeometryVisibility(false, [g.FG])),
          Animation.AfterDelay(0.65, () => this.setGeometryVisibility(false, [g.equator])),
          Animation.AfterDelay(0.9, () => this.setGeometryVisibility(false, [g.ecliptic])),
        ]);
        break;
    }

  }

  setupGui(gui) {
    gui.addArrows(this.reverseAnimation.bind(this), this.advanceAnimation.bind(this));
    gui.addSlider('Obliquity', this.parameters, 'obliquity', 0, 89);
    gui.addSlider('G Angle', this.parameters, 'g_angle', -178, 179);
    this.gui = gui;
  }

}
