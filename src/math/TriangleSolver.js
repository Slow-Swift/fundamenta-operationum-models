import { sin, cos, tan, asin, acos, atan, round, mod } from "../math/degMath";

/**
 * Calculates the opposite side of a right triangle using an angle and the hypotenuse.
 *
 * Useful for calculating declination as in Proposition 2.
 *
 * @param {number} angle - The angle in degrees.
 * @param {number} hypoteneus - The length of the hypotenuse in degrees | [-180, 180].
 * @returns {number} - The length of the opposite side | [-90, 90].
 */
export function opposite(angle, hypoteneus) {
  if (hypoteneus == 0) return 0;
  angle = mod(angle, 360);
  const length = asin(sin(angle) * sin(hypoteneus));
  return (angle >= 270 || angle <= 90) ? mod(length+180, 360)-180 : mod(-length, 360)-180;
}

/**
 * Calculates the adjacent side of a right triangle using an angle and the hypotenuse.
 *
 * Useful for calculating right ascension as in Proposition 5.
 *
 * @param {number} angle - The angle in degrees.
 * @param {number} hypoteneus - The length of the hypotenuse in degrees | [-180, 180].
 * @returns {number} - The length of the opposite side | [-180, 180].
 */
export function adjacent(angle, hypoteneus) {
  if (hypoteneus == 0) return 0;
  angle = mod(angle, 360);
  const opp = opposite(angle, hypoteneus);
  const adj = acos(cos(hypoteneus) / cos(opp)); // Always positive
  const angleSign = (angle >= 270 || angle <= 90) ? 1 : -1;
  return adj * angleSign * Math.sign(hypoteneus);
}

/**
* Determines the hypotenuse of a right triangle given the other two sides.
*
* @param {number} sideA - The first side.
* @param {number} sideB - The second side.
* @returns {number} - The hypotenuse.
*/
export function hypoteneus(sideA, sideB) {
  return acos(cos(sideA) * cos(sideB));
}

/**
* Calculates the third side of a right triangle given the hypoteneus and one of the sides.
*
* @param {number} hypoteneus - The hypoteneus of the triangle.
* @param {number} sideA - The given side.
* @returns {number} - The third side.
*/
export function thirdSide(hypoteneus, sideA) {
  if (sideA == 0) return hypoteneus;
  const length = acos(cos(hypoteneus) / cos(sideA));
  return Math.sign(hypoteneus) * length;
}

/**
 * Calculates the angle opposite a given angle and side in a right triangle.
 * 
 * @param {number} angle - The angle in degrees.
 * @param {number} adjacent - The length of the adjacent side | [-180, 180].
 * @returns {number} - The measure of the opposite angle | [0, 360].
 */
export function oppositeAngle(angle, adjacent) {
  angle = mod(angle, 360);
  const opposite = acos(cos(adjacent) * sin(angle));
  return angle < 180 ? opposite : 180 - opposite;
}

/**
* Calculates the angle opposite the given side also given the hypotenuse in a right triangle.
*
* Note: It may be that the true angle is 180-X but I haven't been able to determine when.
*
* @param {number} opposite - The side opposite the desired angle.
* @param {number} hypoteneus - The hypotenuse of the triangle.
* @returns {number} - The angle opposite the given side.
*/
export function angleFromOppositeAndHypotenuse(opposite, hypoteneus) {
  return asin(sin(opposite)/sin(hypoteneus));
}

/**
 * Calculates the angle adjacent to a given side in a right triangle, given the other angle.
 *
 * Note 1: The following must be true |adjacent| <= |angle|
 * Note 2: There are two possible angles for each given adjacent length. This returns the smallest.
 *
 * @param {number} angle - The angle opposite the side.
 * @param {number} adjacent - The length of the side.
 * @returns {number} - The measure of the angle adjacent to the side.
 */
export function adjacentAngle(angle, adjacent) {
  if (cos(adjacent) == 0) return angle;
  return asin(cos(angle) / cos(adjacent));
}

/**
 * Calculates the hypotenuse of a right triangle using an angle and its opposite side.
 * 
 * Useful for calculating ecliptic longitude as in Proposition 3.
 *
 * Note: It is assumed that |opposite| <= |angle|, otherwise the return value is invalid.
 * Note 2: For each value of |opposite| < |angle| there are two possibilities: x and 180 - x. 
 *  This always function defaults to returning the smaller value.
*  Note 3: If angle is a multiple of 180 (including 0) then NaN is returned.
 *
 * @param {number} angle - The angle in degrees.
 * @param {number} opposite - The length of the opposite side in degrees | [-angle, angle].
 * @param {boolean} [larger=false] - Whether the larger distance should be returned instead (i.e. should the length be >= 90).
 * @returns {number | NaN} - The length of the hypotenuse | [-90, 90]. NaN is returned if angle is a multiple of 180.
 */
export function hypoteneusFromOpposite(angle, opposite, larger=false) {
  angle = mod(angle, 360);
  const length = asin(sin(opposite) / sin(angle));
  const shortest = (angle >= 270 || angle <= 90) ? mod(length+180, 360)-180 : mod(-length, 360)-180;
  return larger ? 180 - shortest : shortest;
}

/**
 * Calculates the hypotenuse of a right triangle using an angle and the adjacent side.
 *
 * Useful for calculating ecliptic longitude as in Proposition 6.
 *
 * @param {number} angle - The angle in degrees.
 * @param {number} adjacent - The length of the adjacent side in degrees | [-180, 180].
 * @returns {number} - The length of the hypotenuse | [-180, 180].
 */
export function hypoteneusFromAdjacent(angle, adjacent) {
    angle = mod(angle, 360);
    const opposite = oppositeAngle(angle, adjacent);
    const hypoteneus = hypoteneusFromOpposite(opposite, adjacent); 

    // There are two possibilities for the hypotenuse which can be determined from the given angle.
    return (angle < 90 || angle > 270) ? hypoteneus : 180 - hypoteneus; 
}

/**
 * Finds an angle given its opposite side and one other side-angle pair.
 *
 * Note: The law of sines produces two possibilities. X and 180 - X. One or multiple of these may
 * be valid. This function returns X even if it does not satisfy the triangle.
 *
 * @param {number} sideA - The side opposite the given angle: `angleA`.
 * @param {number} sideB - The side opposite the desired angle.
 * @param {number} angleA - The angle opposite `sideA`.
 * @returns {number} - Then angle opposite `sideB`;
 */
export function angleLawOfSines(sideA, sideB, angleA) {
  return asin(sin(angleA) * sin(sideB) / sin(sideA));
}

export function solveRightTriangle({
  hypoteneus=undefined, 
  sideA=undefined, 
  sideB=undefined,
  angleA=undefined,
  angleB=undefined,
  negativeSideLengths=false,
}) {
  if (hypoteneus == undefined) {
    if (sideA != undefined && sideB != undefined) hypoteneus = acos(cos(sideA) * cos(sideB)); // Spherical Pythagoras
  }

  if (sideA == undefined) {
    if (hypoteneus != undefined && angleA != undefined) sideA = Math.abs(asin(sin(angleA) * sin(hypoteneus)));
  }

  return {
    hypoteneus: hypoteneus,
    sideA: sideA,
    sideB: sideB,
    angleA: angleA,
    angleB: angleB,
  };
}
