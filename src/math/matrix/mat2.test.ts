import { expect } from 'chai';
import Matrix2, { mat2 } from './mat2';

describe('mat2', () => {
  const a = mat2([5, 8, 3, 8]);
  const b = mat2([3, 8, 8, 9]);

  it('add', () => {
    const ans = Matrix2.add(a, b);
    expect(ans.equals([8, 16, 11, 17])).to.equal(true);
  });
  it('subtract', () => {
    const ans = Matrix2.sub(a, b);
    expect(ans.equals([2, 0, -5, -1])).to.equal(true);
  });
  it('multiply', () => {
    const ans = Matrix2.mult(a, b);
    expect(ans.equals([79, 112, 73, 96])).to.equal(true);
  });
  it('determinant', () => {
    const ans = a.det();
    expect(ans).to.equal(16);
  });
});
