import * as sorts from '../../src/algorithm/sorts';
import Renderer2D from '../../src/gfx/2d';
import { map, random } from '../../src/math';
import { max, pause } from '../../src/util';

const length = 100;

const arr = new Array(length).fill(0).map((_, i) => i + 1);
const m = max(arr);

window.addEventListener('click', run);
function run() {
  window.removeEventListener('click', run);

  let active: number[] = [];

  const audio = new AudioContext();
  const oscillators = new Array(2).fill(0).map(() => {
    const osc = audio.createOscillator();
    osc.type = 'square';
    osc.connect(audio.destination);
    osc.start();
    return osc;
  });

  const p = new Renderer2D(window.innerWidth, window.innerHeight);
  p.noStroke();

  window.addEventListener('resize', () =>
    p.resize(window.innerWidth, window.innerHeight)
  );

  let iter = sorts.shuffleGen(arr);

  function chooseRandom() {
    const iters = [
      sorts.bubble,
      sorts.insertion,
      sorts.selection,
      sorts.merge,
      sorts.quick,
      sorts.binaryInsertion,
      sorts.shell,
      sorts.cycle,
      sorts.comb,
      sorts.heap
    ];
    iter = random(iters)(arr, (a, b) => a - b);
  }

  let sortNext = true;
  p.render(() => {
    render();
    oscillators.forEach((osc, i) => {
      const index = active[i];
      osc.frequency.value = 0;
      if (index === undefined || arr[index] === undefined) return;
      console.log(0);
      osc.frequency.value = map(arr[index] || 0, 0, length, 240, 840);
    });
    const next = iter.next();
    if (next.done) {
      active = [];
      render();
      p.stop();
      oscillators.forEach(osc => (osc.frequency.value = 0));
      pause(1000).then(() => {
        if (sortNext) {
          chooseRandom();
          sortNext = false;
        } else {
          iter = sorts.shuffleGen(arr);
          sortNext = true;
        }
        p.start();
      });
    }
    active = next.value || [];
  });

  function render() {
    p.background('#000');
    const w = p.width / arr.length;
    arr.forEach((n, i) => {
      if (active.includes(i)) p.fill('#f00');
      else p.fill('#fff');
      p.rect(i * w, map(n, 0, m, p.height, 0), w, map(n, 0, m, 0, p.height));
    });
  }
}
