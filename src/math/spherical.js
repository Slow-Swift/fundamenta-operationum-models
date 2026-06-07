import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

export function Point(lat, lon) {
  lat = lat * Math.PI / 180;
  lon = lon * Math.PI / 180;

  return new Vector3(
    Math.sin(lat) * Math.cos(lon),
    Math.sin(lon),
    Math.cos(lat) * Math.cos(lon),
  )
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

export function equatorArc(pole, start=0, length=360) {

}

export function greatCircleArc(a, b, start=0, length=360) {
  const u = a.clone().normalize();
  const n = a.clone().cross(b).normalize();
  const v = n.clone().cross(u).normalize();
  return orthonormalArc(u, v, start, length);
}

function orthonormalArc(u, v, start, length) {
  if (length < 0) { 
    start = start - length;
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
