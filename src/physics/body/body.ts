import AABody from './aabody';
import { Vector2 } from '../../math/vector';

export interface Collision {
  normal: Vector2;
  dist: number;
}

export interface DynamicCollision {
  body: Body;
  normal: Vector2;
}

export default abstract class Body extends AABody {
  angle = 0;
  angularVelocity = 0;
  angularAcceleration = 0;

  abstract rotationalInertia: number;

  /**
   * Changes the body's angular acceleration
   * @param force a vector
   * @param location where the force was applied
   */
  torque(force: Vector2, location: Vector2): this {
    const r = Vector2.sub(location, this.position);
    const angle = force.angle() - r.angle();
    const torque = force.mag() * r.mag() * Math.sin(angle);
    this.angularAcceleration += torque / this.rotationalInertia;
    return this;
  }

  /**
   * Rotates the body by a given angle
   * @param angle the angle (rad)
   */
  rotate(angle: number): this {
    this.angle += angle;
    return this;
  }

  update(dt: number): this {
    this.angularVelocity += this.angularAcceleration * dt;
    this.rotate(this.angularVelocity * dt);
    this.angularAcceleration = 0;

    return super.update(dt);
  }

  // Angular position
  get θ(): number {
    return this.angle;
  }
  set θ(angle: number) {
    this.angle = angle;
  }

  // Angular velocity
  get ω(): number {
    return this.angularVelocity;
  }
  set ω(angularVelocity: number) {
    this.angularVelocity = angularVelocity;
  }

  // Angular acceleration
  get α(): number {
    return this.angularVelocity;
  }
  set α(angularVelocity: number) {
    this.angularVelocity = angularVelocity;
  }
}
