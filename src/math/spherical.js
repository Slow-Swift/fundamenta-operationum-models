import { Vector3 } from "three";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { dot } from "three/src/nodes/TSL.js";

export function Point(lat=0, lon=0) {
  lat = lat * Math.PI / 180;
  lon = lon * Math.PI / 180;

  return new Vector3(
    Math.sin(lat) * Math.cos(lon),
    Math.sin(lon),
    Math.cos(lat) * Math.cos(lon),
  )
}

export function pointFromPole(pole, lonZero, lat, lon) {
  const [u,v] = orthonomalBasis(pole);
  const centre = pole.clone().multiplyScalar(Math.sin(degToRad(lat)));

  const a = lonZero.clone().sub(centre);

  const alpha = mod(radToDeg(Math.atan2(
    a.dot(v),
    a.dot(u)
  )), 360);

  const newLon = lon + alpha;
  return latitudeArc(pole, lat, newLon, 0)[0];

}

export function UpdatePoint(point, lat, lon) {
  point.x = Math.sin(lat) * Math.cos(lon);
  point.y = Math.sin(lon);
  point.z = Math.cos(lat) * Math.cos(lon);
}

export function pole(a, b) {
  return a.clone().cross(b).normalize();
}

export function orthonomalBasis(normal) {
  const u = Math.abs(normal.x) < 0.9 ? new Vector3(1, 0, 0) : new Vector3(0, 1, 0);
  u.cross(normal).normalize();
  const v = normal.clone().cross(u).normalize();

  return [ u, v ];
}

// Generates a vector orthogonal to the given vector in the same plane as the second vector 
export function OrthogonalInPlane(a, b) {
  return a.clone().cross(b).normalize().cross(a)
}

export function DistanceAlongCircle(pole, distance) {
  const [ u, v ] = orthonomalBasis(pole.clone());

  const t = distance / 180 * Math.PI;
  return new Vector3()
    .addScaledVector(u, Math.cos(t))
    .addScaledVector(v, Math.sin(t));
}

export function distanceAlongArc(a, b, distance) {
  return greatCircleArc(a, b, distance, 0)[0];
}

export function greatCircleArc(a, b, start=0, length=360) {
  const u = a.clone().normalize();
  const n = a.clone().cross(b).normalize();
  const v = n.clone().cross(u).normalize();
  return orthonormalArc(u, v, start, length);
}

export function distanceAlongLatitude(pole, latitude, distance) {
  return latitudeArc(pole, latitude, distance, 0)[0];
}

export function latitudeArc(pole, latitude, start=0, length=360) {
  const [u, v] = orthonomalBasis(pole);
  const centre = pole.clone().multiplyScalar(Math.sin(degToRad(latitude)));
  const radius = Math.cos(degToRad(latitude));
  const points = orthonormalArc(u, v, start, length);
  points.map(p => p.multiplyScalar(radius).add(centre));
  return points;
}

export function smallCircleArc(pole, a, b, start=0, end=0) {
  const latitude = Math.PI/2 - Math.acos(pole.dot(a));
  const [u,v] = orthonomalBasis(pole);
  const centre = pole.clone().multiplyScalar(Math.sin(latitude));

  a = a.clone().sub(centre);
  b = b.clone().sub(centre);

  const alpha = mod(radToDeg(Math.atan2(
    a.dot(v),
    a.dot(u)
  )), 360);

  const beta = mod(radToDeg(Math.atan2(
    b.dot(v),
    b.dot(u)
  )), 360);

  const length = beta - alpha + end;
  console.log(alpha, beta);
  return latitudeArc(pole, radToDeg(latitude), alpha, length);
}

function orthonormalArc(u, v, start, length) {
  if (length < 0) { 
    start = start + length;
    length = -length;
  }

  const points = [];
  for (let i=0; i<length; i++) {
    const theta = degToRad(start + i);
    const p = new Vector3()
      .addScaledVector(u, Math.cos(theta))
      .addScaledVector(v, Math.sin(theta));

    points.push(p);
  }

  // Add the last point
  const theta = degToRad(start + length);
  points.push(new Vector3().addScaledVector(u, Math.cos(theta)).addScaledVector(v, Math.sin(theta)));

  return points;
}

function mod(a,b) {
  const out = a % b;
  return out < 0 ? b + out : out;
}
