import { lerp } from '../math';
import { linear } from './easing';
import Store from './store';

export default class Tweened extends Store<number> {
  from = this.value;
  to = this.value;
  time = performance.now();

  constructor(value: number, public duration: number, public easing = linear) {
    super(value);

    function loop(this: Tweened) {
      const t = performance.now();
      this.value = lerp(
        this.from,
        this.to,
        this.easing(Math.min(1, (t - this.time) / this.duration))
      );
      requestAnimationFrame(loop.bind(this));
    }
    loop.call(this);
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
