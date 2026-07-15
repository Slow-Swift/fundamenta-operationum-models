import * as TriangleSolver from "../math/TriangleSolver";
import { sin, cos, tan, asin, acos, atan, round, mod } from "../math/degMath";

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

/**
* Determines the angle formed by a point of the ecliptic with the zenith.
*
* @param {number} eclipticAltitude - The altitude of the ecliptic on the southern meridian.
* @param {number} eclipticAngle - The angle formed by the ecliptic and the meridian | [0,90].
* @param {number} pointAltitude - The altitude of the point above the horizon. This must be less than
*   or equal to the maximum altitude of the ecliptic.
* @returns The angle formed by the point of the ecliptic and the zenith.
*/
export function proposition19(eclipticAltitude, eclipticAngle, pointAltitude) {
    const HK = TriangleSolver.opposite(eclipticAngle, 90 - eclipticAltitude);
    const HLK = TriangleSolver.angleFromOppositeAndHypotenuse(HK, 90 - pointAltitude);
    return HLK;
}

/**
* Determines the angle formed by a point of the ecliptic with the zenith.
*
* @param {number} ascensionDistance - The distance of the point from the ascension.
* @param {number} altitude - The altitude of the point above the horizon.
* @returns {number} The angle formed with the zenith.
*/
export function proposition20(ascensionDistance, altitude) {
  const LEM = TriangleSolver.angleFromOppositeAndHypotenuse(altitude, ascensionDistance);
  const LEH = 90 - LEM;
  const HLE = asin(sin(LEH) / sin(90 - altitude));
  const actualHLE = altitude = 0 ? 90 : (altitude > 0 ? 180 - HLE : HLE);
  return ascensionDistance < 0 ? 180 - actualHLE : actualHLE;
}

/**
* Determines the position of the ascendent on the ecliptic given the location of the midheaven
* and the latitude of the observer.
*
* @param {number} midheavenLongitude - The ecliptic longitude of the midheaven.
* @param {number} latitude - The latitude of the observer.
* @param {number} [obliquity=OBLIQUITY_DEFAULT] - The obliquity of the ecliptic.
* @returns {number} The ecliptic longitude of the ascension.
*/
export function proposition21(midheavenLongitude, latitude, obliquity=OBLIQUITY_DEFAULT) {
  const A_declination = proposition2(midheavenLongitude, obliquity);
  const HAL = proposition16(midheavenLongitude, obliquity);
  const HA = latitude - A_declination;
  const AL = HAL > 90 ? 360 - TriangleSolver.adjacent(HAL, HA) : TriangleSolver.adjacent(HAL, HA);
  const AE = AL > 90 ? AL - 90 : AL + 90;
  return mod(AE + midheavenLongitude + 180, 360) - 180;
}

/**
* Determines the position of the midheaven given the position of the ascendent on the ecliptic and 
* the latitude of the observer.
*
* @param {number} ascendentLongitude - The ecliptic longitude of the ascendent.
* @param {number} latitude - The latitude of the observer.
* @param {number} [obliquity=OBLIQUITY_DEFAULT] - The obliquity of the ecliptic.
* @returns {number} The ecliptic longitude of the midheaven.
*/
export function proposition22(ascendentLongitude, latitude, obliquity=OBLIQUITY_DEFAULT) {
  const E_declination = proposition2(ascendentLongitude, obliquity);
  const E_ortiveAmplitude = proposition7(E_declination, latitude);
  const LEM = proposition17(ascendentLongitude, latitude, obliquity);
  const AL = TriangleSolver.opposite(E_ortiveAmplitude, 90 - LEM);
  const AE = 90 + AL;
  return mod(ascendentLongitude - AE + 180, 360) - 180;
}

