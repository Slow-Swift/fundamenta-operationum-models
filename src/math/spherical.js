import { Vector3 } from "three";
import { degToRad, radToDeg } from "three/src/math/MathUtils.js";
import { sin, cos, tan, asin, acos, atan, mod } from "../math/degMath";

export function Point(lat=0, lon=0, visible=true) {
  if (typeof(lat) == "function") {
    if (typeof(lon) == "function") {
      return () => Point(lat(), lon(), visible);
    } else {
      return () => Point(lat(), lon, visible);
    }
  } else if(typeof(lon) == "function") {
    return () => Point(lat, lon(), visible);
  }

  lat = lat * Math.PI / 180;
  lon = lon * Math.PI / 180;

  return new Vector3(
    Math.sin(lat) * Math.cos(lon),
    Math.sin(lon),
    Math.cos(lat) * Math.cos(lon),
  );
}

export function pole(point1, point2) {
  if (typeof point1 === 'function' || typeof point2 === 'function') {
    return function() {
      const evalP1 = typeof point1 === 'function' ? point1() : point1;
      const evalP2 = typeof point2 === 'function' ? point2() : point2;
      return pole(evalP1, evalP2);
    };
  }
  
  const u = point1.clone().normalize();
  return u.clone().cross(point2).normalize();
}

/**
* Determine the distance between two points
*
* If pole is not given, the shortest distance between two points is returned.
* If pole is given, point1 and point2 are first projected to the equator of pole and the
* counterclockwise distance from A to B is returned.
*/
export function distance(a, b, p=undefined) {
  if (typeof a === 'function' || typeof b === 'function' || p === 'function') {
    return function() {
      const evalP1 = typeof a === 'function' ? a() : a;
      const evalP2 = typeof b === 'function' ? b() : b;
      const evalPole = typeof p === 'function' ? p() : p;
      return distance(evalP1, evalP2, evalPole);
    };
  }

  if (p === undefined) {
    const dot = Math.max(-1, Math.min(1, a.dot(b)));
    return acos(dot);
  }

  a = projectToEquator(a, p);
  b = projectToEquator(b, p);

  if (a.length() < 0.5 || b.length() < 0.5) return 0;
  
  const distance = acos(a.dot(b));
  if (p.dot(pole(a, b)) > 0) {
    return distance;
  } else {
    return 360 - distance;
  }
}

export function UpdatePoint(point, lat, lon) {
  point.x = Math.sin(lat) * Math.cos(lon);
  point.y = Math.sin(lon);
  point.z = Math.cos(lat) * Math.cos(lon);
}

export function distanceAlongArc(a, b, distance) {
  if (typeof a === 'function' || typeof b === 'function' || typeof distance === 'function') {
    return function() {
      const evalA = typeof a === 'function' ? a() : a;
      const evalB = typeof b === 'function' ? b() : b;
      const evalDistance = typeof distance === 'function' ? distance() : distance;
      return pointAlongBasis(basisFromPoints(evalA, evalB), evalDistance);
    };
  }

  return pointAlongBasis(basisFromPoints(a, b), distance);
}

export function greatCircleArc(a, b, start=0, length=360) {
  const basis = basisFromPoints(a, b);
  return generatePointsAlongBasis(basis, {start: start, length: length});
}

export function distanceAlongSmallCircle(pole, a, distance, lat) {
  if (typeof pole === 'function' || typeof a === 'function' || typeof distance === 'function' || typeof lat === 'function') {
    return function() {
      const evalPole = typeof pole === 'function' ? pole() : pole;
      const evalA = typeof a === 'function' ? a() : a;
      const evalDistance = typeof distance === 'function' ? distance() : distance;
      const evalLat = typeof lat === 'function' ? lat() : lat;
      return pointAlongBasis(basisFromPole(evalPole, { startDirection: evalA, latitude: evalLat }), evalDistance);
    };
  }
  
  const basis = basisFromPole(pole, { startDirection: a, latitude: lat });
  return pointAlongBasis(basis, distance);
}

export function latitudeArc(pole, latitude, start=0, length=360) {
  const basis = basisFromPole(pole, {latitude: latitude});
  return generatePointsAlongBasis(basis, { start: start, length: length });
}

export function smallCircleArc(pole, a, b, start=0, end=0, lat=undefined) {
  const latitude = lat ? lat : 90 - acos(pole.dot(a));
  const basis = basisFromPole(pole, { startDirection: a, latitude: latitude });
 
  // Project A and B down to the equator of pole
  a = projectToEquator(a, pole);
  b = projectToEquator(b, pole);
  const length = acos(b.dot(a)) - start + end;
  return generatePointsAlongBasis(basis, { start: start, length: length});
}

// *** Corrected Functions *** //

/**
 * Project the given point down to the equator defined by pole.
 *
 * Warning: if point == pole then the zero vector is returned
 */
export function projectToEquator(point, pole) {
  return point.clone().sub(pole.clone().multiplyScalar(pole.dot(point))).normalize();
}

