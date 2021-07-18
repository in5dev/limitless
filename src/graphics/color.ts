export default class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(gray: number, alpha?: number);
  constructor(red: number, green: number, blue: number, alpha?: number);
  constructor(r: number, g?: number, b?: number, a?: number) {
    if (typeof g === 'number') {
      if (typeof b === 'number') {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a ?? 255;
      } else {
        this.r = r;
        this.g = r;
        this.b = r;
        this.a = g ?? 255;
      }
    } else {
      this.r = r;
      this.g = r;
      this.b = r;
      this.a = 255;
    }
  }
}
