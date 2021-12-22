import test from 'ava';
import { expect } from 'chai';
import Matrix2, { mat2 } from './mat2';

test('mat2', () => {
  const a = mat2([5, 8, 3, 8]);
  const b = mat2([3, 8, 8, 9]);

  test('add', () => {
    const ans = Matrix2.add(a, b);
    expect(ans.equals([8, 16, 11, 17])).to.equal(true);
  });
  test('subtract', () => {
    const ans = Matrix2.sub(a, b);
    expect(ans.equals([2, 0, -5, -1])).to.equal(true);
  });
  test('multiply', () => {
    const ans = Matrix2.mult(a, b);
    expect(ans.equals([79, 112, 73, 96])).to.equal(true);
  });
  test('determinant', () => {
    const ans = a.det();
    expect(ans).to.equal(16);
  });
});
