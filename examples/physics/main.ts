/* eslint-disable no-restricted-syntax */
/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { vec2, Vector2, World } from '../../src';
import Polygon from '../../src/physics/body/polygon';

new p5((p: p5) => {
  const world = new World();
  let spinner: Polygon;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    const b1 = new Polygon(
      0,
      p.height / 2,
      [vec2(-50, 50), vec2(100, 50), vec2(50, -50), vec2(-50, -50)],
      5
    );
    const b2 = new Polygon(300, p.height / 2, [
      vec2(-10, 10),
      vec2(10, 10),
      vec2(10, -10),
      vec2(-10, -10)
    ]);
    b2.vx = -300;
    const b3 = new Polygon(360, p.height / 2, [
      vec2(-10, 10),
      vec2(10, 10),
      vec2(10, -10),
      vec2(-10, -10)
    ]);
    b3.vx = -300;
    spinner = new Polygon(p.width / 2, p.height - 100, [
      vec2(-20, 20),
      vec2(20, 20),
      vec2(20, -20),
      vec2(-20, -20)
    ]);
    world.bodies.push(b1, b2, b3, spinner);
  };

  p.draw = () => {
    p.background(69);

    spinner.torque(
      vec2(0, 1).setMag(Math.cos((performance.now() / 1000) * Math.PI)),
      Vector2.add(spinner.position, 10, 0)
    );

    const dt = p.deltaTime / 1000;
    world.update(dt);
    world.render(p);
  };
});
