import { vec2, Vector2 } from '../../vector';

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

  /**
   * Changes the body's acceleration
   * @param force a vector
   */
  applyForce(force: Vector2): this {
    this.acceleration.add(Vector2.div(force, this.mass));
    return this;
  }

  /**
   * Calculates the new state of the body
   * @param dt change in time (s)
   */
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

  // Position
  get x(): number {
    return this.position.x;
  }
  set x(x: number) {
    this.position.x = x;
  }
  get y(): number {
    return this.position.x;
  }
  set y(y: number) {
    this.position.x = y;
  }

  // Velocity
  get vx(): number {
    return this.velocity.x;
  }
  set vx(x: number) {
    this.velocity.x = x;
  }
  get vy(): number {
    return this.velocity.x;
  }
  set vy(y: number) {
    this.velocity.x = y;
  }

  // Acceleration
  get ax(): number {
    return this.acceleration.x;
  }
  set ax(x: number) {
    this.acceleration.x = x;
  }
  get ay(): number {
    return this.acceleration.x;
  }
  set ay(y: number) {
    this.acceleration.x = y;
  }
}
