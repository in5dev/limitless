import { expect } from 'chai';
import './number';

describe('number', () => {
  expect((14).toSuffix()).to.equal('14');
  expect((123_456).toSuffix()).to.equal('123.456 thousand');
  expect((3.6e15).toSuffix()).to.equal('3.6 quadrillion');
  expect((3.6e15).toSuffix(true)).to.equal('3.6 qd');
  expect((20e42).toSuffix(true)).to.equal('20 tD');
});
