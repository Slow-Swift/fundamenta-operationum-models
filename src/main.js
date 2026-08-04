import 'katex/dist/katex.min.css';
import { models } from './models/models';
import { ModelRenderer } from './core/model-renderer';

const settings = {
  darkMode: true,
};


settings.model = models[localStorage.getItem('Model') ?? 'Proposition 2'];
settings.darkMode = localStorage.getItem('DarkMode') ?? false;
document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');

let model = undefined;

const modelRenderer = new ModelRenderer(new settings.model(), 2);
const modelElement = document.querySelector('.models');
modelElement.appendChild(modelRenderer.domElement);
modelRenderer.updateTheme();

modelRenderer.gui.setupPageControls(models, localStorage.getItem('Model') ?? 'Proposition 2', (model) => {
  settings.model = model;
  localStorage.setItem('Model', model);
  setModel(models[model]);
}, settings.darkMode, (dark) => {console.log(dark); settings.darkMode = dark; updateRenderingSettings()});

function updateRenderingSettings() {
  localStorage.setItem('DarkMode', settings.darkMode);
  document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  modelRenderer.updateTheme();
}

function setModel(modelClass) {
  modelRenderer.model?.dispose();
  modelRenderer.setModel(new modelClass());
  model = new modelClass();
  modelRenderer.updateTheme();
}
