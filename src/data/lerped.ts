import { lerp } from '../math';
import Store from './store';

export default class LerpedStore extends Store<number> {
  target = this.value;

  constructor(value: number, public norm: number) {
    super(value);

    function loop(this: LerpedStore) {
      this.value = lerp(this.value, this.target, this.norm);
      requestAnimationFrame(loop.bind(this));
    }
    loop.call(this);
  }

  set(value: number) {
    this.target = value;
    this.subscribers.forEach(subscriber => subscriber(this.value));
  }
}

export function lerped(value: number, norm: number): LerpedStore {
  return new LerpedStore(value, norm);
}
