import { models } from './models/models';
import { ModelRenderer } from './core/model-renderer';

function setupModel(element) {
  const modelName = element.attributes?.model?.value;
  if (!(modelName in models)) {
    element.innerHTML += '<p><strong>Error:</strong> could not load model. Invalid name. </p>'
    return;
  }
  const modelSize = Number(element.attributes['model-size']?.value ?? 1);
  const size = 1.1 / (Number.isNaN(modelSize) ? 1 : modelSize);

  let maxZoom = Number(element.attributes['max-zoom']?.value ?? Infinity);
  if (Number.isNaN(maxZoom)) maxZoom = Infinity;

  let minZoom = Number(element.attributes['min-zoom']?.value ?? 0);
  if (Number.isNaN(minZoom)) maxZoom = 0;

  const modelClass = models[modelName];
  const model = new modelClass();
  const modelRenderer = new ModelRenderer(model, size, maxZoom, minZoom);
  element.appendChild(modelRenderer.domElement);
  modelRenderer.resize();
  modelRenderer.updateTheme();
  element.renderer = modelRenderer;
}

const modelDivs = document.querySelectorAll('.model');
for (const model of modelDivs) setupModel(model);
