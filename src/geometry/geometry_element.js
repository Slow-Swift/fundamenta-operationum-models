export class ModelElement {

  constructor({ color=0x7b6148, darkColor=0xad946f, visible=true }={}) {
    this.lightColor = color;
    this.color = this.lightColor;
    this.darkColor = darkColor;
    this.visible = visible; 
  }

  setVisible(visible) {
    this.visible = visible;
    if (this.mesh) {
      this.mesh.visible = visible;
    }
  }

  update() {
    this.color = window.settings.darkMode && this.darkColor != undefined ? this.darkColor : this.lightColor; 
    this.material.setValues({ color: this.color });
  }

  dispose() {
    this.geometry?.dispose();
    this.material?.dispose();

    if (this.mesh) {
      while(this.mesh.children.length > 0) {
        this.mesh.remove(this.mesh.children[0]);
      }

      this.mesh = null;
    }
  }
}

