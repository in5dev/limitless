import * as sorts from '../../src/algorithm/sorts';
import Renderer2D from '../../src/gfx/2d';
import { map } from '../../src/math';
import { max, shuffle } from '../../src/util';

const length = 100;
const stepsPerFrame = 1;

const randomNumberArr = shuffle(new Array(length).fill(0).map((_, i) => i + 1));
const m = max(randomNumberArr);
const iter = sorts.heap(randomNumberArr, (a, b) => a - b);

let active: number[] = [];

const p = new Renderer2D(window.innerWidth, window.innerHeight);
p.noStroke();

window.addEventListener('resize', () =>
  p.resize(window.innerWidth, window.innerHeight)
);

p.render(() => {
  render();
  for (let i = 0; i < stepsPerFrame; i++) {
    const next = iter.next();
    if (next.done) {
      active = [];
      render();
      p.stop();
      return;
    }
    active = next.value || [];
  }
});

function render() {
  p.background('#000');
  const w = p.width / randomNumberArr.length;
  randomNumberArr.forEach((n, i) => {
    if (active.includes(i)) p.fill('#f00');
    else p.fill('#fff');
    p.rect(i * w, map(n, 0, m, p.height, 0), w, map(n, 0, m, 0, p.height));
  });
}
