import { degToRad, radToDeg, clamp } from "three/src/math/MathUtils.js";

export function sin(a) { return Math.sin(degToRad(a)) };
export function cos(a) { return Math.cos(degToRad(a)) };
export function tan(a) { return Math.tan(degToRad(a)) };

export function asin(a) { return radToDeg(Math.asin(clamp(a, -1, 1))) };
export function acos(a) { return radToDeg(Math.acos(clamp(a, -1, 1))) };
export function atan(a) { return radToDeg(Math.atan(clamp(a, -1, 1))) };

export function asinn(a) { return radToDeg(Math.asin(a)) };
export function acosn(a) { return radToDeg(Math.acos(a)) };

export function round(a, p) { return Math.round(a * (10 ** p)) / (10 ** p) }

export function mod(a,b) {
  const out = a % b;
  return out < 0 ? b + out : out;
}
