import type { Vector3 } from '../../../math';

export default class DirectionalLight {
  constructor(private gl: WebGL2RenderingContext, public direction: Vector3) {}

  setDirectionUniform(uniformLocation: WebGLUniformLocation): void {
    this.gl.uniform3fv(uniformLocation, this.direction.toArray());
  }
}
