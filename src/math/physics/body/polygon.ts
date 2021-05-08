/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-restricted-syntax */
import { overlap } from '../../funcs';
import { Vector2 } from '../../vector';
import Body, { Collision } from './body';
import type Circle from './circle';

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

  private sat(body: Polygon | Circle): boolean {
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
}
