import { QuadTree, SpatialHashGrid, Naive } from './structures/mod.ts';
import type Body from './body/mod.ts';

export default class World {
  bodies: Body[] = [];
  structure: QuadTree | SpatialHashGrid | Naive;
  doCollisions: boolean;
  collisions = 0;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    structure: 'quadtree' | 'hashgrid' | 'naive' = 'quadtree',
    options: {
      capacity?: number;
      divisionSize?: number;
      doCollisions?: boolean;
    } = {}
  ) {
    this.doCollisions = options?.doCollisions ?? true;
    switch (structure) {
      case 'quadtree':
        this.structure = new QuadTree(x, y, width, height, options?.capacity);
        break;
      case 'hashgrid':
        this.structure = new SpatialHashGrid(
          x,
          y,
          width,
          height,
          options?.divisionSize
        );
        break;
      default:
        this.structure = new Naive(x, y, width, height);
    }
  }

  add(...bodies: Body[]): void {
    this.bodies.push(...bodies);
  }

  update(dt: number): this {
    const { bodies, structure } = this;
    this.collisions = 0;

    if (this.doCollisions) {
      structure.reset();
      bodies.forEach(body => structure.add(body));
      bodies.forEach(body => {
        const others = structure.query(body.aabb);
        others.forEach(other => {
          if (body !== other) {
            if (body.collides(other)) this.collisions++;
          }
        });
      });
    }

    const { x, y, width, height } = structure;
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

      body.update(dt);
    });
    return this;
  }
}
