export class ModelElement {

  constructor({ themeColor='normal', visible=true }={}) {
    this.themeColor=themeColor;
    this.visible = visible; 
    this.children = [];
  }

  setVisible(visible) {
    this.visible = visible;
    if (this.mesh) {
      this.mesh.visible = visible;
    }
  }

  update() { }

  updateRender(time, camera) {
    for (const child of this.children) {
      child.updateRender(time, camera);
    }
  }

  setTheme(theme) {
    const color = theme.get(this.themeColor);
    this.material.setValues({ color: color });
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

