import type p5 from 'p5';
import { Vector2 } from '../../math/vector';
import Body from './body';
import Polygon from './polygon';
import type Rect from './rect';

export default class Circle extends Body {
  constructor(x: number, y: number, public radius: number, mass?: number) {
    super(x, y, mass);
  }

  get rotationalInertia(): number {
    return (this.mass * this.radius ** 2) / 2;
  }

  collides(o: Circle | Rect | Polygon): boolean {
    const { position, radius } = this;
    if (o instanceof Circle) {
      const r = radius + o.radius;
      return this.position.distSq(position) < r ** 2;
    }
    if (o instanceof Polygon) return o.collides(this);

    const clamped = Vector2.clamp(
      position,
      o.position,
      Vector2.add(o.position, o.size)
    );
    return position.distSq(clamped) < radius;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  project(_axis: Vector2): [min: number, max: number] {
    const { radius } = this;
    return [-radius, radius];
  }

  render(p: p5): void {
    const { position, radius } = this;
    const { x, y } = position;
    p.push();
    p.translate(x, p.height - y);
    p.stroke(199, 48, 28);
    p.strokeWeight(2);
    p.fill(247, 68, 45);
    p.circle(0, 0, radius * 2);
    p.stroke(0);
    p.strokeWeight(4);
    p.point(0, 0);
    p.pop();
  }
}
