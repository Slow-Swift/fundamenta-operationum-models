import { CSS2DObject } from "three/examples/jsm/Addons.js";
import katex from "katex";
import { Vector3 } from "three/webgpu";
import { distance, distanceAlongArc, distanceAlongSmallCircle, Point } from "../math/spherical";
import { mod, round } from "../math/degMath";

export class Label {

  constructor(text='', position=[0,0,0], { visible=true }={}) {
    this.text = text;
    this.position = position;
    this.div = document.createElement('div');
    this.div.classList.add('model-label');
    this.mesh = new CSS2DObject(this.div);
    this.visible = visible;
    this.mesh.visible = this.visible;
  }

  setVisible(visible) {
    this.visible = visible;
    this.mesh.visible = visible;
  }

  update() {
    const position = typeof(this.position) == 'function' ? this.position() : this.position;
    const text = typeof(this.text) == 'function' ? this.text() : this.text;

    katex.render((text ?? '').toString(), this.div, { displayMode: false });
    this.mesh.position.copy(position);
  }

  updateRender(time, camera) {
    const p = this.mesh.getWorldPosition(new Vector3());
    const camVec = camera.position.clone().normalize();
    const visibility = p.dot(camVec);

    if (visibility < -0.12) {
     this.mesh.element.style.opacity = '0';
    } else if (visibility < 0) {
      this.mesh.element.style.opacity = String((visibility + 0.12) / 0.12);
    } else {
      this.mesh.element.style.opacity = '1';
    }
  }

  setTheme() {}

  dispose() {}

}

export class ArcLabel extends Label {

constructor(pointA, pointB, { pole = undefined, formatter=undefined, swap=false, shortest=true,...args } = {}) {
    super('', Point(0,0), args);
    this.pointA = pointA;
    this.pointB = pointB;
    this.pole = pole;
    this.formatter = formatter;
    this.shortest = shortest;
    this.swap = swap;
  }

  update() {
    const swap = typeof(this.swap) == 'function' ? this.swap() : this.swap;
    let pointA = typeof(this.pointA) == 'function' ? this.pointA() : this.pointA;
    let pointB = typeof(this.pointB) == 'function' ? this.pointB() : this.pointB;
    if (swap) [pointA, pointB] = [pointB, pointA];
    const pole = typeof(this.pole) == 'function' ? this.pole() : this.pole;
    const shortest = typeof(this.shortest) == 'function' ? this.shortest() : this.shortest;
    const length = distance(pointA, pointB, pole); 
    const flip = shortest && length > 180;
    this.text = this.formatter ? this.formatter(length) : degreeFormatter(flip ? 360 - length: length);
    this.mesh.visible = this.visible;

    if (pole === undefined) {
      if (length == 180) { this.mesh.visible = false }
      else {
        this.position = distanceAlongArc(pointA, pointB, length / 2);
      }
    } else {
      this.position = distanceAlongSmallCircle(pole, pointA, flip ? -(360 - length) / 2 : length / 2);
    }

    super.update();
  }
}

export function degreeFormatter(text) {
  return `${round(text, 1)}^\\circ`;
}

export function northSouthFormatter(text) {
  text = mod(Number(text) + 180, 360) - 180;
  return `${degreeFormatter(Math.abs(text))} ${text < 0 ? 'S' : 'N'}`;
}
