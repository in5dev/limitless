import { get, Writable, writable } from './store';
import { linear } from './easing';
import { lerp } from '../math';

export default function tweened(
  value: number,
  duration: number,
  easing = linear
): Writable<number> {
  let from = value;
  let to = value;
  let time = performance.now();

  const store = writable(value, set => {
    let handle = requestAnimationFrame(loop);
    function loop() {
      const t = performance.now();
      set(lerp(from, to, easing(Math.min(1, (t - time) / duration))));
      handle = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(handle);
  });

  return {
    subscribe: store.subscribe,
    set: (value: number) => {
      const val = get(store);
      from = val;
      to = value;
      time = performance.now();
    },
    update: store.update
  };
}
