import { ModelElement } from "./geometry_element";
import { Line2, LineGeometry, LineMaterial } from "three/examples/jsm/Addons.js";

export class LineElement extends ModelElement {
  constructor({ thickness=5, ...args}={}) {
    super({ themeColor: 'arc-normal', ...args});

    this.thickness = thickness;

    this.material = new LineMaterial();
    this.geometry = new LineGeometry();
    this.mesh = new Line2(this.geometry, this.material);
    this.mesh.visible = this.visible;
  }
  
  update() {
    super.update();

    const points = this.generatePoints();
   
    // Recreate the geometry with the new points
    this.geometry.dispose();
    this.geometry = new LineGeometry();
    this.geometry.setFromPoints(points);
    this.mesh.geometry = this.geometry;
    this.material.setValues({ linewidth: this.thickness });
  }

  generatePoints() { return [] };
}
