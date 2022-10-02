import AABB from './aabb.ts';
import Body from './body.ts';
import type Circle from './circle.ts';

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
}
