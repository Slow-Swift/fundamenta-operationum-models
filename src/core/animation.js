import { clamp, lerp } from "three/src/math/MathUtils.js";


export class Animation {

  constructor(start, end, time, setVal, onComplete) {
    this.start = start;
    this.end = end;
    this.time = time;
    this.setVal = setVal;
    this.onComplete = onComplete;
  }

  update(time) {
    if (!this.startTime) this.startTime = time;
    const elapsedTime = time - this.startTime;
    const percent = clamp(elapsedTime / this.time, 0, 1);
    this.setVal?.(lerp(this.start, this.end, percent));

    this.completed = elapsedTime >= this.time;
    if (this.completed) {
      this.complete();
    }

    return this.completed;
  }

  complete() {
    this.completed = true;
    this.setVal?.(this.end);
    this.onComplete?.();
  }

  static AnimateGeometry(geometry, property, time, func, end) {
    return new Animation(
      0, 1, time, 
      (p) => {
        const value = func(p);
        geometry[property] = value;
        geometry.update();
      },
      () => {
        geometry[property] = end;
        geometry.update();
      }
    );
  }

  static AfterDelay(time, func) {
    return new Animation(0,0,time,undefined,func);
  }
}
