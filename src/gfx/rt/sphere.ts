import Material from './material';
import type { Vector3 } from '../../math';

export default class Sphere {
  constructor(
    public position: Vector3,
    public radius: number,
    public color: Vector3,
    public material = Material.SOLID
  ) {}
}
