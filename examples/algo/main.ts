/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';

import * as sorts from '../../src/algorithm/sorts';
import { max, shuffle } from '../../src/util';

const randomNumberArr = shuffle(new Array(100).fill(0).map((_, i) => i + 1));
const m = max(randomNumberArr);
const iter = sorts.quick(randomNumberArr, (a, b) => a - b);

let active: number[] = [];

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400);
    p.noStroke();
    p.frameRate(10);
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
    active = iter.next().value || [];
  };
});
