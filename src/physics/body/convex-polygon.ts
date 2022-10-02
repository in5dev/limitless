import Body from './body.ts';
import { minmax, overlap } from '../../math/funcs.ts';
import Vector2 from '../../math/vector/vec2.ts';
import { average, min } from '../../util/array.ts';
import AABB from './aabb.ts';
import type { Collision } from './body.ts';
import type Circle from './circle.ts';

export default class ConvexPolygon extends Body {
  constructor(x: number, y: number, public vertices: Vector2[], mass?: number) {
    super(x, y, mass);
  }

  get rotationalInertia(): number {
    const r = average(this.vertices.map(v => v.mag()));
    return (this.mass * r ** 2) / 2;
  }

  get aabb(): AABB {
    const { x, y, vertices } = this;

    const xs = vertices.map(v => v.x);
    const ys = vertices.map(v => v.y);

    const [minx, maxx] = minmax(...xs);
    const [miny, maxy] = minmax(...ys);

    return new AABB(x + minx, y + miny, maxx - minx, maxy - miny);
  }

  get normals(): Vector2[] {
    const { vertices } = this;
    return vertices.map((vertex, i) => {
      const next = vertices[i + 1] || vertices[0]!;
      const diff = Vector2.sub(next, vertex);
      return diff.perp().normalize();
    });
  }

  override rotate(angle: number): this {
    this.vertices.forEach(v => v.rotate(angle));
    return super.rotate(angle);
  }

  project(axis: Vector2): [min: number, max: number] {
    const { position, vertices } = this;
    const projections = vertices.map(v => Vector2.add(position, v).dot(axis));
    return minmax(...projections);
  }

  collides(body: ConvexPolygon | Circle, resolve = false): boolean {
    const normals = [...this.normals];
    if (body instanceof ConvexPolygon) normals.push(...body.normals);

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
    const minDistIndex = dists.indexOf(min(dists));
    const minOverlap = overlaps[minDistIndex]!;

    const { normal } = minOverlap;
    const diff = Vector2.sub(body.position, this.position);

    if (normal.dot(diff) < 0) normal.mult(-1);

    if (resolve) this.resolveCollision(body, minOverlap);

    return true;
  }
}
