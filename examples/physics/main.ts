/* eslint-disable no-restricted-syntax */
/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';
import { vec2, Vector2 } from '../../src';
import Polygon from '../../src/math/physics/body/polygon';

new p5((p: p5) => {
  const bodies: Polygon[] = [];
  let b1: Polygon;
  let b2: Polygon;
  let b3: Polygon;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);

    b1 = new Polygon(
      -300,
      0,
      [vec2(-50, 50), vec2(100, 50), vec2(50, -50), vec2(-50, -50)],
      5
    );
    b2 = new Polygon(300, 0, [
      vec2(-10, 10),
      vec2(10, 10),
      vec2(10, -10),
      vec2(-10, -10)
    ]);
    b2.vx = -300;
    b3 = new Polygon(360, 0, [
      vec2(-10, 10),
      vec2(10, 10),
      vec2(10, -10),
      vec2(-10, -10)
    ]);
    b3.vx = -300;
    bodies.push(b1, b2, b3);
  };

  p.draw = () => {
    p.translate(p.width / 2, p.height / 2);

    const dt = p.deltaTime / 1000;
    renderBodies();

    // Update
    for (const body of bodies) {
      for (const other of bodies) {
        if (body !== other) body.collides(other);
      }
    }
    for (const body of bodies) {
      body.update(dt);
    }

    // Render
    p.stroke(0);
    p.fill(255);
    renderBodies();
  };

  function renderBodies(): void {
    p.background(69);
    p.stroke(0);
    p.fill(255);
    for (const body of bodies) {
      p.push();
      const { x, y } = body.position;
      p.translate(x, y);

      p.strokeWeight(1);
      poly(body.vertices);

      p.strokeWeight(4);
      p.point(0, 0);

      p.pop();
    }
  }

  function poly(vertices: Vector2[]): void {
    p.beginShape();
    for (const { x, y } of vertices) {
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
  }
});
