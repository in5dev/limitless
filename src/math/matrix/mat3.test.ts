import test from 'ava';

import Matrix3, { mat3 } from './mat3';

const a = mat3([10, 20, 10, 4, 5, 6, 2, 3, 5]);
const b = mat3([3, 2, 4, 3, 3, 9, 4, 4, 2]);

test('add', t => {
  const ans = Matrix3.add(a, b);
  t.assert(ans.equals([13, 22, 14, 7, 8, 15, 6, 7, 7]));
});
test('subtract', t => {
  const ans = Matrix3.sub(a, b);
  t.assert(ans.equals([7, 18, 6, 1, 2, -3, -2, -1, 3]));
});
test('multiply', t => {
  const ans = Matrix3.mult(a, b);
  t.assert(ans.equals([130, 120, 240, 51, 47, 73, 35, 33, 45]));
});
test('determinant', t => {
  const ans = a.det();
  t.is(ans, -70);
});
test('adjugate', t => {
  const ans = a.adj();
  t.assert(ans.equals([7, -70, 70, -8, 30, -20, 2, 10, -30]));
});
test('inverse', t => {
  const ans = a.inv();
  t.assert(
    ans.equals([-0.1, 1, -1, 8 / 70, -3 / 7, 2 / 7, -1 / 35, -1 / 7, 3 / 7])
  );
});
