import test from 'ava';

import { deepCopy, deepEquals, hasOwn, shallowEquals } from './object';

test('hasOwn', t => {
  const obj = {
    a: 1,
    b: 2
  };
  t.true(hasOwn(obj, 'a'));
  t.false(hasOwn(obj, 'c'));
});

test('shallowEquals', t => {
  const a = {
    a: 1,
    b: 2
  };
  const b = {
    a: 1,
    b: 2
  };
  t.true(shallowEquals(a, b));
});

test('deepEquals', t => {
  const a = {
    a: 1,
    b: 2
  };
  const b = {
    a: 1,
    b: 2
  };
  t.true(deepEquals(a, b));

  const c = {
    a: 1,
    b: 2,
    c: {
      a: 1,
      b: 2
    }
  };
  const d = {
    a: 1,
    b: 2,
    c: {
      a: 1,
      b: 2
    }
  };
  t.true(deepEquals(c, d));

  const e = {
    a: 1,
    b: 2,
    c: [1, 2]
  };
  const f = {
    a: 1,
    b: 2,
    c: [1, 2]
  };
  t.true(deepEquals(e, f));

  const g = {
    a: 1,
    b: 2,
    c: [1, 2, 3]
  };
  const h = {
    a: 1,
    b: 2,
    c: [1, 3]
  };
  t.false(deepEquals(g, h));
});

test('deepCopy', t => {
  const a = {
    a: 1,
    b: 2
  };
  const b = deepCopy(a);
  t.deepEqual(a, b);
});
