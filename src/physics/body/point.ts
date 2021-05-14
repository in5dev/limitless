import type p5 from 'p5';
import AABB from './aabb';

import Body from './body';
import type Circle from './circle';

export default class Point extends Body {
  rotationalInertia = Infinity;

  constructor(x: number, y: number, mass?: number) {
    super(x, y, mass);
  }

  get aabb(): AABB {
    return new AABB(this.x, this.y, 0, 0);
  }

  collides(o: Point | Circle): boolean {
    if (o instanceof Point) return false;
    const { position } = this;
    return position.distSq(o.position) < o.radius;
  }

  render(p: p5): void {
    const { x, y } = this.position;
    p.noStroke();
    p.fill(0);
    p.circle(x, y, 4);
  }
}
