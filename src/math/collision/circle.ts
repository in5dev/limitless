import { Vector2, vec2 } from '../vector';
import type Rect from './rect';

export default class Circle {
  position: Vector2;

  constructor(x: number, y: number, public radius: number) {
    this.position = vec2(x, y);
  }

  collides(other: Circle | Rect): boolean {
    const { position, radius } = this;
    if (other instanceof Circle)
      return position.distSq(other.position) <= (radius + other.radius) ** 2;

    const clampedPosition = Vector2.clamp(
      position,
      other.position,
      Vector2.add(other.position, other.size)
    );
    return this.position.distSq(clampedPosition) <= radius ** 2;
  }
}
