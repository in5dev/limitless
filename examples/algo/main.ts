/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';

import * as sorts from '../../src/algorithm/sorts';
import { max, shuffle } from '../../src/util';

const length = 1000;
const stepsPerFrame = 10;

const randomNumberArr = shuffle(new Array(length).fill(0).map((_, i) => i + 1));
const m = max(randomNumberArr);
const iter = sorts.heap(randomNumberArr, (a, b) => a - b);

let active: number[] = [];

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = () => {
    p.background(0);
    const w = p.width / randomNumberArr.length;
    randomNumberArr.forEach((n, i) => {
      if (active.includes(i)) p.fill(255, 0, 0);
      else p.fill(255);
      p.rect(
        i * w,
        p.map(n, 0, m, p.height, 0),
        w,
        p.map(n, 0, m, 0, p.height)
      );
    });
    for (let i = 0; i < stepsPerFrame; i++) {
      const next = iter.next();
      if (next.done) {
        active = [];
        p.noLoop();
        return;
      }
      active = next.value || [];
    }
  };
});
