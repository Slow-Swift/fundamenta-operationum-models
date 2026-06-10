import JXG from 'jsxgraph';

function normalize(v) {
  const l = Math.hypot(...v);
  return v.map(x => x / l);
}

function cross(a,b) {
  return [
    a[1]*b[2] - a[2]*b[1],
    a[2]*b[0] - a[0]*b[2],
    a[0]*b[1] - a[1]*b[0]
  ];
}

function createBasis(a,b) {
  const aPos = a.coords.slice(1);
  const bPos = b.coords.slice(1);
  const u = normalize(aPos);
  const n = normalize(cross(aPos, bPos));
  const v = normalize(cross(n, u));
  return {
    u: u,
    v: v,
  }
}

function angleAlongArc(a,b,angle) {
  const basis = createBasis(a,b);
  return [
    basis.u[0] * Math.cos(angle) + basis.v[0] * Math.sin(angle),
    basis.u[1] * Math.cos(angle) + basis.v[1] * Math.sin(angle),
    basis.u[2] * Math.cos(angle) + basis.v[2] * Math.sin(angle)
  ]
}

function createArc(view, a, b) {
  const basis = createBasis(a,b);

  curve = view.create('curve3d', [
    t => basis.u[0]*Math.cos(t) + basis.v[0]*Math.sin(t),
    t => basis.u[1]*Math.cos(t) + basis.v[1]*Math.sin(t),
    t => basis.u[2]*Math.cos(t) + basis.v[2]*Math.sin(t),
    [0, Math.PI]
  ]);

  curve.basis = basis;
  return curve;
}

function createGreatCircle(view, a,b, attribs) {
  function getNormal() {
    const aPos = a.coords.slice(1);
    const bPos = b.coords.slice(1);
    const normal = normalize(cross(aPos, bPos));
    normal.unshift(0);
    return normal;
  }
  return view.create('circle3d', [[0,0,0], () => getNormal(), 1], attribs);
}

const board = JXG.JSXGraph.initBoard('jxgbox', {
  boundingbox: [-1, 1, 1, -1],
  showNavigation: false,
  pan: {enabled: false},
  zoom: {enabled: true},
});

const view = board.create(
  'view3d',
  [
    [-1, -1], [2, 2],
    [
      [-1.5, 1.5],
      [-1.5, 1.5],
      [-1.5, 1.5]
    ]
  ],
  {
    projection: 'parallel',
    xPlaneRear: {visible: false},
    yPlaneRear: {visible: false},
    zPlaneRear: {visible: false},
    xAxis: {visible:false},
    yAxis: {visible: false},
    zAxis: {visible: false},
  }
);

const obliquitySlider = board.create('slider', [[0.2, -0.8], [0.8, -0.8], [0, 23.44, 90]], {name: 'obliquity'});
const gAngleSlider = board.create('slider', [[0.2, -0.9], [0.8, -0.9], [0, 30, 90]], {name: 'angle'});

const gAngleRadians = () => gAngleSlider.Value() * Math.PI / 180;
const obliquityRad = () => obliquitySlider.Value() * Math.PI / 180;
const e = view.create('point3d', [1, 0, 0], {size: 5, name: 'E', fixed: true });
const a = view.create('point3d', [0, 1, 0], {size: 5, name: 'A', fixed: true });
const c = view.create('point3d', [0, -1, 0], {size: 5, name: 'C', fixed: true });
const b = view.create('point3d', [0, () => Math.cos(obliquityRad()), () => Math.sin(obliquityRad())], {size: 5, name: 'B', fixed: true });
const d = view.create('point3d', [0, () => -Math.cos(obliquityRad()), () => -Math.sin(obliquityRad())], {size: 5, name: 'D', fixed: true });
const f = view.create('point3d', [0, 0, 1], {size: 5, name: 'F', fixed: true });
const g = view.create('point3d', () => angleAlongArc(e,b,gAngleRadians()), {size: 5, name: 'G', fixed: true });
const h = view.create('point3d', () => angleAlongArc(f,g,Math.PI/2), {size: 5, name: 'H', fixed: true});

view.create('circle3d', [[0,0,0], [0,0,0,1], 1], { strokeColor: 'green', strokeWidth: 2 });
view.create('circle3d', [[0,0,0], [0,1,0,0], 1], { strokeColor: 'red', strokeWidth: 2 });
view.create('circle3d', [[0,0,0], () => [0,0,-Math.sin(obliquityRad()), Math.cos(obliquityRad())], 1], { strokeColor: 'blue', strokeWidth: 2});
createGreatCircle(view, f,g, { strokeColor: 'yellow', strokeWidth: 2});

