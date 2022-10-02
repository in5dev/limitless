import Body, { AABB } from '../body/mod.ts';

export default class Naive extends AABB {
  bodies: Body[] = [];

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
  }

  add(body: Body): boolean {
    if (!this.intersects(body.aabb)) return false;
    this.bodies.push(body);
    return true;
  }

  query(bounds: AABB, found = new Set<Body>()): Set<Body> {
    if (bounds.intersects(this)) this.bodies.forEach(body => found.add(body));
    return found;
  }

  reset(): void {
    this.bodies = [];
  }
}
