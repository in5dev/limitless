import test from 'ava';

import Matrix4, { mat4 } from './mat4';

const a = mat4([5, 7, 9, 10, 2, 3, 3, 8, 8, 10, 2, 3, 3, 3, 4, 8]);
const b = mat4([3, 10, 12, 18, 12, 1, 4, 9, 9, 10, 12, 2, 3, 12, 4, 10]);

test('add', t => {
  const ans = Matrix4.add(a, b);
  t.assert(
    ans.equals([8, 17, 21, 28, 14, 4, 7, 17, 17, 20, 14, 5, 6, 15, 8, 18])
  );
});
test('subtract', t => {
  const ans = Matrix4.sub(a, b);
  t.assert(
    ans.equals([2, -3, -3, -8, -10, 2, -1, -1, -1, 0, -10, 1, 0, -9, 0, -2])
  );
});
test('multiply', t => {
  const ans = Matrix4.mult(a, b);
  t.assert(
    ans.equals([
      210, 267, 236, 271, 93, 149, 104, 149, 171, 146, 172, 268, 105, 169, 128,
      169
    ])
  );
});
test('determinant', t => {
  const ans = a.det();
  t.is(ans, -361);
});
