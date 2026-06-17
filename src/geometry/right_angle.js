import { greatCircleArc, latitudeArc, orthonomalBasis, smallCircleArc, projectToEquator, distanceAlongLatitude, distanceAlongSmallCircle } from "../math/spherical";
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
    this.mesh.add(this.label.mesh);
  }

  generatePoints() {
    const leftDst = Math.abs(acos(this.center.clone().dot(this.leftPoint)));
    const rightDst = Math.abs(acos(this.center.clone().dot(this.rightPoint)));
    const distance = Math.min(7, leftDst, rightDst)/2;

    if (distance < 0.02) {
      return [[0,0,0]];
    }

    const angle = acos(projectToEquator(this.leftPoint, this.center).dot(projectToEquator(this.rightPoint, this.center)));

    if (this.showLabel) {
      this.label.text = Math.round(angle * 10) / 10;
      this.label.position = distanceAlongSmallCircle(this.center, this.leftPoint, this.rightPoint, angle/2, 90-distance-3);
      this.label.update();
    } 

    const poleLeft = projectToEquator(this.leftPoint, this.center);
    const poleRight = projectToEquator(this.rightPoint, this.center);

    const pointsLeft = smallCircleArc(poleLeft, this.center, poleRight, 0, distance - 90, distance);
    const pointsRight = smallCircleArc(poleRight, this.center, poleLeft, 0, distance - 90, distance);

    const points = pointsLeft.concat(pointsRight);
    return points;
  }

  update(...args) {
    super.update(...args);
    
  }
}
