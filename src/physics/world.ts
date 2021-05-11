import type p5 from 'p5';

import type { AABody } from './body';
import type { RenderOptions } from './types';

export default class World {
  bodies: AABody[] = [];
  collisions = 0;

  update(dt: number): this {
    const { bodies } = this;
    this.collisions = 0;
    bodies.forEach(body =>
      bodies.forEach(other => {
        if (body !== other) {
          if (body.collides(other)) this.collisions++;
        }
      })
    );
    bodies.forEach(body => body.update(dt));
    return this;
  }

  render(p: p5, options?: RenderOptions): this {
    p.push();
    p.translate(0, p.height);
    p.scale(1, -1);
    this.bodies.forEach(body => body.render(p, options));
    p.pop();
    return this;
  }
}
