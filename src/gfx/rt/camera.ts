import type { Vector3 } from '../../math';

export default class Camera {
  constructor(
    public origin: Vector3,
    public direction: Vector3,
    public fov: number
  ) {}
}
