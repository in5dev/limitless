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

export function readable<T>(value: T, start?: StartStop<T>): Readable<T> {
  return {
    subscribe: writable(value, start).subscribe
  };
}

export function writable<T>(value: T, start?: StartStop<T>): Writable<T> {
  const subscribers = new Set<Subscriber<T>>();
  let stop: Unsubscriber | void;

  return {
    subscribe(subscriber: Subscriber<T>) {
      if (!stop && start) stop = start(this.set);
      subscribers.add(subscriber);
      return () => {
        subscribers.delete(subscriber);
        if (!subscribers.size) stop?.();
      };
    },
    set(val: T) {
      value = val;
      subscribers.forEach(subscriber => subscriber(val));
    },
    update(updater: Updater<T>) {
      this.set(updater(value));
    }
  };
}

export function get<T>(store: Readable<T>): T {
  let value: T;
  store.subscribe(v => (value = v))();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return value;
}
