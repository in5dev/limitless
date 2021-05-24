/* eslint-disable no-restricted-syntax */
/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { Circle, random, Vector2, World } from '../../src';

new p5((p: p5) => {
  let world: World;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    const params = p.getURLParams() as Record<string, string>;
    world = new World(0, 0, p.width, p.height, params.struct as any);

    const bodies: Circle[] = [];
    for (let i = 0; i < 1000; i++) {
      const body = new Circle(random(p.width), random(p.height), random(5, 15));
      body.velocity = Vector2.random(random(50));
      bodies.push(body);
    }

    world.add(...bodies);
  };

  p.draw = () => {
    p.background(69);

    const dt = p.deltaTime / 1000;
    world.update(dt).render(p);
  };
});
