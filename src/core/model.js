import * as THREE from "three";
import { PointGeom } from "../geometry/point_geometry";
import { Label } from "../geometry/label";
import { warn } from "jsxgraph";
import { array } from "three/tsl";

export class Model {

  constructor() {
    this.scene = new THREE.Scene();
    this.points = {};
    this.geometry = {};
    this.animations = [];
    this.lazy = true;
  }

  setup(gui) { 
    this.createModel();
    this.update();

    for (const geometry in this.geometry) {
      this.scene.add(this.geometry[geometry].mesh);
    }

    this.gui = gui;
    this.setupGui(gui);
    if (this.lazy) { gui.onSliderChanged = () => this.update() }
    
    this.setState(1);
  }

  update(time) {
    this.updateCalculations();
       
    for (const geometry in this.geometry) {
      this.geometry[geometry].update(time);
    }
  }

  updateRender(time, camera) {
    // Update Animations
    for (const animation of this.animations) {
      animation.update(time);
    }
    this.animations = this.animations.filter(a => !a.completed);

    for (const geometry in this.geometry) {
      this.geometry[geometry].updateRender(time, camera);
    }
  }

  cancelAnimations() {
    for (const animation of this.animations) {
      animation.complete();
    }
    this.animations.length = 0;
  }

  addAnimation(animation) {
    if (Array.isArray(animation)) {
      this.animations.push(...animation);
    } else {
      this.animations.push(animation);
    }
  }

  setState() {}

  dispose() {
    this.gui.onSliderChanged = undefined;

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
      pointGeom.addChild(new Label(point, new THREE.Vector3(0, 0, 0)));
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