/**
* Determines the altitude of the sun given the altitude of the midheaven and the distance of 
* the midheaven and the sun from the ascendent.
*
* @param {number} midheavenAltitude - The altitude of the midheaven | [-90, 90].
* @param {number} midheavenDistance - The distance of the midheaven from the ascendent | [0, 180].
* @param {number} sunDistance - The distance of the sun from the ascendent | [-180, 180].
* @returns {number} - The altitude of the sun above the horizon.
*/
export function proposition23(midheavenAltitude, midheavenDistance, sunDistance) {
  const KN = TriangleSolver.angleFromOppositeAndHypotenuse(midheavenAltitude, 180-midheavenDistance);
  if (midheavenDistance % 180 == 0) KN = 90;
  const LM = TriangleSolver.opposite(c.KN, sunDistance);
  return LM;
}

/**
* Determines the distance to the northern horizon from the intersection of circle of hours with
* the horizon.
*
* Note: Undefined when latitude = 0.
*
* @param {number} latitude - The latitude of the observer.
* @param {number} hourAngle - The angle at the north pole between the meridian and the circle of hours.
* @returns {number} - The distance from the intersection to the north point of the horizon.
*/
export function proposition24(latitude, hourAngle) {
  const length = 90 - TriangleSolver.hypoteneusFromAdjacent(90 - latitude, 90 - hourAngle);
  return mod(length + 180, 360) - 180; 
}

/**
* Determines the distance to the zenith from the intersection of the circle of hours with the 
* eastern circle.
*
* Note: Undefined when latitude = 90.
*
* @param {number} latitude - The latitude of the observer.
* @param {number} hourAngle - The angle at the north pole between the meridian and the circle of hours.
* @returns {number} - The distance from the intersection to the zenith.
*/
export function proposition25(latitude, hourAngle) {
  const ZH = TriangleSolver.hypoteneusFromAdjacent(180 - hourAngle, 90 - latitude);
  const AH = TriangleSolver.opposite(180 - hourAngle, ZH);
  return AH;
}

/**
* Determines the distance between an intersiotion of the circle of hours with a great circle 
* perpendicular to the meridian and the intersection of that circle with the meridian.
*
* Note: Undefined when the great circle intersects the poles.
*
* @param {number} latitude - The latitude of the observer.
* @param {nubmer} circleAltitude - The altitude of the intersection of the circle with the meridian.
* @param {number} hourAngle - The angle at the north pole between the meridian and the circle of hours.
* @returns {number} - The distance between the intersection of the great circle with the circle of 
*   hours and the intersection with the meridian.
*/
export function proposition26(latitude, circleAltitude, hourAngle) {
  const AZ = circleAltitude - latitude;
  const ZH = TriangleSolver.hypoteneusFromAdjacent(180 - hourAngle, AZ);
  const AH = TriangleSolver.opposite(180 - hourAngle, ZH);
  return AZ < 0  ? mod(360 + AH) - 180 : AH;
}


/**
* Determines the distance between the intersection of the circle of hours with a longitude circle and 
* the zenith.
*
* Note: I was tired when I wrote this so it may be bad.
*
* @param {number} latitude - The latitude of the observer.
* @param {number} inclination - The angle between the circle of latitude and the meridian.
* @param {number} hourAngle - The angle at the north pole between the meridian and the circle of hours.
* @returns {number} The distance between the intersection and the zenith.
*/
export function proposition27(latitude, inclination, hourAngle) {
    let ZL = TriangleSolver.opposite(inclination, 90 - latitude);
    let AL = TriangleSolver.adjacent(inclination, 90 - latitude);

    if (angleOfInclination > 90 && latitude < 90) {
      ZL = 180 - ZL;
      AL = 180 - AL;
    }

    const AZL = TriangleSolver.oppositeAngle(inclination, AL);
    const HZL = inclination < 90 ? AZL - (180 - hourAngle) : -AZL - (180 - hourAngle);
    const ZH = TriangleSolver.hypoteneusFromAdjacent(HZL, ZL);
    const HL = TriangleSolver.opposite(HZL, ZH);
    const AH = AL - HL;
    return AH;
}
