import test from 'ava';

import { overlap } from './funcs';

test('ranges overlap', t => {
  t.is(overlap(0, 100, 50, 200), 50);
  t.is(overlap(100, 0, 200, 50), 50);
});
test("ranges don't overlap", t => {
  t.is(overlap(0, 100, 200, 300), -100);
  t.is(overlap(100, 0, 300, 200), -100);
  t.is(overlap(200, 300, 0, 100), -100);
  t.is(overlap(300, 200, 100, 0), -100);
});
