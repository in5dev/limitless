export function* range(min: number, max?: number, step = 1): Generator<number> {
  if (typeof max === 'number')
    for (let i = min; i < max; i += step) {
      yield i;
    }
  else
    for (let i = 0; i < min; i++) {
      yield i;
    }
}
