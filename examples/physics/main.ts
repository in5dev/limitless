/* eslint-disable no-restricted-syntax */
/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { ConvexPolygon, Rect, vec2, Vector2, World } from '../../src';

new p5((p: p5) => {
  let world: World;
  let spinner: ConvexPolygon;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    world = new World(0, 0, p.width, p.height, 1);

    const b1 = new ConvexPolygon(
      50,
      p.height / 2,
      [vec2(-50, -50), vec2(50, -50), vec2(100, 50), vec2(-50, 50)],
      5
    );
    const b2 = new Rect(300, p.height / 2, 20);
    b2.vx = -300;
    const b3 = new Rect(360, p.height / 2, 25);
    b3.vx = -300;
    spinner = new Rect(p.width / 2, 160, 40, 80);

    world.add(b1, b2, b3, spinner);
  };

  p.draw = () => {
    p.background(69);

    spinner.torque(vec2(0, 0), Vector2.add(spinner.position, 0, -40));

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
