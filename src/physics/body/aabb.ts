/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type p5 from 'p5';

import AABody from './aabody';
import { vec2, Vector2 } from '../../math/vector';
import type Circle from './circle';
import type ConvexPolygon from './convex-polygon';
import type { RenderOptions } from '../types';

export default class AABB extends AABody {
  size: Vector2;
  vertices: Vector2[];
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
    this.vertices = [
      vec2(-width / 2, +height / 2),
      vec2(-width / 2, -height / 2),
      vec2(+width / 2, -height / 2),
      vec2(+width / 2, +height / 2)
    ];
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

  project(axis: Vector2): [min: number, max: number] {
    const { position, vertices } = this;
    const projections = vertices.map(v => Vector2.add(position, v).dot(axis));
    return projections.minmax();
  }

  collides(o: AABB | Circle | ConvexPolygon): boolean {
    if (o instanceof AABB) {
      const { x, y, width, height } = this;
      const { x: ox, y: oy, width: owidth, height: oheight } = o;
      if (x + width / 2 <= ox - owidth / 2 || x - width / 2 >= ox + owidth / 2)
        return false;
      if (
        y + height / 2 <= oy - oheight / 2 ||
        y - height / 2 >= oy + oheight / 2
      )
        return false;
      return true;
    }
    return o.collides(this);
  }

  render(p: p5, options?: RenderOptions): void {
    const { x, y, width, height } = this;
    p.push();
    p.translate(x, y);

    p.stroke(208, 93, 240);
    p.strokeWeight(2);
    p.fill(227, 125, 255);
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
