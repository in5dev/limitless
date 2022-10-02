// deno-lint-ignore-file ban-ts-comment no-explicit-any

export const objectKeys = Object.keys as <T>(obj: T) => (keyof T)[];

export const hasOwn = (obj: any, key: PropertyKey) =>
  Object.prototype.hasOwnProperty.call(obj, key);

export function shallowEquals<
  A extends Record<any, any>,
  B extends Record<any, any>
>(a: A, b: B): boolean {
  // @ts-ignore
  if (a === b) return true;
  for (const key in a) {
    if (hasOwn(a, key) && !hasOwn(b, key)) return false;
  }
  for (const key in b) {
    if (hasOwn(b, key) && !hasOwn(a, key)) return false;
  }
  return true;
}

export function deepEquals<
  A extends Record<any, any>,
  B extends Record<any, any>
>(a: A, b: B): boolean {
  // @ts-ignore
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.constructor !== b.constructor) return false;
  for (const key in a) {
    if (hasOwn(a, key)) {
      if (!hasOwn(b, key)) return false;
      // @ts-ignore
      if (a[key] === b[key]) continue;
      if (typeof a[key] !== 'object') return false;
      if (!deepEquals(a[key], b[key])) return false;
    }
  }
  for (const key in b) {
    if (hasOwn(b, key)) {
      if (!hasOwn(a, key)) return false;
      // @ts-ignore
      if (a[key] === b[key]) continue;
      if (typeof b[key] !== 'object') return false;
      if (!deepEquals(a[key], b[key])) return false;
    }
  }
  return true;
}

export function deepCopy<T>(obj: T): T {
  if (obj == null) return obj;
  // @ts-ignore
  if (Array.isArray(obj)) return obj.map(deepCopy);
  if (typeof obj !== 'object') return obj;
  const copy: T = Object.create(Object.getPrototypeOf(obj));
  for (const key in obj) {
    if (hasOwn(obj, key)) copy[key] = deepCopy(obj[key]);
  }
  return copy;
}

export function value2Keys<K extends string, T extends string>(
  obj: Record<K, T[]>
): Record<T, K[]> {
  const result = {} as Record<T, K[]>;
  Object.entries(obj).forEach(([key, arr]) =>
    (arr as T[]).forEach(v => {
      if (!result[v]) result[v] = [];
      result[v].push(key as K);
    })
  );
  return result;
}
