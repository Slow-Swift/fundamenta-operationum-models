import renderMathInElement from "katex/contrib/auto-render/auto-render.js";
import { round } from "../math/degMath";

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

    this.sliderArea = document.createElement('div');
    this.sliderArea.classList.add('gui-sliders');
    this.domElement.appendChild(this.sliderArea);
    this.sliders = [];
  }

  setupPageControls(options, selected, onselected, darkTheme, onThemeChange) {
    this.pageControls = document.createElement('div');
    this.pageControls.classList.add('page-controls');
    this.domElement.appendChild(this.pageControls);

    const dropdownWrapper = document.createElement('div');
    dropdownWrapper.classList.add('select-wrapper');
    this.pageControls.appendChild(dropdownWrapper);

    this.modelDropdown = document.createElement('select');
    this.modelDropdown.classList.add('model-dropdown');
    dropdownWrapper.appendChild(this.modelDropdown);
    this.modelDropdown.oninput = () => onselected(this.modelDropdown.value);

    for (const option in options) {
      const element = document.createElement('option');
      this.modelDropdown.appendChild(element);
      element.value = option;
      element.innerText = option;
    }

    this.modelDropdown.value = selected;

    const toggleWrapper = document.createElement('div');
    toggleWrapper.classList.add('theme-toggle-wrap');

    this.darkToggle = document.createElement('input');
    this.darkToggle.type = 'checkbox';
    this.darkToggle.id = 'theme-toggle';
    this.darkToggle.ariaLabel = 'Toggle dark mode';
    this.darkToggle.classList.add('theme-toggle-input');

    const toggleLabel = document.createElement('label');
    toggleLabel.htmlFor = 'theme-toggle';
    toggleLabel.classList.add('theme-toggle');
    
    const sunIcon = document.createElement('span');
    const moonIcon = document.createElement('span');
    const thumb = document.createElement('span');
    sunIcon.classList.add('theme-icon', 'sun');
    moonIcon.classList.add('theme-icon', 'moon');
    thumb.classList.add('theme-toggle-thumb');
    sunIcon.ariaHidden = 'true';
    moonIcon.ariaHidden = 'true';
    sunIcon.innerText = '☀';
    moonIcon.innerText = '☾';

    toggleWrapper.appendChild(this.darkToggle);
    toggleWrapper.appendChild(toggleLabel);
    toggleLabel.appendChild(thumb);
    toggleLabel.appendChild(sunIcon);
    toggleLabel.appendChild(moonIcon);

    this.pageControls.appendChild(toggleWrapper);
    this.darkToggle.checked = darkTheme;
    this.darkToggle.oninput = () => onThemeChange(this.darkToggle.checked);
  }

  clear() {
    this.arrows.innerHTML = '';
    this.clearTextLines();
    for (const slider of this.sliders) {
      this.sliderArea.removeChild(slider);
    }
    this.sliders.length=0;
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

  removeTextLine() {
    this.textLines.pop();
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

  addSlider(label, object={}, field, min=0, max=90, step=0.1) {
    const slider = document.createElement('div');
    slider.classList.add('slidecontainer');

    const text = document.createElement('p');

    const input = document.createElement('input');
    input.type = 'range';
    input.classList.add('slider');
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = object[field];
    slider.lastSetValue = object[field];
    input.oninput = (e) => {
      text.innerText = `${label}: ${input.value}`;
      const numbericValue = input.value * 1;

      if (e) {
        slider.lastSetValue = numbericValue;
      }

      if (numbericValue == object[field]) return;

      object[field] = numbericValue;
      this.onSliderChanged?.();
    }
    text.innerText = `${label}: ${input.value}`

    slider.appendChild(text);
    slider.appendChild(input);
    this.sliderArea.appendChild(slider);
    this.sliders.push(slider);

    slider.setRange = function (min, max) {
      input.min = round(min, 1);
      input.max = round(max, 1);

      input.value = slider.lastSetValue;

      if (slider.lastSetValue < min) {
        input.value = min;
      } else if (slider.lastSetValue > max) {
        input.value = max;
      }

      input.oninput();
    }

    return slider;
  }
} 
