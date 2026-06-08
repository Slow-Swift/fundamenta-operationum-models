import { CSS2DObject } from "three/examples/jsm/Addons.js";

export class Label {

  constructor(text, position) {
    this.text = text;
    this.position = position;
    this.div = document.createElement('div');
    this.div.classList.add('model-label');
    this.mesh = new CSS2DObject(this.div);

    this.update();
  }

  update() {
    this.div.textContent = this.text;
    this.mesh.position.copy(this.position);
  }

  dispose() {}

}
