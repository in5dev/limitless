export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function dsigmoid(y: number): number {
  return y * (1 - y);
}
