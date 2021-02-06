export function range(min: number, max?: number, step = 1): number[] {
  const arr = [];
  if (typeof max === 'number')
    for (let i = min; i < max; i += step) {
      arr.push(i);
    }
  else
    for (let i = 0; i < min; i++) {
      arr.push(i);
    }

  return arr;
}
