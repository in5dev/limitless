import type p5 from 'p5';

import type Body from './body';

export default class World {
  bodies: Body[] = [];

  update(dt: number): this {
    const { bodies } = this;
    bodies.forEach(body =>
      bodies.forEach(other => {
        if (body !== other) body.collides(other);
      })
    );
    bodies.forEach(body => body.update(dt));
    return this;
  }

  render(p: p5): this {
    this.bodies.forEach(body => body.render(p));
    return this;
  }
}
