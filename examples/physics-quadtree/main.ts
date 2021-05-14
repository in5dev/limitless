/* eslint-disable no-restricted-syntax */
/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { Circle, random, Vector2, World } from '../../src';

new p5((p: p5) => {
  let world: World;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    world = new World(0, 0, p.width, p.height);

    const bodies: Circle[] = [];
    for (let i = 0; i < 100; i++) {
      const body = new Circle(
        random(p.width),
        random(p.height),
        random(10, 25)
      );
      body.velocity = Vector2.random(random(50));
      bodies.push(body);
    }

    world.add(...bodies);
  };

  p.draw = () => {
    p.background(69);

    const dt = p.deltaTime / 1000;
    world.update(dt).render(p, {
      position: true,
      vertices: true,
      normals: true,
      aabb: true,
      quadtree: true
    });
  };
});
