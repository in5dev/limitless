import {
  assert,
  assertEquals
} from 'https://deno.land/std@0.158.0/testing/asserts.ts';
import Matrix3, { mat3 } from './mat3.ts';

const a = mat3([10, 20, 10, 4, 5, 6, 2, 3, 5]);
const b = mat3([3, 2, 4, 3, 3, 9, 4, 4, 2]);

Deno.test('add', () => {
  const ans = Matrix3.add(a, b);
  assert(ans.equals([13, 22, 14, 7, 8, 15, 6, 7, 7]));
});
Deno.test('subtract', () => {
  const ans = Matrix3.sub(a, b);
  assert(ans.equals([7, 18, 6, 1, 2, -3, -2, -1, 3]));
});
Deno.test('multiply', () => {
  const ans = Matrix3.mult(a, b);
  assert(ans.equals([130, 120, 240, 51, 47, 73, 35, 33, 45]));
});
Deno.test('determinant', () => {
  const ans = a.det();
  assertEquals(ans, -70);
});
Deno.test('adjugate', () => {
  const ans = a.adj();
  assert(ans.equals([7, -70, 70, -8, 30, -20, 2, 10, -30]));
});
Deno.test('inverse', () => {
  const ans = a.inv();
  assert(
    ans.equals([-0.1, 1, -1, 8 / 70, -3 / 7, 2 / 7, -1 / 35, -1 / 7, 3 / 7])
  );
});
