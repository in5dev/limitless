import {
  assert,
  assertEquals,
  assertFalse
} from 'https://deno.land/std@0.158.0/testing/asserts.ts';
import { deepCopy, deepEquals, hasOwn, shallowEquals } from './object.ts';

Deno.test('hasOwn', () => {
  const obj = {
    a: 1,
    b: 2
  };
  assert(hasOwn(obj, 'a'));
  assertFalse(hasOwn(obj, 'c'));
});

Deno.test('shallowEquals', () => {
  const a = {
    a: 1,
    b: 2
  };
  const b = {
    a: 1,
    b: 2
  };
  assert(shallowEquals(a, b));
});

Deno.test('deepEquals', () => {
  const a = {
    a: 1,
    b: 2
  };
  const b = {
    a: 1,
    b: 2
  };
  assert(deepEquals(a, b));

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
  assert(deepEquals(c, d));

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
  assert(deepEquals(e, f));

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
  assertFalse(deepEquals(g, h));
});

Deno.test('deepCopy', () => {
  const a = {
    a: 1,
    b: 2
  };
  const b = deepCopy(a);
  assertEquals(a, b);
});
