// deno-lint-ignore-file no-explicit-any
type Subscriber<T> = (value: T) => void;
type Unsubscriber = () => void;
type Updater<T> = (value: T) => T;
type StartStop<T> = (set: (value: T) => void) => Unsubscriber | void;

export interface Readable<T> {
  subscribe(subscriber: Subscriber<T>): Unsubscriber;
}

export interface Writable<T> extends Readable<T> {
  set(value: T): void;
  update(updater: Updater<T>): void;
}

export function readable<T>(value?: T, start?: StartStop<T>): Readable<T> {
  return {
    subscribe: writable(value, start).subscribe
  };
}

export function writable<T>(value?: T, start?: StartStop<T>): Writable<T> {
  const subscribers = new Set<Subscriber<T>>();
  let stop: Unsubscriber | void;

  function subscribe(subscriber: Subscriber<T>): Unsubscriber {
    if (!stop && start) stop = start(set);
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
      if (!subscribers.size) stop?.();
    };
  }
  function set(val: T): void {
    value = val;
    subscribers.forEach(subscriber => subscriber(val));
  }
  function update(updater: Updater<T>): void {
    set(updater(value as T));
  }
  return {
    subscribe,
    set,
    update
  };
}

type Stores = Readable<any> | Readable<any>[];
type StoreValues<S extends Stores> = S extends Readable<infer T>
  ? T
  : { [K in keyof S]: S[K] extends Readable<infer T> ? T : never };

export function derived<S, T>(
  store: Readable<S>,
  fn: (value: S) => T,
  initialValue?: T
): Readable<T>;
export function derived<S extends Stores, T>(
  stores: Stores,
  fn: (values: StoreValues<S>) => T,
  initialValue?: T
): Readable<T>;
export function derived<S extends Stores, T>(
  stores: Stores,
  fn: (values: StoreValues<S>) => T,
  initialValue?: T
): Readable<T> {
  if (Array.isArray(stores))
    return readable(initialValue, set => {
      const values = stores.map(store => get(store)) as StoreValues<S>;
      const unsubscribers = stores.map((store, i) =>
        store.subscribe(value => {
          values[i] = value;
          set(fn(values));
        })
      );
      return () => unsubscribers.forEach(unsubscriber => unsubscriber());
    });
  return readable(initialValue, set =>
    stores.subscribe(value => set(fn(value)))
  );
}

export function get<T>(store: Readable<T>): T {
  let value: T;
  store.subscribe(v => (value = v))();
  // deno-lint-ignore ban-ts-comment
  // @ts-ignore
  return value;
}
