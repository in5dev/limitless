import { readable } from './store.ts';

const now = readable(new Date(), set => {
  let handle = requestAnimationFrame(loop);
  function loop() {
    set(new Date());
    handle = requestAnimationFrame(loop);
  }
  return () => cancelAnimationFrame(handle);
});
export default now;
