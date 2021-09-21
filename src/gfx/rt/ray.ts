import { Vector3 } from '../../math';

export default class Ray {
  direction: Vector3;

  constructor(public origin: Vector3, direction: Vector3) {
    this.direction = Vector3.normalize(direction);
  }

  at(t: number): Vector3 {
    return Vector3.add(this.origin, Vector3.mult(this.direction, t));
  }

  reflect(normal: Vector3): Ray {
    this.direction.reflect(normal);
    return this;
  }

  refract(normal: Vector3, eta: number): Ray {
    this.direction.refract(normal, eta);
    return this;
  }
}
