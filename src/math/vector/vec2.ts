import { clamp, lerp, random } from '../funcs';
import Vector from './vec';

type First = Vector2 | [x: number, y: number] | number;

export default class Vector2 extends Vector {
  x!: number;
  y!: number;

  constructor(x: First = 0, y?: number) {
    super();
    this.set(x, y);
  }

  toString(): string {
    const { x, y } = this;
    return `vec2 <${x}, ${y}>`;
  }

  copy(): Vector2 {
    return vec2(+this.x, +this.y);
  }

  set(x: First, y?: number): this {
    if (x instanceof Vector2) {
      this.x = x.x;
      this.y = x.y;
    } else if (x instanceof Array) {
      [this.x, this.y] = x;
    } else if (y === undefined) {
      this.x = x;
      this.y = x;
    } else {
      this.x = x;
      this.y = y || 0;
    }
    return this;
  }

  static random(mag = 1): Vector2 {
    return vec2(1, 0)
      .rotate(random(Math.PI * 2))
      .setMag(mag);
  }

  equals(x: First, y = 0): boolean {
    if (x instanceof Vector2) return this.x === x.x && this.y === x.y;
    if (x instanceof Array) return this.x === x[0] && this.y === x[1];
    return this.x === x && this.y === y;
  }

  add(x: First, y?: number): this {
    if (x instanceof Vector2) {
      this.x += x.x;
      this.y += x.y;
    } else if (x instanceof Array) {
      this.x += x[0];
      this.y += x[1];
    } else if (y === undefined) {
      this.x += x;
      this.y += x;
    } else {
      this.x += x;
      this.y += y || 0;
    }
    return this;
  }
  static add(v1: Vector2, x: First, y?: number): Vector2 {
    return v1.copy().add(x, y);
  }

  sub(x: First, y?: number): this {
    if (x instanceof Vector2) {
      this.x -= x.x;
      this.y -= x.y;
    } else if (x instanceof Array) {
      this.x -= x[0];
      this.y -= x[1];
    } else if (y === undefined) {
      this.x -= x;
      this.y -= x;
    } else {
      this.x -= x;
      this.y -= y || 0;
    }
    return this;
  }
  static sub(v1: Vector2, x: First, y?: number): Vector2 {
    return v1.copy().sub(x, y);
  }

  mult(x: First, y?: number): this {
    if (x instanceof Vector2) {
      this.x *= x.x;
      this.y *= x.y;
    } else if (x instanceof Array) {
      this.x *= x[0];
      this.y *= x[1];
    } else if (y === undefined) {
      this.x *= x;
      this.y *= x;
    } else {
      this.x *= x;
      this.y *= y ?? 1;
    }
    return this;
  }
  static mult(v1: Vector2, x: First, y?: number): Vector2 {
    return v1.copy().mult(x, y);
  }

  div(x: First, y?: number): this {
    if (x instanceof Vector2) {
      this.x /= x.x;
      this.y /= x.y;
    } else if (x instanceof Array) {
      this.x /= x[0];
      this.y /= x[1];
    } else if (y === undefined) {
      this.x /= x;
      this.y /= x;
    } else {
      this.x /= x;
      this.y /= y ?? 1;
    }
    return this;
  }
  static div(v1: Vector2, x: First, y?: number): Vector2 {
    return v1.copy().div(x, y);
  }

  magSq(): number {
    const { x, y } = this;
    return x ** 2 + y ** 2;
  }

  distSq(v: Vector2): number {
    return Vector2.sub(v, this).magSq();
  }

  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: Vector2): number {
    return this.x * v.y - this.y * v.x;
  }

  lerp(v: Vector2, norm: number): this {
    const { x, y } = this;
    this.x = lerp(x, v.x, norm);
    this.y = lerp(y, v.y, norm);
    return this;
  }
  static lerp(v1: Vector2, v2: Vector2, norm: number): Vector2 {
    return v1.copy().lerp(v2, norm);
  }

  clamp(min: Vector2, max: Vector2): this {
    const { x, y } = this;
    this.x = clamp(x, min.x, max.x);
    this.y = clamp(y, min.y, max.y);
    return this;
  }
  static clamp(v: Vector2, min: Vector2, max: Vector2): Vector2 {
    return v.copy().clamp(min, max);
  }

  perp(): Vector2 {
    return vec2(this.y, -this.x);
  }

  angle(): number {
    return Math.atan2(this.y, this.x);
  }

  setAngle(a: number): this {
    const mag = this.mag();
    return this.set(Math.cos(a) * mag, Math.sin(a) * mag);
  }

  rotate(angle: number): this {
    const { x, y } = this;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    this.x = cos * x - sin * y;
    this.y = sin * x + cos * y;
    return this;
  }
  static rotate(v: Vector2, angle: number): Vector2 {
    return v.copy().rotate(angle);
  }

  reflect(normal: Vector2): this {
    return this.sub(Vector2.mult(normal, 2 * this.dot(normal)));
  }
}

export function vec2(x?: First, y?: number): Vector2 {
  return new Vector2(x, y);
}
