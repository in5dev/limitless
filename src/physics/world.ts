import type p5 from 'p5';

import type Body from './body';
import QuadTree from './quadtree';
import type { RenderOptions } from './types';

export default class World {
  bodies: Body[] = [];
  quadtree: QuadTree;
  collisions = 0;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    capacity?: number
  ) {
    this.quadtree = new QuadTree(x, y, width, height, capacity);
  }

  add(...bodies: Body[]): void {
    this.bodies.push(...bodies);
  }

  update(dt: number): this {
    const { bodies, quadtree } = this;
    this.collisions = 0;

    quadtree.reset();
    bodies.forEach(body => quadtree.add(body));
    bodies.forEach(body => {
      const others = quadtree.query(body.aabb);
      others.forEach(other => {
        if (body !== other) {
          if (body.collides(other)) this.collisions++;
        }
      });
    });
    bodies.forEach(body => body.update(dt));
    return this;
  }

  render(p: p5, options?: RenderOptions): this {
    const { bodies, quadtree } = this;
    const { x, y, width, height } = quadtree;

    if (options?.quadtree) quadtree.render(p);
    bodies.forEach(body => {
      const { aabb } = body;
      if (aabb.x < x) {
        body.x += x - aabb.x;
        body.vx *= -1;
      } else if (aabb.x + aabb.width > x + width) {
        body.x -= aabb.x + aabb.width - x - width;
        body.vx *= -1;
      }
      if (aabb.y < y) {
        body.y += y - aabb.y;
        body.vy *= -1;
      } else if (aabb.y + aabb.height > y + height) {
        body.y -= aabb.y + aabb.height - y - height;
        body.vy *= -1;
      }

      if (options?.aabb) aabb.render(p);
      body.render(p, options);
    });

    return this;
  }
}
