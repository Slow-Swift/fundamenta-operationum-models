import renderMathInElement from "katex/contrib/auto-render/auto-render.js";

export class ModelGui {

  constructor() {
    this.initializeDomElement();
  }

  initializeDomElement() {
    this.domElement = document.createElement('div');
    this.domElement.classList.add('model-gui');

    this.arrows = document.createElement('div');
    this.arrows.classList.add('arrows-container')
    this.domElement.appendChild(this.arrows);

    this.textArea = document.createElement('div');
    this.textArea.appendChild(document.createElement('p'));
    this.textArea.classList.add('gui-textarea');
    this.domElement.appendChild(this.textArea);
    this.textLines = [];
 }

  clear() {
    this.arrows.innerHTML = '';
    this.clearTextLines();
  }

  addArrows(leftCallback, rightCallback) {
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

  }

  addTextLine(text) {
    this.textLines.push(text);
    this.renderText();
  }

  clearTextLines() {
    this.textLines.length=0;
    this.renderText();
  }

  renderText() {
    this.textArea.firstElementChild.innerHTML = this.textLines.join('<br><br>');
    renderMathInElement(this.textArea, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ]
    });
  }
} 
