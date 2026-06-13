import { degToRad, radToDeg } from "three/src/math/MathUtils.js";

export function sin(a) { return Math.sin(degToRad(a)) };
export function cos(a) { return Math.cos(degToRad(a)) };
export function tan(a) { return Math.tan(degToRad(a)) };

export function asin(a) { return radToDeg(Math.asin(a)) };
export function acos(a) { return radToDeg(Math.acos(a)) };
export function atan(a) { return radToDeg(Math.atan(a)) };
