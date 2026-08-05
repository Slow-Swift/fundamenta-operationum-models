import { smallCircleArc, projectToEquator, distanceAlongSmallCircle } from "../math/spherical";
import { LineElement } from "./LineElement";
import { sin, cos, tan, asin, acos, atan } from "../math/degMath";
import { degreeFormatter, Label } from "./label";

export class AngleElement extends LineElement {
  
  constructor(center, leftPoint, rightPoint, { label=true, thickness=2, alwaysSmallest=true, ...args}={}) {
    super({thickness: thickness, ...args});
    this.center = center;
    this.leftPoint = leftPoint;
    this.rightPoint = rightPoint;
    this.showLabel = label;
    this.label = new Label();
    this.alwaysSmallest = alwaysSmallest;
    this.addChild(this.label);
  }

  generatePoints() {
    const center = typeof(this.center) == 'function' ? this.center() : this.center;
    var leftPoint = typeof(this.leftPoint) == 'function' ? this.leftPoint() : this.leftPoint;
    var rightPoint = typeof(this.rightPoint) == 'function' ? this.rightPoint() : this.rightPoint;

    const leftDst = acos(center.clone().dot(leftPoint));
    const rightDst = acos(center.clone().dot(rightPoint));
    const distance = Math.min(7, leftDst/3, rightDst/3);

    let poleLeft = projectToEquator(leftPoint, center);
    let poleRight = projectToEquator(rightPoint, center);
    const alignment = center.clone().cross(poleLeft).dot(poleRight) > 0;

    if(this.alwaysSmallest && alignment > 0) {
      [leftPoint, rightPoint] = [rightPoint, leftPoint];
    }

    const angle = (alignment > 0 && !this.alwaysSmallest ? 180 : 0) + acos(projectToEquator(leftPoint, center).dot(projectToEquator(rightPoint, center)));

    if (this.showLabel) {
      this.label.text = distance > 0 ? degreeFormatter(angle) : '';
      this.label.position = distanceAlongSmallCircle(center, rightPoint, angle/2, 90-distance * 1.3, true);
      this.label.update();
    } 

    const points = smallCircleArc(center, rightPoint, leftPoint, 0, 0, 90-distance);
    return points;
  }

  update(...args) {
    super.update(...args);
  }
}
