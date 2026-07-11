import * as TriangleSolver from "../math/TriangleSolver";

const OBLIQUITY_DEFAULT=23.5;

/**
 * Determine the declination of a point on the ecliptic given the obliquity of the ecliptic and
 * longitude of the point.
 *
 * @param {number} eclipticLongitude - The ecliptic longitude of the point.
 * @param {number} obliquity - The obliquity of the ecliptic.
 * @returns {number} - The declination of the point.
 */
export function proposition2(eclipticLongitude, obliquity=OBLIQUITY_DEFAULT) {
  return TriangleSolver.opposite(obliquity, eclipticLongitude);
}

/**
 * Determine the ecliptic longitude of a point given the obliquity of the ecliptic and the 
 * declination of the point.
 *
 * Note 1: The following must be true: |declination| <= |obliquity| 
 * Note 2: For each declination value (except +/-90) there are two possible ecliptic longitudes. This
 * returns the closest one to the vernal equinox.
 * Note 3: If `obliquity` is a multiple of 180, NaN is returned.
 *
 * @param {number} declination - The declination of the point on the eclipic | [`-obliquity`, `obliquity`].
 * @param {number} obliquity - The obliquity of the ecliptic.
 * @returns {number} - The ecliptic longitude of the point.
 */
export function proposition3(declination, obliquity=OBLIQUITY_DEFAULT) {
  return TriangleSolver.hypoteneusFromOpposite(obliquity, declination);
}

/**
 * Determines the right ascension of a point on the ecliptic given the obliquity of the ecliptic and
 * the longitude of the point.
 *
 * @param {number} eclipticLongitude - The ecliptic longitude of the point.
 * @param {number} obliquity - The obliquity of the ecliptic.
 * @returns {number} - The right ascension of the point.
 */
export function proposition5(eclipticLongitude, obliquity=OBLIQUITY_DEFAULT) {
  return TriangleSolver.adjacent(obliquity, eclipticLongitude);
}

/**
 * Determines the ecliptic longitude of a point on the ecliptic given the obliquity of the ecliptic
 * and the right ascension of the point.
 *
 * @param {number} rightAscension - The right ascension of the point.
 * @param {number} obliquity - The obliquity of the ecliptic.
 * @returns {number} - The ecliptic longitude of the point.
 */
export function proposition6(rightAscension, obliquity=OBLIQUITY_DEFAULT) {
  return TriangleSolver.hypoteneusFromAdjacent(obliquity, rightAscension);
}

/**
 * Determines the ortive amplitude of a point on the ecliptic as it rises. Given the declination
 * of the point and the latitude of the observer.
 *
 * Note: The following must be true `|declination| <= 90 - |latitude|`.
 *
 * @param {number} latitude - The latitude of the observer.
 * @param {number} declination - The declination of the given point from the equator.
 * @returns {number} - The ortive amplitude of the point.
 */
export function proposition7(declination, latitude) {
  return TriangleSolver.hypoteneusFromOpposite(90 - latitude, declination); 
}

/**
 * Determines the ecliptic longitude of a point on the ecliptic given the ortive amplitude of 
 * the point as it rises about the horizon given by `latitude`. 
 *
 * Note 1: The following must be true `sin(ortiveAmplitude)cos(latitude) <= sin(obliquity)`.
 * Note 2: For each `ortiveAmplitude` there may be multiple possible ecliptic longitudes. The smallest
 *   is returned.
 *
 * @param {number} ortiveAmplitude - The ortive amplitude of the point as it rises.
 * @param {number} latitude - The latitude of the observer.
 * @param {number} [obliquity=OBLIQUITY_DEFAULT] - The obliquity of the ecliptic.
 * @returns {number} - The shortest ecltiptic longitude.
 */
export function proposition8(ortiveAmplitude, latitude, obliquity=OBLIQUITY_DEFAULT) {
  const declination = TriangleSolver.opposite(90 - latitude, ortiveAmplitude);
  const eclipticLongitude = proposition3(declination, obliquity);
  return eclipticLongitude;
}

/**
* Determines the length of the diurnal arc of a point on the ecliptic given the ecliptic longitude  
* of the point and the latitude of the observer.
*
* Note: The following must be true `sin(eclipticLongitude)cos(latitude) <= sin(obliquity)`.
* Note 2: I haven't fully thought through what happens with different obliquities.
* 
* @param {number} eclipticLongitude - The ecliptic longitude of the point.
* @param {number} latitude - The latitude of the observer.
* @param {number} [obliquity=OBLIQUITY_DEFAULT] - The obliquity of the ecliptic.
*/
export function proposition9(eclipticLongitude, latitude, obliquity=OBLIQUITY_DEFAULT) {
  const declination = proposition2(eclipticLongitude, obliquity);
  const ortiveAmplitude = proposition7(declination, ortiveAmplitude, obliquity);
  const obliqueAscension = TriangleSolver.adjacent(90 - latitude, ortiveAmplitude);
  const semidurnal = ortiveAmplitude < 0 ? 90 - obliqueAscension : 90 + obliqueAscension;
  return semidurnal * 2;
}

