import { vec2, Vector2 } from '../../vector';
import Body from './body';
import type Circle from './circle';

export default class Rect extends Body {
  size: Vector2;
  readonly normals = [vec2(1, 0), vec2(0, 1)];

  constructor(
    x: number,
    y: number,
    width: number,
    height = width,
    mass?: number
  ) {
    super(x, y, mass);
    this.size = vec2(width, height);
  }

  get width(): number {
    return this.size.x;
  }
  set width(width: number) {
    this.size.x = width;
  }
  get height(): number {
    return this.size.y;
  }
  set height(height: number) {
    this.size.y = height;
  }

  get rotationalInertia(): number {
    return (this.mass * this.size.magSq()) / 12;
  }

  get vertices(): Vector2[] {
    const { position, width, height, angle } = this;
    return [
      vec2(-width / 2, -height / 2),
      vec2(+width / 2, -height / 2),
      vec2(-width / 2, +height / 2),
      vec2(+width / 2, +height / 2)
    ].map(v => v.rotateAbout(angle, position));
  }

  project(axis: Vector2): [min: number, max: number] {
    const { position, vertices } = this;
    const projections = vertices.map(v => Vector2.add(position, v).dot(axis));
    return projections.minmax();
  }

  collides(o: Rect | Circle): boolean {
    if (o instanceof Rect) {
      const {
        position: { x, y },
        size: { x: width, y: height }
      } = this;
      const {
        position: { x: ox, y: oy },
        size: { x: owidth, y: oheight }
      } = o;
      if (x + width <= ox || x >= ox + owidth) return false;
      if (y + height <= oy || y >= oy + oheight) return false;
      return true;
    }
    return o.collides(this);
  }
}
