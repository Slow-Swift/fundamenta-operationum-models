export class ModelElement {

  constructor({ color=0x7b6148, darkColor=0xad946f, visible=true }={}) {
    this.lightColor = color;
    this.color = this.lightColor;
    this.darkColor = darkColor;
    this.visible = visible; 
    this.children = [];
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

  updateRender(time, camera) {
    for (const child of this.children) {
      child.updateRender(time, camera);
    }
  }

  addChild(child) {
    this.children.push(child);
    this.mesh?.add(child.mesh);
  }
  
  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      this.children.splice(index, 1);
      this.mesh?.remove(child.mesh);
    }
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
    this.children.length = 0;
  }
}

