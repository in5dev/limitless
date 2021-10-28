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
