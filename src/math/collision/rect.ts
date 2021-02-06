import { Vector2, vec2 } from '../vector';
import type Circle from './circle';

export default class Rect {
  position: Vector2;
  size: Vector2;

  constructor(x: number, y: number, width: number, height: number) {
    this.position = vec2(x, y);
    this.size = vec2(width, height);
  }

  collides(other: Rect | Circle): boolean {
    const { x, y } = this.position;
    if (other instanceof Rect)
      return !(
        x + this.size.x < other.position.x ||
        x > other.position.x + other.size.x ||
        y + this.size.y < other.position.y ||
        y > other.position.y + other.size.y
      );

    return other.collides(this);
  }
}
