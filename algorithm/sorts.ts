/* eslint-disable no-continue */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { swap } from '../util';

const gapFactor = 1.3;

export function* shuffleGen<T>(arr: T[]): Generator<number[]> {
  const { length } = arr;
  for (let i = 0; i < length; i++) {
    const j = Math.floor(Math.random() * length);
    swap(arr, i, j);
    yield [i, j];
  }
}

export function* bubble<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<number[]> {
  const { length } = arr;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - 1 - i; j++) {
      if (compare(arr[j]!, arr[j + 1]!) > 0) swap(arr, j, j + 1);
      yield [j, j + 1];
    }
  }
}

export function* cocktail<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<number[]> {
  const { length } = arr;
  let start = 0;
  let end = length - 1;
  while (start < end) {
    for (let i = start; i < end; i++) {
      if (compare(arr[i]!, arr[i + 1]!) > 0) swap(arr, i, i + 1);
      yield [i, i + 1];
    }
    end--;
    for (let i = end; i > start; i--) {
      if (compare(arr[i]!, arr[i - 1]!) < 0) swap(arr, i, i - 1);
      yield [i, i - 1];
    }
    start++;
  }
}

export function* selection<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<number[]> {
  const { length } = arr;
  for (let i = 0; i < length; i++) {
    let min = i;
    for (let j = i + 1; j < length; j++) {
      if (compare(arr[j]!, arr[min]!) < 0) min = j;
      yield [j];
    }
    if (min !== i) swap(arr, i, min);
    yield [i, min];
  }
}

export function* insertion<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<number[]> {
  const { length } = arr;
  for (let i = 1; i < length; i++) {
    let j = i;
    while (j > 0 && compare(arr[j]!, arr[j - 1]!) < 0) {
      swap(arr, j, j - 1);
      j--;
      yield [j, j - 1];
    }
  }
}

export function* quick<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<number[]> {
  const { length } = arr;
  function* sort(left: number, right: number): Generator<number[]> {
    if (left >= right) return;
    const pivot = arr[left];
    let i = left + 1;
    let j = right;
    while (i <= j) {
      while (i <= right && compare(arr[i]!, pivot!) <= 0) i++;
      while (j > left && compare(arr[j]!, pivot!) > 0) j--;
      if (i < j) swap(arr, i, j);
      yield [left, i, j];
    }
    swap(arr, left, j);
    yield* sort(left, j - 1);
    yield* sort(j + 1, right);
  }
  yield* sort(0, length - 1);
}

export function* shell<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<number[]> {
  const { length } = arr;
  let gap = Math.floor(length / 2);
  while (gap > 0) {
    for (let i = gap; i < length; i++) {
      let j = i;
      while (j >= gap && compare(arr[j]!, arr[j - gap]!) < 0) {
        swap(arr, j, j - gap);
        j -= gap;
        yield [j, j - gap];
      }
    }
    gap = Math.floor(gap / gapFactor);
  }
}

export function* merge<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<number[]> {
  const { length } = arr;
  function* mergeSort(left: number, right: number): Generator<number[]> {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    yield* mergeSort(left, mid);
    yield* mergeSort(mid + 1, right);
    const temp = new Array(right - left + 1);
    let i = left;
    let j = mid + 1;
    let k = 0;
    while (i <= mid && j <= right) {
      if (compare(arr[i]!, arr[j]!) < 0) {
        temp[k] = arr[i];
        i++;
      } else {
        temp[k] = arr[j];
        j++;
      }
      k++;
      yield [i, j];
    }
    while (i <= mid) {
      temp[k] = arr[i];
      i++;
      k++;
      yield [i];
    }
    while (j <= right) {
      temp[k] = arr[j];
      j++;
      k++;
      yield [j];
    }
    for (let m = 0; m < temp.length; m++) {
      arr[left + m] = temp[m];
      yield [left + m];
    }
  }
  yield* mergeSort(0, length - 1);
}

export function* heap<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<number[]> {
  const { length } = arr;
  function* heapify(i: number, length: number): Generator<number[]> {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;
    if (left < length && compare(arr[left]!, arr[largest]!) > 0) largest = left;
    if (right < length && compare(arr[right]!, arr[largest]!) > 0)
      largest = right;
    if (largest !== i) {
      swap(arr, i, largest);
      yield [i, largest];
      yield* heapify(largest, length);
    }
  }
  for (let i = Math.floor(length / 2); i >= 0; i--) {
    yield* heapify(i, length);
  }
  for (let i = length - 1; i > 0; i--) {
    swap(arr, 0, i);
    yield [0, i];
    yield* heapify(0, i);
  }
}

export function* binaryInsertion<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<number[]> {
  const { length } = arr;
  for (let i = 1; i < length; i++) {
    const key = arr[i]!;
    let low = 0;
    let high = i - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (compare(key, arr[mid]!) < 0) high = mid - 1;
      else low = mid + 1;
      yield [i, mid];
    }
    let j = i;
    while (j > low) {
      swap(arr, j, j - 1);
      j--;
      yield [j, j - 1];
    }
  }
}

export function* comb<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<number[]> {
  const { length } = arr;
  let gap = Math.floor(length / 2);
  while (gap > 0) {
    for (let i = 0; i < length; i++) {
      for (let j = i; j < length; j += gap) {
        if (compare(arr[j]!, arr[i]!) < 0) {
          swap(arr, i, j);
          yield [i, j];
        }
      }
    }
    gap = Math.floor(gap / gapFactor);
  }
}

export function* gnome<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<number[]> {
  const { length } = arr;
  let i = 0;
  while (i < length) {
    if (!i) i++;
    if (compare(arr[i]!, arr[i - 1]!) > 0) i++;
    else {
      swap(arr, i, i - 1);
      yield [i, i - 1];
      i--;
    }
  }
}

export function* cycle<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<number[]> {
  const { length } = arr;
  for (let start = 0; start < length - 1; start++) {
    let item = arr[start]!;

    let pos = start;
    for (let i = start + 1; i < length; i++) {
      if (compare(arr[i]!, item) < 0) pos++;
      yield [start, i];
    }

    if (pos === start) continue;

    while (item === arr[pos]) pos++;
    [arr[pos], item] = [item, arr[pos]!];
    yield [start, pos];

    while (pos !== start) {
      pos = start;
      for (let i = start + 1; i < length; i++) {
        if (compare(arr[i]!, item) < 0) pos++;
        yield [start, i];
      }

      while (item === arr[pos]) pos++;
      [arr[pos], item] = [item, arr[pos]!];
      yield [start, pos];
    }
  }
}
