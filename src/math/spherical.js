import { Vector3 } from "three";

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

export function Pole(a, b) {
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

export function DistanceAlongArc(point1, point2, distance) {
  const pole = Pole(point1, point2);
  const [ u, v ] = orthonomalBasis(pole);
  const angleOffset = Math.acos(u.dot(point1)) * 180 / Math.PI;

  const t = (distance + angleOffset) / 180 * Math.PI;
  return new Vector3()
    .addScaledVector(u, Math.cos(t))
    .addScaledVector(v, Math.sin(t));
}
