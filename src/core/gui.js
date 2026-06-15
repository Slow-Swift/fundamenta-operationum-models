export class ModelGui {

  constructor() {
    this.initializeDomElement();
  }

  initializeDomElement() {
    this.domElement = document.createElement('div');
    this.domElement.classList.add('model-gui');
 }

  addArrows(leftCallback, rightCallback) {
    this.arrows = document.createElement('div');
    this.arrows.classList.add('arrows-container')

    this.leftArrow = document.createElement('div');
    this.leftArrow.classList.add('arrow');
    this.leftArrow.innerHTML = '&#x2190;';
    this.leftArrow.onclick = leftCallback;
    this.arrows.appendChild(this.leftArrow);

    this.rightArrow = document.createElement('div');
    this.rightArrow.classList.add('arrow');
    this.rightArrow.innerHTML = '&#x2192;'
    this.rightArrow.onclick = rightCallback;
    this.arrows.appendChild(this.rightArrow);

    this.domElement.appendChild(this.arrows);
  }


} 
