import test from 'ava';

import Matrix2, { mat2 } from './mat2';

const a = mat2([5, 8, 3, 8]);
const b = mat2([3, 8, 8, 9]);

test('add', t => {
  const ans = Matrix2.add(a, b);
  t.assert(ans.equals([8, 16, 11, 17]));
});
test('subtract', t => {
  const ans = Matrix2.sub(a, b);
  t.assert(ans.equals([2, 0, -5, -1]));
});
test('multiply', t => {
  const ans = Matrix2.mult(a, b);
  t.assert(ans.equals([79, 112, 73, 96]));
});
test('determinant', t => {
  const ans = a.det();
  t.is(ans, 16);
});
