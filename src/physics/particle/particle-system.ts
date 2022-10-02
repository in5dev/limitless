import { unorderedRemove } from '../../util/array.ts';
import type { Vector2 } from '../../math/vector/mod.ts';
import type Particle from './particle.ts';

export default class ParticleSystem<T extends Particle = Particle> {
  constructor(public particles: T[] = []) {}

  set velocity(v: Vector2) {
    this.particles.forEach(p => p.velocity.add(v));
  }

  add(p: T | ParticleSystem<T>): void {
    if (p instanceof ParticleSystem)
      p.particles.forEach(particle => this.add(particle));
    else this.particles.push(p);
  }

  forEach(cb: (value: T, index: number, array: T[]) => void): void {
    this.particles.forEach(cb);
  }

  update(dt: number): void {
    const { particles } = this;
    for (let i = 0; i < particles.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const p = particles[i]!;
      p.update(dt);
      if (p.life <= 0) unorderedRemove(particles, i--);
    }
  }
}
