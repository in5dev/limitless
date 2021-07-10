type First = number | number[] | Vector;

export default class Vector {
  components!: Float64Array;

  constructor(v: number[] | Float64Array | Vector) {
    this.set(v);
  }

  toString(): string {
    return `⟨${this.components.join(',')}⟩`;
  }

  log(): this {
    console.log(this.toString());
    return this;
  }

  copy(): Vector {
    return vec(this);
  }

  set(v: number[] | Float64Array | Vector): this {
    if (v instanceof Float64Array) this.components = v;
    else if (v instanceof Vector) this.components = v.components.slice(0);
    else this.components = new Float64Array(v);
    return this;
  }

  equals(v: number[] | Float64Array | Vector): boolean {
    return this.components.every((x, i) => {
      if (v instanceof Vector) return x === v.components[i];
      return x === v[i];
    });
  }

  add(v: First): this {
    const { components } = this;
    if (v instanceof Vector) {
      v.components.forEach((x, i) => {
        if (!components[i]) components[i] = x;
        else components[i] += x;
      });
    } else if (Array.isArray(v)) {
      v.forEach((x, i) => {
        if (!components[i]) components[i] = x;
        else components[i] += x;
      });
    } else {
      for (let i = 0; i < components.length; i++) {
        components[i] += v;
      }
    }
    return this;
  }
  static add(v1: Vector, v2: First): Vector {
    return v1.copy().add(v2);
  }

  sub(v: First): this {
    const { components } = this;
    if (v instanceof Vector) {
      v.components.forEach((x, i) => {
        if (!components[i]) components[i] = -x;
        else components[i] -= x;
      });
    } else if (Array.isArray(v)) {
      v.forEach((x, i) => {
        if (!components[i]) components[i] = -x;
        else components[i] -= x;
      });
    } else {
      for (let i = 0; i < components.length; i++) {
        components[i] -= v;
      }
    }
    return this;
  }
  static sub(v1: Vector, v2: First): Vector {
    return v1.copy().sub(v2);
  }

  mult(v: First): this {
    const { components } = this;
    if (v instanceof Vector) {
      v.components.forEach((x, i) => {
        if (!components[i]) components[i] = 0;
        else components[i] *= x;
      });
    } else if (Array.isArray(v)) {
      v.forEach((x, i) => {
        if (!components[i]) components[i] = 0;
        else components[i] *= x;
      });
    } else {
      for (let i = 0; i < components.length; i++) {
        components[i] *= v;
      }
    }
    return this;
  }
  static mult(v1: Vector, v2: First): Vector {
    return v1.copy().mult(v2);
  }

  div(v: First): this {
    const { components } = this;
    if (v instanceof Vector) {
      v.components.forEach((x, i) => {
        if (!components[i]) components[i] = 0;
        else components[i] /= x;
      });
    } else if (Array.isArray(v)) {
      v.forEach((x, i) => {
        if (!components[i]) components[i] = 0;
        else components[i] /= x;
      });
    } else {
      for (let i = 0; i < components.length; i++) {
        components[i] /= v;
      }
    }
    return this;
  }
  static div(v1: Vector, v2: First): Vector {
    return v1.copy().div(v2);
  }

  mag(): number {
    return Math.sqrt(this.magSq());
  }
  setMag(n: number): this {
    return this.normalize().mult(n);
  }
  magSq(): number {
    return this.components.reduce((sum, x) => sum + x ** 2, 0);
  }

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

  dist(v: Vector): number {
    return Math.sqrt(this.distSq(v));
  }

  distSq(v: Vector): number {
    return Vector.sub(v, this).magSq();
  }

  dot(v: Vector): number {
    return this.components.reduce(
      (sum, x, i) => sum + x * (v.components[i] || 0),
      0
    );
  }
}

export function vec(v: number[] | Float64Array | Vector): Vector {
  return new Vector(v);
}
