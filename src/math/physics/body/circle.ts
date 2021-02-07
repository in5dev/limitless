import { Vector2 } from '../../vector';
import Body from './body';
import type Rect from './rect';

export default class Circle extends Body {
  constructor(x: number, y: number, public radius: number, mass?: number) {
    super(x, y, mass);
  }

  collides(o: Circle | Rect): boolean {
    const { position, radius } = this;
    if (o instanceof Circle) {
      const r = radius + o.radius;
      return this.position.distSq(position) <= r ** 2;
    }

    const clamped = Vector2.clamp(
      position,
      o.position,
      Vector2.add(o.position, o.size)
    );
    return position.distSq(clamped) <= radius;
  }
}
