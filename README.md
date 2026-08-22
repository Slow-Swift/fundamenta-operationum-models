# Spherical Trigonometry Models from Fundamenta Operationum

Fundamenta Operationum by Regiomontanus is a 15th century description of various problems
relating to Spherical Trigonometry and Astronomy. Throughout the text, he includes many diagrams
to explain his propositions. However, as these are diagrams of spheres, such diagrams are easier
to understand and reason about when they are seen on a sphere which can be rotated around and viewed
in three dimensions. 

This repository provides a collection of three dimensional, digital, rotatable models for the propositions
in Fundamenta Operationum. 

## Viewing the models

The full set of models can be viewed [here](https://slow-swift.github.io/fundamenta-operationum-models/threejs_models.html.
Examples of how these models look when embedded in a website can be seen [here](https://slow-swift.github.io/fundamenta-operationum-models).

## Embedding models in your own site

These models can be embedded in your own webpage using the following steps.

- Download the latest release 
- Extract the files and copy both the .css and .js files into your website files
- Include the styles by adding `<link rel="stylesheet" href="spherical-trig-models.css" type="text/css">` to the head of the page.
- Include a model by adding `<div class="model" model="Proposition 2" model-size="0.5" style="width: 500px; height: 500px; margin: auto;"></div>` in the content of the page. Additional information about the possible parameters for the models can be found below.
- Include the javascript to load the models by adding `<script type="module" src="spherical-trig-models.js"></script>` at the end of the body.

### Minimal example

The following is an example of the minimal html needed to load a model:

```html
<!doctype html>
<html>
  <head>
    <link rel="stylesheet" href="spherical-trig-models.css" type="text/css">
  </head>
  <body>
    <div class="model" model="Proposition 2" model-size="0.5" style="width: 500px; height: 500px; margin: auto;"></div>
<script type="module" src="spherical-trig-models.js"></script>
  </body>
</html>
```

## Model parameters

To add a model to a page include a div with the model class: `<div class="model"><\div>`

This div can be styled and positioned however you like, but it must have a defined width and height.
This can be done automatically through page layout or by manually specifying width and height values
as in the following example: `<div class="model" style="width: 500px; height: 500px"></div>`.

To select the model to load add the model attribute with the model name. For example: `model="Proposition 2"`. 
A full list of the available models can be found [here](https://github.com/Slow-Swift/fundamenta-operationum-models/blob/main/src/models/models.js).

The following attributes can also be used to customize the model:

- model-size (default 1): The size of the sphere compared to the total size of the container. 
  The default of 1 makes the sphere take up the complete width of the container.
- max-zoom (default: infinity): How far out you can zoom.
- min-zoom (default: 0): How far in you can zoom.
- show-controls: Add this attribute to show the model controls by default.

The model colors can also be customized through css styles. The following styles are available:

-  --theme-default-color: The color of any elements not controlled by other colors.
-  --theme-arc-normal: The color of arcs.
-  --theme-point-normal: The color of points.
-  --theme-sphere: The color of the sphere.
-  --theme-label-color: The color of labels, including points, arc lengths, and angles.
-  --theme-text-stroke: The color of stroke around labels.
-  --theme-slider-text: The highlight color for UI.
-  --theme-slider-background: The background color for UI.
-  --theme-background: The color behind the sphere.

Default light and dark themes are provided controlled by the data-theme attribute of the document.
If this attribute is not provided, the theme defaults to dark.

Note that if the CSS theme is changed after the model has loaded, it has to be told to update the theme.
This can be done by calling `element.renderer.updateTheme()` where element is the model's HTML element.

