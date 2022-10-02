import { assertEquals } from 'https://deno.land/std@0.158.0/testing/asserts.ts';
import { overlap } from './funcs.ts';

Deno.test('ranges overlap', () => {
  assertEquals(overlap(0, 100, 50, 200), 50);
  assertEquals(overlap(100, 0, 200, 50), 50);
});
Deno.test("ranges don't overlap", () => {
  assertEquals(overlap(0, 100, 200, 300), -100);
  assertEquals(overlap(100, 0, 300, 200), -100);
  assertEquals(overlap(200, 300, 0, 100), -100);
  assertEquals(overlap(300, 200, 100, 0), -100);
});
