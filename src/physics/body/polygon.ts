/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-restricted-syntax */
import type p5 from 'p5';

import { overlap } from '../../math/funcs';
import { Vector2 } from '../../math/vector';
import Body, { Collision } from './body';
import type Circle from './circle';
import type Rect from './rect';

export default class Polygon extends Body {
  rotationalInertia = 1;

  constructor(x: number, y: number, public vertices: Vector2[], mass?: number) {
    super(x, y, mass);
  }

  get normals(): Vector2[] {
    const { vertices } = this;
    return vertices.map((vertex, i) => {
      const next = vertices[i + 1] || vertices[0]!;
      const diff = Vector2.sub(next, vertex);
      return diff.perp().normalize();
    });
  }

  rotate(angle: number): this {
    this.vertices.forEach(v => v.rotate(angle));
    return super.rotate(angle);
  }

  collides(body: Polygon | Circle): boolean {
    return this.sat(body);
  }

  project(axis: Vector2): [min: number, max: number] {
    const { position, vertices } = this;
    const projections = vertices.map(v => Vector2.add(position, v).dot(axis));
    return projections.minmax();
  }

  private sat(body: Polygon | Circle | Rect): boolean {
    const normals = [...this.normals];
    if (body instanceof Polygon) normals.push(...body.normals);

    const overlaps: Collision[] = [];
    for (const n of normals) {
      const p1 = this.project(n);
      const p2 = body.project(n);
      const o = overlap(...p1, ...p2);

      if (o <= 0) return false;

      overlaps.push({
        normal: n,
        dist: o
      });
    }

    const dists = overlaps.map(o => o.dist);
    const minDistIndex = dists.indexOf(dists.min());
    const minOverlap = overlaps[minDistIndex]!;

    const { normal } = minOverlap;
    const diff = Vector2.sub(body.position, this.position);

    if (normal.dot(diff) < 0) normal.mult(-1);

    this.resolveCollision(body, minOverlap);

    return true;
  }

  render(p: p5): void {
    const { position, vertices } = this;
    const { x, y } = position;
    p.push();
    p.translate(x, p.height - y);
    p.stroke(46, 184, 22);
    p.strokeWeight(2);
    p.fill(61, 227, 32);
    p.beginShape();
    vertices.forEach(v => p.vertex(v.x, -v.y));
    p.endShape(p.CLOSE);
    p.stroke(0);
    p.strokeWeight(4);
    p.point(0, 0);
    p.pop();
  }
}
