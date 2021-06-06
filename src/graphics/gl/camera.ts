import { mat4 } from 'gl-matrix';

export default class Camera {
  projectionMatrix = mat4.create();
  aspect: number;

  constructor(
    private gl: WebGL2RenderingContext,
    fov: number,
    near = 0.1,
    far = 100
  ) {
    const { clientWidth, clientHeight } = gl.canvas as HTMLCanvasElement;
    this.aspect = clientWidth / clientHeight;

    mat4.perspective(this.projectionMatrix, fov, this.aspect, near, far);
  }

  setProjectionUniform(uniformLocation: WebGLUniformLocation): void {
    this.gl.uniformMatrix4fv(uniformLocation, false, this.projectionMatrix);
  }
}
