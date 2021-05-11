import type p5 from 'p5';

import AABody from './aabody';
import AABB from './aabb';
import Vector2 from '../../math/vector/vec2';
import type Circle from './circle';

export default class Point extends AABody {
  constructor(x: number, y: number, mass?: number) {
    super(x, y, mass);
  }

  collides(o: Point | AABB | Circle): boolean {
    if (o instanceof Point) return false;
    const { position } = this;
    if (o instanceof AABB) {
      const min = Vector2.sub(o.position, Vector2.div(o.size, 2));
      const max = Vector2.add(min, o.size);
      const clampped = Vector2.clamp(position, min, max);
      return position.equals(clampped);
    }
    return position.distSq(o.position) < o.radius;
  }

  render(p: p5): void {
    const { x, y } = this.position;
    p.noStroke();
    p.fill(0);
    p.circle(x, y, 4);
  }
}
