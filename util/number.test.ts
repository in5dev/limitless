import test from 'ava';

import { toSuffix } from './number';

test('number', t => {
  t.is(toSuffix(14), '14');
  t.is(toSuffix(123_456), '123.456 thousand');
  t.is(toSuffix(3.6e15), '3.6 quadrillion');
  t.is(toSuffix(3.6e15, true), '3.6 qd');
  t.is(toSuffix(20e42, true), '20 tD');
});
