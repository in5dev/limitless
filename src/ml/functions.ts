export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}
export function dsigmoid(y: number): number {
  return y * (1 - y);
}

export function relu(x: number): number {
  return x > 0 ? x : 0;
}
export function drelu(y: number): number {
  return y > 0 ? 1 : 0;
}

export function tanh(x: number): number {
  return Math.tanh(x);
}
export function dtanh(y: number): number {
  return 1 - y * y;
}
