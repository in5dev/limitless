/* eslint-disable max-classes-per-file */
type Subscriber<T> = (value: T) => void;

export class ReadableStore<T> {
  subscribers = new Set<Subscriber<T>>();
  stop?: () => void;

  constructor(
    protected value: T,
    private start?: (set: (value: T) => void) => () => void
  ) {}

  get(): T {
    return this.value;
  }

  protected set(value: T): void {
    this.value = value;
    this.subscribers.forEach(subscriber => subscriber(value));
  }

  subscribe(subscriber: Subscriber<T>): () => void {
    const { subscribers } = this;
    if (!subscribers.size) this.stop = this.start?.(this.set.bind(this));
    subscribers.add(subscriber);
    return () => {
      subscribers.delete(subscriber);
      if (!subscribers.size) this.stop?.();
    };
  }
}
export function readable<T>(
  value: T,
  start?: (set: (value: T) => void) => () => void
): ReadableStore<T> {
  return new ReadableStore(value, start);
}

export class WritableStore<T> extends ReadableStore<T> {
  constructor(value: T, start?: (set: (value: T) => void) => () => void) {
    super(value, start);
  }

  set(value: T): void {
    super.set(value);
  }

  update(fn: (value: T) => T): void {
    super.set(fn(this.value));
  }
}
export function writable<T>(
  value: T,
  start?: (set: (value: T) => void) => () => void
): WritableStore<T> {
  return new WritableStore(value, start);
}

export class DerivedStore<T, U> extends ReadableStore<T> {
  constructor(
    store: ReadableStore<U>,
    callback: (value: U, set: (value: T) => void) => T,
    initialValue: T
  ) {
    super(initialValue, set =>
      store.subscribe(value => set(callback(value, set)))
    );
  }
}
export function derived<T, U>(
  store: ReadableStore<U>,
  callback: (value: U, set: (value: T) => void) => T,
  initialValue: T
): DerivedStore<T, U> {
  return new DerivedStore(store, callback, initialValue);
}
