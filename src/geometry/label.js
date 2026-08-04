import { CSS2DObject } from "three/examples/jsm/Addons.js";
import katex from "katex";
import { Vector3 } from "three/webgpu";

export class Label {

  constructor(text='', position=[0,0,0], { visible=true }={}) {
    this.text = text;
    this.position = position;
    this.div = document.createElement('div');
    this.div.classList.add('model-label');
    this.mesh = new CSS2DObject(this.div);
    this.visible = visible;
    this.mesh.visible = this.visible;

    this.update();
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
