import { vec3, Vector3 } from '../../math';
import type Ray from './ray';

export enum ReflectionType {
  DIFFUSE,
  SPECULAR,
  REFRACTIVE
}

export default class Sphere {
  constructor(
    public position: Vector3,
    public radius: number,
    public color: Vector3,
    public reflectionType: ReflectionType,
    public emission = vec3()
  ) {}

  getNormal(position: Vector3): Vector3 {
    return Vector3.sub(position, this.position).normalize();
  }

  intersect(ray: Ray): number {
    const { position, radius } = this;
    const op = Vector3.sub(position, ray.origin);
    let t: number;
    let eps = 1e-4;
    let b = op.dot(ray.direction);
    let det = b * b - op.dot(op) + radius * radius;
    if (det < 0) return 0;
    det = Math.sqrt(det);
    return (t = b - det) > eps ? t : (t = b + det) > eps ? t : 0;
  }
}
