import { writable } from './store.js';
import { lerp } from '../math/index.js';
import type { Writable } from './store.js';

export default function lerped(value: number, norm: number): Writable<number> {
  let target = value;
  const store = writable(value, () => {
    let handle = requestAnimationFrame(loop);
    function loop() {
      store.update(value => lerp(value, target, norm));
      handle = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(handle);
  });

  return {
    subscribe: store.subscribe,
    set: (value: number) => (target = value),
    update: store.update
  };
}
