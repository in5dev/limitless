/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { swap } from '../util';

export function* bubble<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<T[]> {
  const { length } = arr;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - 1 - i; j++) {
      if (compare(arr[j]!, arr[j + 1]!) > 0) swap(arr, j, j + 1);
      yield arr;
    }
  }
}

export function* cocktail<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<T[]> {
  const { length } = arr;
  let start = 0;
  let end = length - 1;
  while (start < end) {
    for (let i = start; i < end; i++) {
      if (compare(arr[i]!, arr[i + 1]!) > 0) swap(arr, i, i + 1);
      yield arr;
    }
    end--;
    for (let i = end; i > start; i--) {
      if (compare(arr[i]!, arr[i - 1]!) < 0) swap(arr, i, i - 1);
      yield arr;
    }
    start++;
  }
}

export function* selection<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<T[]> {
  const { length } = arr;
  for (let i = 0; i < length; i++) {
    let min = i;
    for (let j = i + 1; j < length; j++) {
      if (compare(arr[j]!, arr[min]!) < 0) min = j;
    }
    if (min !== i) swap(arr, i, min);
    yield arr;
  }
}

export function* insertion<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<T[]> {
  const { length } = arr;
  for (let i = 1; i < length; i++) {
    let j = i;
    while (j > 0 && compare(arr[j]!, arr[j - 1]!) < 0) {
      swap(arr, j, j - 1);
      j--;
      yield arr;
    }
  }
}

export function* quick<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<T[]> {
  const { length } = arr;
  function* sort(left: number, right: number): Generator<T[]> {
    if (left >= right) return;
    const pivot = arr[left];
    let i = left + 1;
    let j = right;
    while (i <= j) {
      while (i <= right && compare(arr[i]!, pivot!) <= 0) i++;
      while (j > left && compare(arr[j]!, pivot!) > 0) j--;
      if (i < j) swap(arr, i, j);
      yield arr;
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
): Generator<T[]> {
  const { length } = arr;
  let gap = Math.floor(length / 2);
  while (gap > 0) {
    for (let i = gap; i < length; i++) {
      let j = i;
      while (j >= gap && compare(arr[j]!, arr[j - gap]!) < 0) {
        swap(arr, j, j - gap);
        j -= gap;
        yield arr;
      }
    }
    gap = Math.floor(gap / 2);
  }
}

export function* merge<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<T[]> {
  const { length } = arr;
  function* mergeSort(left: number, right: number): Generator<T[]> {
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
      yield arr;
    }
    while (i <= mid) {
      temp[k] = arr[i];
      i++;
      k++;
      yield arr;
    }
    while (j <= right) {
      temp[k] = arr[j];
      j++;
      k++;
      yield arr;
    }
    for (let m = 0; m < temp.length; m++) {
      arr[left + m] = temp[m];
      yield arr;
    }
  }
  yield* mergeSort(0, length - 1);
}

export function* heap<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): Generator<T[]> {
  const { length } = arr;
  function* heapify(i: number, length: number): Generator<T[]> {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;
    if (left < length && compare(arr[left]!, arr[largest]!) > 0) largest = left;
    if (right < length && compare(arr[right]!, arr[largest]!) > 0)
      largest = right;
    if (largest !== i) {
      swap(arr, i, largest);
      yield arr;
      yield* heapify(largest, length);
    }
  }
  for (let i = Math.floor(length / 2); i >= 0; i--) {
    yield* heapify(i, length);
  }
  for (let i = length - 1; i > 0; i--) {
    swap(arr, 0, i);
    yield arr;
    yield* heapify(0, i);
  }
}
