import Ray from './ray';
import { vec3, Vector3 } from '../../math';

export default class Camera extends Ray {
  constructor(origin: Vector3, direction: Vector3, public fov: number) {
    super(origin, direction);
  }

  getRays(
    x: number,
    y: number,
    width: number,
    height: number,
    samples: number
  ): Ray[] {
    const { origin, direction, fov } = this;
    const rays: Ray[] = [];
    for (let i = 0; i < samples; i++) {
      const cx = vec3((width * fov) / height, 0, 0);
      const cy = Vector3.mult(cx.cross(direction).normalize(), fov);

      const u1 = 2 * Math.random();
      const u2 = 2 * Math.random();
      const dx = u1 < 1 ? Math.sqrt(u1) - 1 : 1 - Math.sqrt(2 - u1);
      const dy = u2 < 1 ? Math.sqrt(u2) - 1 : 1 - Math.sqrt(2 - u2);
      const d = Vector3.add(
        Vector3.add(
          Vector3.mult(cx, ((0.5 + dx) / 2.0 + x) / width - 0.5),
          Vector3.mult(cy, ((0.5 + dy) / 2.0 + y) / height - 0.5)
        ),
        direction
      );
      const ray = new Ray(
        Vector3.add(origin, Vector3.mult(d, 130)),
        d.normalize()
      );
      rays.push(ray);
    }
    return rays;
  }
}
