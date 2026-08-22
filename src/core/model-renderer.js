import * as THREE from 'three';
import { CSS2DRenderer, OrbitControls } from 'three/examples/jsm/Addons.js';
import { ModelGui } from './gui';
import 'katex/dist/katex.min.css';
import { Theme } from './theme';

export class ModelRenderer {
  constructor(model, startSize = 1.1, maxZoom=Infinity, minZoom=0, ctrlsVisible=false) {
    this.creatDomElement();
    this.gui = new ModelGui(ctrlsVisible);
    this.ortho_size = startSize;
    this.camera = new THREE.OrthographicCamera(-this.ortho_size, this.ortho_size, this.ortho_size, -this.ortho_size);
    this.camera.position.z = 4;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.maxZoom = maxZoom;
    this.controls.minZoom = minZoom;
    this.domElement.appendChild(this.renderer.domElement); 
    this.domElement.appendChild(this.labelRenderer.domElement);
    this.domElement.appendChild(this.gui.domElement);
    this.renderer.setAnimationLoop(this.animate.bind(this));
    this.theme = new Theme(this.domElement);
    this.domElement.renderer = this;
    this.setModel(model);
  }

  creatDomElement() {
    this.domElement = document.createElement('div');
    this.domElement.classList.add('model-renderer');
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';
    this.domElement.style.position = 'relative';
    this.resizeObserver = new ResizeObserver(this.resize.bind(this));
    this.resizeObserver.observe(this.domElement);
  }

  resize() {
    const width = this.domElement.clientWidth;
    const height = this.domElement.clientHeight;
    const aspect = width / height;
    this.width = width;
    this.camera.top = this.ortho_size / aspect;
    this.camera.bottom = -this.ortho_size / aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.labelRenderer.setSize(width, height);
  }

  animate(time) {
    this.controls.update();
    this.controls.rotateSpeed = this.camera.zoom > 1 ? 1/this.camera.zoom : 1;
    this.model.updatePointSize(this.camera.zoom * (this.width / this.ortho_size));
    this.model.updateRender(time/1000, this.camera);
    this.renderer.render(this.model?.scene, this.camera);
    this.labelRenderer.render(this.model?.scene, this.camera);
    if (!this.model.lazy) this.model?.update();
  }

  updateTheme() {
    this.theme.updateThemeValues();
    this.model?.setTheme(this.theme);
    this.renderer.setClearColor(this.theme.get('background'));
  }

  setModel(model) {
    this.gui.clear();
    this.model = model;
    this.model?.setup(this.gui);
  }
}
