import { readable } from './store.ts';

const now = readable(new Date(), se()=> {
  let handle = requestAnimationFrame(loop);
  function loop() {
    set(new Date());
    handle = requestAnimationFrame(loop);
  }
  return () => cancelAnimationFrame(handle);
});
export default now;
