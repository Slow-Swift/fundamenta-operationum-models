import * as THREE from "three";
import { PointGeom } from "../geometry/point_geometry";
import { Label } from "../geometry/label";

export class Model {

  constructor() {
    this.scene = new THREE.Scene();
    this.points = {};
    this.geometry = {};
    this.lazy = true;
  }

  setup(gui) { 
    this.createModel();
    this.update();

    for (const geometry in this.geometry) {
      this.scene.add(this.geometry[geometry].mesh);
    }

    this.setupGui(gui);
    if (this.lazy) { gui.onChange(e => this.update()) }
  }

  update() {
    this.updateCalculations();
       
    for (const geometry in this.geometry) {
      this.geometry[geometry].update();
    }
  }

  dispose() {
    for (const geometry in this.geometry) {
      this.scene.remove(this.geometry[geometry].mesh);
      this.geometry[geometry].dispose();
    }

    this.points = {};
    this.geometry = {};
  }

  createPointGeometries(points) {
    for (const point in points) {
      const pointGeom = new PointGeom(points[point]);
      this.geometry[point] = pointGeom;
      pointGeom.mesh.add(new Label(point, new THREE.Vector3(0, 2, 0)).mesh);
    }
  }

  createModel() {}

  setupGui(gui) {}

  updateCalculations() {}

}
