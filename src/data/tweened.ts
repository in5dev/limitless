import { lerp } from '../math';
import Store from './store';

export default class TweenedStore extends Store<number> {
  from = this.value;
  to = this.value;
  time = performance.now();

  constructor(value: number, public duration: number) {
    super(value);

    function loop(this: TweenedStore) {
      let t = performance.now();
      this.value = lerp(this.from, this.to, (t - this.time) / this.duration);
      requestAnimationFrame(loop.bind(this));
    }
    loop.call(this);
  }

  set(value: number) {
    this.from = this.value;
    this.to = value;
    this.time = performance.now();
    this.subscribers.forEach(subscriber => subscriber(this.value));
  }
}

export function tweened(value: number, duration: number): TweenedStore {
  return new TweenedStore(value, duration);
}
