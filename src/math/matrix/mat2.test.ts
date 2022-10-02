import {
  assert,
  assertEquals
} from 'https://deno.land/std@0.158.0/testing/asserts.ts';
import Matrix2, { mat2 } from './mat2.ts';

const a = mat2([5, 8, 3, 8]);
const b = mat2([3, 8, 8, 9]);

Deno.test('add', () => {
  const ans = Matrix2.add(a, b);
  assert(ans.equals([8, 16, 11, 17]));
});
Deno.test('subtract', () => {
  const ans = Matrix2.sub(a, b);
  assert(ans.equals([2, 0, -5, -1]));
});
Deno.test('multiply', () => {
  const ans = Matrix2.mult(a, b);
  assert(ans.equals([79, 112, 73, 96]));
});
Deno.test('determinant', () => {
  const ans = a.det();
  assertEquals(ans, 16);
});
