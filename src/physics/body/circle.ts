import type p5 from 'p5';

import Body from './body';
import AABB from './aabb';
import Vector2 from '../../math/vector/vec2';
import type ConvexPolygon from './convex-polygon';
import type { RenderOptions } from '../types';

export default class Circle extends Body {
  constructor(x: number, y: number, public radius: number, mass?: number) {
    super(x, y, mass);
  }

  get rotationalInertia(): number {
    return (this.mass * this.radius ** 2) / 2;
  }

  get aabb(): AABB {
    const { x, y, radius } = this;
    return new AABB(x - radius, y - radius, radius * 2);
  }

  collides(o: Circle | ConvexPolygon, resolve = false): boolean {
    const { position, radius } = this;
    if (o instanceof Circle) {
      const r = radius + o.radius;
      const colliding = position.distSq(o.position) < r ** 2;
      if (colliding) {
        const d = Vector2.sub(o.position, position);
        if (resolve)
          this.resolveCollision(o, {
            normal: Vector2.normalize(d),
            dist: r - d.mag()
          });
        return true;
      }
      return false;
    }
    return o.collides(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  project(_axis: Vector2): [min: number, max: number] {
    const { radius } = this;
    return [-radius, radius];
  }

  render(p: p5, options?: RenderOptions): void {
    const { x, y, radius } = this;
    p.push();
    p.translate(x, y);

    p.stroke(199, 48, 28);
    p.strokeWeight(2);
    p.fill(247, 68, 45);
    p.circle(0, 0, radius * 2);

    if (options?.position) {
      p.stroke(0);
      p.strokeWeight(4);
      p.point(0, 0);
    }
    if (options?.normals) {
      p.stroke(0, 0, 255);
      p.strokeWeight(2);
      p.line(0, 0, radius, 0);
    }

    p.pop();
  }
}
