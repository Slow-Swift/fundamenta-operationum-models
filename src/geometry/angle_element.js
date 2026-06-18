import { smallCircleArc, projectToEquator, distanceAlongSmallCircle } from "../math/spherical";
import { LineElement } from "./LineElement";
import { sin, cos, tan, asin, acos, atan } from "../math/degMath";
import { Label } from "./label";

export class AngleElement extends LineElement {
  
  constructor(center, leftPoint, rightPoint, { label=true, thickness=2, ...args}={}) {
    super({thickness: thickness, ...args});
    this.center = center;
    this.leftPoint = leftPoint;
    this.rightPoint = rightPoint;
    this.showLabel = label;
    this.label = new Label();
    this.mesh.add(this.label.mesh);
  }

  generatePoints() {
    const leftDst = acos(this.center.clone().dot(this.leftPoint));
    const rightDst = acos(this.center.clone().dot(this.rightPoint));
    const distance = Math.min(7, leftDst/2, rightDst/2);

    const angle = acos(projectToEquator(this.leftPoint, this.center).dot(projectToEquator(this.rightPoint, this.center)));

    if (this.showLabel) {
      this.label.text = distance > 0 ? Math.round(angle * 10) / 10 : '';
      this.label.position = distanceAlongSmallCircle(this.center, this.rightPoint, angle/2, 90-distance-4, true);
      this.label.update();
    } 

    const points = smallCircleArc(this.center, this.rightPoint, this.leftPoint, 0, 0, 90-distance);
    return points;
  }

  update(...args) {
    super.update(...args);
  }
}
