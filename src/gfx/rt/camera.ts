import type { Vector3 } from '../../math/index.js';

export default class Camera {
  constructor(
    public origin: Vector3,
    public direction: Vector3,
    public fov: number
  ) {}
}
