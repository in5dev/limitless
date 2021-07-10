export function pause(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function benchmark(func: () => any, iterations = 1_000_000): number {
  const startTime = performance.now();
  for (let i = 0; i < iterations; i++) {
    func();
  }
  const endTime = performance.now();
  return (endTime - startTime) / iterations;
}
