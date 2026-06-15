import { CSS2DObject } from "three/examples/jsm/Addons.js";
import katex from "katex";

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
    katex.render(this.text.toString(), this.div, { displayMode: false });
    // this.div.textContent = this.text;
    this.mesh.position.copy(this.position);
  }

  dispose() {}

}
