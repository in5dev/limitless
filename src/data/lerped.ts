import { lerp } from '../math';
import Store from './store';

export default class Lerped extends Store<number> {
  target = this.value;

  constructor(value: number, public norm: number) {
    super(value);

    function loop(this: Lerped) {
      this.value = lerp(this.value, this.target, this.norm);
      requestAnimationFrame(loop.bind(this));
    }
    loop.call(this);
  }

  set(value: number): void {
    this.target = value;
    this.subscribers.forEach(subscriber => subscriber(this.value));
  }
}

export function lerped(value: number, norm: number): Lerped {
  return new Lerped(value, norm);
}
