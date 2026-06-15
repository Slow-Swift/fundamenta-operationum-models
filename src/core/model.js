import * as THREE from "three";
import { PointGeom } from "../geometry/point_geometry";
import { Label } from "../geometry/label";
import { warn } from "jsxgraph";

export class Model {

  constructor() {
    this.scene = new THREE.Scene();
    this.points = {};
    this.geometry = {};
    this.lazy = true;
  }

  setup(gui, newGui) { 
    this.createModel();
    this.update();

    for (const geometry in this.geometry) {
      this.scene.add(this.geometry[geometry].mesh);
    }

    this.setupGui(gui, newGui);
    if (this.lazy) { gui.onChange(e => this.update()) }
    
    this.setState(1);
  }

  update() {
    this.updateCalculations();
       
    for (const geometry in this.geometry) {
      this.geometry[geometry].update();
    }
  }

  setState() {}

  dispose() {
    for (const geometry in this.geometry) {
      this.scene.remove(this.geometry[geometry].mesh);
      this.geometry[geometry].dispose();
    }

    this.points = {};
    this.geometry = {};
  }

  createPointGeometries(points, hidden=[]) {
    this.pointGeometries = {};
    for (const point in points) {
      const pointGeom = new PointGeom(points[point], {color: 0x967e62, darkColor: 0x81694d, visible: !hidden.includes(points[point])});
      this.geometry[point] = pointGeom;
      this.pointGeometries[point] = pointGeom;
      pointGeom.mesh.add(new Label(point, new THREE.Vector3(0, 0, 0)).mesh);
    }
  }

  setGeometryVisibility(visible, geometry) {
    for (const geom of geometry) {
      geom.setVisible(visible);
    }
  }

  updatePointSize(zoom) {
    for (const point in this.pointGeometries) {
      this.pointGeometries[point].setScale(1/zoom); 
    }
  }

  createModel() {}

  setupGui(gui) {}

  updateCalculations() {}

}
