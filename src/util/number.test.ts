import { expect } from 'chai';
import { toSuffix } from './number';

describe('number', () => {
  expect(toSuffix(14)).to.equal('14');
  expect(toSuffix(123_456)).to.equal('123.456 thousand');
  expect(toSuffix(3.6e15)).to.equal('3.6 quadrillion');
  expect(toSuffix(3.6e15, true)).to.equal('3.6 qd');
  expect(toSuffix(20e42, true)).to.equal('20 tD');
});
