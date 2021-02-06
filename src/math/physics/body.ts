import { vec2, Vector2 } from '../vector';

export default class Body {
  position: Vector2;
  velocity = vec2();
  acceleration = vec2();

  angle = 0;
  angularVelocity = 0;
  angularAcceleration = 0;

  constructor(x: number, y: number, public mass = 1) {
    this.position = vec2(x, y);
  }

  applyForce(force: Vector2): this {
    this.acceleration.add(Vector2.div(force, this.mass));
    return this;
  }

  update(dt: number): this {
    const { position, velocity, acceleration } = this;
    velocity.add(Vector2.mult(acceleration, dt));
    position.add(Vector2.mult(velocity, dt));
    acceleration.mult(0);

    this.angularVelocity += this.angularAcceleration * dt;
    this.angle += this.angularVelocity * dt;
    this.angularAcceleration = 0;

    return this;
  }
}
