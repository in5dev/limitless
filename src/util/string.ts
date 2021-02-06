/* eslint-disable func-names */

declare global {
  interface String {
    reverse(): string;
  }
}

String.prototype.reverse = function (): string {
  return this.split('').reverse().join();
};

export {};
