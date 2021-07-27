import { lerp } from '../math';
import { linear } from './easing';
import { WritableStore } from './store';

export default class Tweened extends WritableStore<number> {
  from = this.value;
  to = this.value;
  time = performance.now();

  constructor(value: number, public duration: number, public easing = linear) {
    super(value, set => {
      let handle: number;
      const loop = () => {
        const t = performance.now();
        set(
          lerp(
            this.from,
            this.to,
            this.easing(Math.min(1, (t - this.time) / this.duration))
          )
        );
        handle = requestAnimationFrame(loop);
      };
      handle = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(handle);
    });
  }

  set(value: number): void {
    this.from = this.value;
    this.to = value;
    this.time = performance.now();
    this.subscribers.forEach(subscriber => subscriber(this.value));
  }
}

export function tweened(
  value: number,
  duration: number,
  easing?: (t: number) => number
): Tweened {
  return new Tweened(value, duration, easing);
}
