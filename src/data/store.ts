type Subscriber<T> = (value: T) => void;

export default class Store<T> {
  subscribers = new Set<Subscriber<T>>();

  constructor(protected value: T) {}

  get(): T {
    return this.value;
  }

  set(value: T): void {
    this.value = value;
    this.subscribers.forEach(subscriber => subscriber(value));
  }

  update(fn: (value: T) => T): void {
    this.set(fn(this.value));
  }

  subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }
}

export function store<T>(value: T): Store<T> {
  return new Store(value);
}
