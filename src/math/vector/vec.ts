export default abstract class Vector {
  abstract toString(): string;

  log(): this {
    console.log(this.toString());
    return this;
  }

  abstract set(v: this): this;
  abstract set(x: number): this;

  abstract equals(v: this): boolean;
  abstract equals(x: number): boolean;

  abstract add(v: this): this;
  abstract add(x: number): this;

  abstract sub(v: this): this;
  abstract sub(x: number): this;

  abstract mult(v: this): this;
  abstract mult(x: number): this;

  abstract div(v: this): this;
  abstract div(x: number): this;

  mag(): number {
    return Math.sqrt(this.magSq());
  }

  setMag(n: number): this {
    return this.normalize().mult(n);
  }

  abstract magSq(): number;

  limit(max: number): this {
    const maxSq = max * max;
    const magSq = this.magSq();
    if (magSq > maxSq) this.setMag(max);
    return this;
  }

  normalize(): this {
    const mag = this.mag();
    if (mag !== 0) this.div(mag);
    return this;
  }

  dist(v: this): number {
    return Math.sqrt(this.distSq(v));
  }

  abstract distSq(v: this): number;

  abstract dot(v: this): number;

  abstract lerp(v: this, norm: number): this;

  abstract clamp(min: this, max: this): this;

  abstract reflect(normal: this): this;
}