/**
 * Generates two vectors [u, v] which form an orthonormal basis with pole.
 *
 * When a is given and linearly independent from pole, u points in the direction of a
 * Together pole, u, v follow the right hand rule.
 *
 * Warning: When a is linearly dependent with pole or a is undefined then u is chosen non-continuously (See Hairy ball theorem)
 */
export function orthonomalBasis(pole, a=undefined) {
  if (!a?.isVector3 || pole.equals(a)) {
    a = Math.abs(pole.x) < 0.9 ? new Vector3(1, 0, 0) : new Vector3(0, 1, 0);
  }

  const u = projectToEquator(a, pole);
  const v = pole.clone().cross(u).normalize();
  return [u, v];
}

/**
 * Generates an orthonomal basis for a circle along with the centre of the circle: [u, v, centre].
 *
 * Possible parameter combos:
 *  - pole, point1: Generates an orthonormal basis [u,v] orthogonal to pole, 
 *      with u in the direction of a. Warning: if pole and point1 are not linearly independent,
 *      u is chosen non-continuously
 *  - pole: Generates an orthonomal basis [u, v] orthogonal to pole. Warning: direction of u is
 *      chosen non-continuously
 *  - point1, point2: Generates an orthonormal basis [u, v] in the plane defined by point1 and 
 *      point2. u == point1 and v is chosen to be closest to point2. Warning if the points are
 *      not linearly independent v is chosen non-continuously
 * 
 * For each combo, a latitude can also be specified which makes the circle a small circle.
 * If latitude is not provided it is assumed to be zero.
 */
function generateCircleBasis({
  pole=undefined,
  point1=undefined,
  point2=undefined,
  latitude=undefined
}) {

}

/**
 * Generates an orthonomarl basis [u, v] in the plane defined by point1 and point2. 
 * u == point1 and v is chosen to be closest to point2. Warning, if the points are not linearly
 * independent then v will be the zero vector
 */
function basisFromPoints(point1, point2) {
  const u = point1.clone().normalize();
  const pole = u.clone().cross(point2).normalize();
  const v = pole.cross(u).normalize();
  return [u, v];
}

/**
 * Generates a basis [u, v, centre] orthonormal to pole.
 *
 * If latitude is provided, a basis for the small circle at the given latitude towards the pole
 * is generated.
 *
 * When startDirection is given and linearly independent from pole, u points in the direction of startDirection
 * Together pole, u, v follow the right hand rule.
 *
 * Warning: When startDirection is linearly dependent with pole or startDirection is undefined then 
 *  u is chosen non-continuously (See Hairy ball theorem)
 *
 * Warning: If latitude is 90, then the circle's radius will be zero and the basis will no longer be orthonormal 
 */
function basisFromPole(pole, {startDirection=undefined, latitude = undefined}={}) {
  const [u, v] = orthonomalBasis(pole, startDirection); // Note this is chaotic
  const centre = pole.clone().multiplyScalar(sin(latitude ?? 0));
  const radius = cos(latitude ?? 0);
  return [ u.multiplyScalar(radius), v.multiplyScalar(radius), centre ];
}

/**
 * Generates points along a circle defined by the given basis.
 *
 * @param {[Vector3, Vector3, Vector3]} basis: The basis for the circle: [u, v, centre]
 * @param { number } start: The angle away from u to start at. Default 0.
 * @param { number } length: The total angle to generate points for. Default 360.
 * @param { number } red: The number of points to generate per degree. Default 1.
 *
 */
function generatePointsAlongBasis(basis, { start=0, length=360, res=1 }={}) {
  if (length < 0) {
    start = start + length;
    length = -length;
  }

  const points = [];
  const count = length * res;
  for (let i=0; i<count; i++) {
    const angle = start + i / res;
    points.push(pointAlongBasis(basis, angle));
  }

  // Make sure the last point is added
  // This is outside the for loop because if a non whole number resolution
  // is chosen then count won't be whole and the last point will be in the wrong spot.
  points.push(pointAlongBasis(basis, start + length));

  return points;
}

/**
 * Get the point on a circle specified by basis vectors [u, v], at angle degrees from u.
 *
 * If centre is provided, the circle is offset to be centred on centre
 *
 * Note: it is assumed that [u, v] form an orthonormal basis, but if they don't you'll get an
 *        ellipse or a line.
 */
function pointAlongBasis([u, v, centre = new Vector3()], angle) {
  return new Vector3()
      .addScaledVector(u, cos(angle))
      .addScaledVector(v, sin(angle))
      .add(centre);
}

export function angle(center, leftPoint, rightPoint, alwaysSmallest=true) {
    let poleLeft = projectToEquator(leftPoint, center);
    let poleRight = projectToEquator(rightPoint, center);
    const alignment = center.clone().cross(poleLeft).dot(poleRight) > 0;

    if(alwaysSmallest && alignment > 0) {
      [leftPoint, rightPoint] = [rightPoint, leftPoint];
    }

    return (alignment > 0 && !alwaysSmallest ? 180 : 0) + acos(projectToEquator(leftPoint, center).dot(projectToEquator(rightPoint, center)));
}

