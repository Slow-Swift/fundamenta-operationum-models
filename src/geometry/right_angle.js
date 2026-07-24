import { smallCircleArc, projectToEquator, distanceAlongSmallCircle } from "../math/spherical";
import { LineElement } from "./LineElement";
import { sin, cos, tan, asin, acos, atan } from "../math/degMath";
import { Label } from "./label";

export class RightAngle extends LineElement {
  
  constructor(center, leftPoint, rightPoint, { label=false, thickness=2, ...args}={}) {
    super({thickness: thickness, ...args});
    this.center = center;
    this.leftPoint = leftPoint;
    this.rightPoint = rightPoint;
    this.showLabel = label;
    this.label = new Label();
    this.addChild(this.label);
  }

  generatePoints() {
    const center = typeof(this.center) == 'function' ? this.center() : this.center;
    let leftPoint = typeof(this.leftPoint) == 'function' ? this.leftPoint() : this.leftPoint;
    let rightPoint = typeof(this.rightPoint) == 'function' ? this.rightPoint() : this.rightPoint;

    const leftDst = Math.abs(acos(center.clone().dot(leftPoint)));
    const rightDst = Math.abs(acos(center.clone().dot(rightPoint)));
    const distance = Math.min(7, leftDst, rightDst)/2;

    if (leftDst == 180 || rightDst == 180) return [[0,0,0]];
    if (distance < 0.02) {
      return [[0,0,0]];
    }

    let poleLeft = projectToEquator(leftPoint, center);
    let poleRight = projectToEquator(rightPoint, center);
    const alignment = center.clone().cross(poleLeft).dot(poleRight) > 0
    if(alignment > 0) {
      [poleLeft, poleRight] = [poleRight, poleLeft];
    }

    const angle = acos(poleLeft.dot(poleRight));

    if (this.showLabel) {
      this.label.text = Math.round(angle * 10) / 10;
      this.label.position = distanceAlongSmallCircle(center, rightPoint, angle/2, 90-distance-3);
      this.label.update();
    } 


    const pointsLeft = smallCircleArc(poleLeft, center, poleRight, 0, distance - 90, distance);
    const pointsRight = smallCircleArc(poleRight, center, poleLeft, 0, -distance - 90, distance);

    const points = pointsLeft.concat(pointsRight);
    return points;
  }

  update(...args) {
    super.update(...args);
    
  }
}
