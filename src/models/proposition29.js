import { angle, distanceAlongArc, distanceAlongSmallCircle, Point, smallCircleArc } from "../math/spherical";
import { sin, cos, tan, asin, acos, atan, round } from "../math/degMath";
import { Equator } from "../geometry/great_circle";
import { Model } from "../core/model";
import { ArcLabel, Label, northSouthFormatter } from "../geometry/label";
import { Arc } from "../geometry/arc";
import { SphereElement } from "../geometry/sphere_element";
import { Vector3 } from "three";
import { RightAngle } from "../geometry/right_angle";
import { AngleElement } from "../geometry/angle_element";
import * as TriangleSolver from "../math/TriangleSolver";
import { proposition2, proposition5 } from "../math/propositions";

export class Proposition29 extends Model {

  constructor() {
    super();
    this.variables = {
      obliqueAscension: 50,
      eclipticLongitude: 60,
      declination: 10,
      obliquity: 23.5,
      arcLabels: false,
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

    p.E = Point(0,0);
    p.B = Point(-90, 0);
    p.D = Point(90, 0);
    p.H = Point(() => v.EH, 0);
    p.Z = Point(90, () => v.latitude);
    p.A = Point(-90, () => 90 - v.latitude);
    p.C = Point(90, () => v.latitude - 90);
    p.L = distanceAlongArc(p.E, p.A, () => v.obliqueAscension);
    p.K = distanceAlongArc(p.E, p.C, () => v.EK);

    // *** Geometry ***
    g.equator = new Arc(p.E, p.C, {length: 360});
    g.ZK = new Arc(p.Z, p.K);
    g.HL = new Arc(p.L, p.H);

    g.HLE = new AngleElement(p.L, p.H, p.E);
    g.EKH = new RightAngle(p.K, p.H, p.E);
  
    g.LE = new ArcLabel(p.L, p.E, { pole: p.Z });
    g.LH = new ArcLabel(p.L, p.H );
    g.EK = new ArcLabel(p.E, p.K, { pole: p.Z });
    g.HK = new ArcLabel(p.H, p.K);
    g.HEK = new AngleElement(p.E, p.H, p.K);
    g.ZD = new ArcLabel(p.D, p.Z, { pole: p.E, formatter: northSouthFormatter });

    this.createPointGeometries(p);
  }
 
  updateCalculations() {
    const p = this.points;
    const v = this.variables;
    const g = this.geometry;

    v.declination = proposition2(v.eclipticLongitude, v.obliquity);
    v.rightAscension = proposition5(v.eclipticLongitude, v.obliquity);

    v.EK = v.rightAscension - v.obliqueAscension;
    v.EH = TriangleSolver.hypoteneus(v.EK, v.declination);
    v.HEK = TriangleSolver.angleFromOppositeAndHypotenuse(v.declination, v.EH);
    if (v.EK < 0) v.HEK = 180 - v.HEK;
    v.latitude = 90 - v.HEK;

    this.setGeometryVisibility(v.eclipticLongitude > 0, [ g.Z, g.ZK ]);
    this.setGeometryVisibility(v.arcLabels && v.eclipticLongitude > 0, [ g.ZD ]);
    this.setGeometryVisibility(v.arcLabels, [ g.LH, g.LE, g.EK, g.HK, g.HEK, g.HLE ]);
  }

  setupGui(gui) {
    gui.addSlider('Oblique Ascension', this.variables, 'obliqueAscension', 0, 90);
    gui.addSlider('Ecliptic Longitude', this.variables, 'eclipticLongitude', 0, 90);
    gui.addToggle('Show Labels', this.variables, 'arcLabels');
  }
}


