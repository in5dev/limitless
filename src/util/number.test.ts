import { assertEquals } from 'https://deno.land/std@0.158.0/testing/asserts.ts';
import { toSuffix } from './number.ts';

Deno.test('number', () => {
  assertEquals(toSuffix(14), '14');
  assertEquals(toSuffix(123_456), '123.456 thousand');
  assertEquals(toSuffix(3.6e15), '3.6 quadrillion');
  assertEquals(toSuffix(3.6e15, true), '3.6 qd');
  assertEquals(toSuffix(20e42, true), '20 tD');
});
