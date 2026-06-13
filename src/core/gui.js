export class ModelGui {

  constructor() {
    this.initializeDomElement();
    this.addArrows();
  }

  initializeDomElement() {
    this.domElement = document.createElement('div');
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';
    this.domElement.style.top = '0px';
    this.domElement.style.overflow = 'hidden';
    this.domElement.style.position = 'absolute';
    this.domElement.style.pointerEvents = 'none';
  }

  addArrows() {
    this.arrows = document.createElement('div');
    this.arrows.innerHTML = "<p>Test</p>";
    this.arrows.style.background = 'white';
    this.arrows.style.position = 'absolute';
    this.domElement.appendChild(this.arrows);
  }


} 
