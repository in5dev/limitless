import type p5 from 'p5';

import { vec2, Vector2 } from '../../math/vector';
import type { RenderOptions } from '../types';
import ConvexPolygon from './convex-polygon';

export default class Rect extends ConvexPolygon {
  size: Vector2;

  constructor(
    x: number,
    y: number,
    width: number,
    height = width,
    mass?: number
  ) {
    const vertices = [
      vec2(-width / 2, +height / 2),
      vec2(-width / 2, -height / 2),
      vec2(+width / 2, -height / 2),
      vec2(+width / 2, +height / 2)
    ];
    super(x, y, vertices, mass);
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

  get normals(): Vector2[] {
    return [vec2(1, 0), vec2(0, 1)].map(v => v.setAngle(this.angle));
  }

  render(p: p5, options?: RenderOptions): void {
    const { x, y, width, height, angle } = this;
    p.push();
    p.translate(x, y);
    p.rotate(angle);

    p.stroke(61, 69, 224);
    p.strokeWeight(2);
    p.fill(81, 89, 232);
    p.rectMode(p.CENTER);
    p.rect(0, 0, width, height);

    p.stroke(0);
    p.strokeWeight(4);
    if (options?.position) p.point(0, 0);
    if (options?.vertices) {
      p.point(-width / 2, -height / 2);
      p.point(+width / 2, -height / 2);
      p.point(-width / 2, +height / 2);
      p.point(+width / 2, +height / 2);
    }
    if (options?.normals) {
      p.stroke(0, 0, 255);
      p.strokeWeight(2);
      p.line(width / 2, 0, width / 2 + 20, 0);
      p.line(0, height / 2, 0, height / 2 + 20);
    }

    p.pop();
  }
}
