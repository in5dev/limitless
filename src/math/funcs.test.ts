import { expect } from 'chai';
import { overlap } from './funcs';

describe('overlap', () => {
  it('ranges overlap', () => {
    expect(overlap(0, 100, 50, 200)).to.equal(50);
    expect(overlap(100, 0, 200, 50)).to.equal(50);
  });
  it("ranges don't overlap", () => {
    expect(overlap(0, 100, 200, 300)).to.equal(-100);
    expect(overlap(100, 0, 300, 200)).to.equal(-100);
    expect(overlap(200, 300, 0, 100)).to.equal(-100);
    expect(overlap(300, 200, 100, 0)).to.equal(-100);
  });
});