/**
 * Determines the ecliptic longitude of a point on the ecliptic given the oblique ascension 
 * of the point and the observer's latitude.
 *
 * Note: I haven't fully thought through what happens as obliquity varies.
 *
 * @param {number} obliqueAscension - The oblique ascension of the point.
 * @param {number} latitude - The latitude of the observer.
 * @param {number} [obliquity=OBLIQUITY_DEFAULT] - The obliquity of the ecliptic.
 * @returns {number} The ecliptic longitude of the point.
 */
export function proposition11(obliqueAscension, latitude, obliquity=OBLIQUITY_DEFAULT) {
  const EKQ = 180 - TriangleSolver.oppositeAngle(obliquity, obliqueAscension);

  const KL = proposition6(obliqueAscension, obliquity);
  const EK = proposition2(KL, obliquity); 
  const KM = TriangleSolver.opposite(latitude, EK);

  const EKM = TriangleSolver.adjacentAngle(latitude, KM);
  const MKQ = EKQ - EKM;
  const KQ = TriangleSolver.hypoteneusFromAdjacent(MKQ, KM);
  return KL + KQ;
}

/**
 * Determines the altitude of the sun above the horizon given the sun's declination, equatorial 
 * distance from the meridian, and the latitude of the observer.
 *
 * @param {number} declination - The declination of the sun | [-90, 90].
 * @param {number} meridianDistance - The distance of the sun's projection onto the equator from the meridian. | [-180, 180].
 * @param {number} latitude - The latitude of the observer.
 * @returns - The altitude of the sun above the horizon.
 */
export function proposition13(declination, meridianDistance, latitude) {
  const MC = 180 - Math.abs(meridianDistance);
  const HZN = MC > 90 ? 180 - MC : MC;
  const HN = TriangleSolver.opposite(HZN, 90-latitude);
  const NP = 90 - HN;
  const ZL = TriangleSolver.hypoteneusFromOpposite(NP, latitude, MC > 90);
  const LO = ZL - (90 - declination);
  const OK = TriangleSolver.opposite(NP, LO);
  return OK;
}

/**
 * Determines the altitude of the sun when it is due east, given its declination and the
 * observer's latitude.
 *
 * @param {number} declination - The declination of the sun.
 * @param {number} latitude - The latitude of the observer.
 * @returns {number} - The altitude of the sun above the horizon.
 */
export function proposition14(declination, latitude) {
  return TriangleSolver.hypoteneusFromOpposite(latitude, declination);
}

// Note: Below here I am not so confident about them being valid for all possible inputs.

/**
 * Incomplete because I can't work out how to determine which side of E, K is on.
 */
export function proposition15(declination, altitude, meridianDistance) {
    const OS = TriangleSolver.opposite(meridianDistance, 90 - declination);
    const OHS = TriangleSolver.angleLawOfSines(90 - altitude, OS, 90);
    const KE = 90 - OHS;
    return OS < 90 - altitude ? KE : -KE;
}

/**
 * Determines the angle formed between a point of the ecliptic with the north pole and the point
 * of maximum declination of the sun.
 *
 * @param {number} eclipticLongitude - The ecliptic longitude of the point.
 * @param {number} [obliquity=OBLIQUITY_DEFAULT] - The obliquity of the ecliptic.
 * @returns {number} - The angle.
 */
export function proposition16(eclipticLongitude, obliquity=OBLIQUITY_DEFAULT) {
  const rightAscension = proposition5(eclipticLongitude, obliquity);
  const HKA = TriangleSolver.oppositeAngle(obliquity, rightAscension);
  return HKA;
}

/**
 * Determines the angle formed by a point of the ecliptic with the horizon and the ecliptic.
 *
 * @param {number} eclipticLongitude - The ecliptic longitude of the point.
 * @param {number} latitude - The latitude of the observer.
 * @param {number} obliquity - The obliquity of the ecliptic.
 * @returns {number} - The angle between the ecliptic and the horizon.
 */
export function proposition17(eclipticLongitude, latitude, obliquity=OBLIQUITY_DEFAULT) {
  const ZEC = proposition16(eclipticLongitude, obliquity);
  const declination = proposition2(eclipticLongitude, obliquity);
  const EZ = 90 - declination;
  const ZED = TriangleSolver.angleLawOfSines(EZ, latitude, 90);
  return ZEC - ZED;
}

/**
 * Determines the angle formed by a point of the ecliptic with the zenith.
 *
 * @param {number} eclipticLongitude - The ecliptic longitude of the point.
 * @param {number} meridianDistance - The distance (solar time) between the point and the meridian.
 * @param {number} latitude - The observer's latitude.
 * @param {number} [obliquity=OBLIQUITY_DEFAULT] - The obliquity of the ecliptic.
 * @returns {number} - The angle between the ecliptic and the zenith.
 */
export function proposition18(eclipticLongitude, meridianDistance, latitude, obliquity=OBLIQUITY_DEFAULT) {
    const declination = proposition2(eclipticLongitude, obliquity);
    const altitude = proposition13(declination, meridianDistance, latitude);
    const HK = 90 - altitude;

    const HX = TriangleSolver.opposite(meridianDistance, 90 - latitude); 
    const HKX = TriangleSolver.angleFromOppositeAndHypotenuse(HX, HK);
    const ZKE = proposition16(eclipticLongitude, obliquity);
    const HKE = HKX + ZKE;
    return HKE;
}
