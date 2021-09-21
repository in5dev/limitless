import { vec3, Vector3 } from '../../math';
import type Ray from './ray';
import type Sphere from './sphere';

export default class Scene {
  spheres: Sphere[] = [];

  add(...spheres: Sphere[]): void {
    this.spheres.push(...spheres);
  }

  intersect(ray: Ray): {
    t: number;
    sphere: Sphere;
    normal: Vector3;
  } {
    const { spheres } = this;
    let closest = {
      t: Infinity,
      sphere: spheres[0]!,
      normal: vec3()
    };
    for (let sphere of spheres) {
      const d = sphere.intersect(ray);
      if (d && d < closest.t) {
        closest.t = d;
        closest.sphere = sphere;
      }
    }
    closest.normal = closest.sphere.getNormal(ray.at(closest.t));
    return closest;
  }
}
