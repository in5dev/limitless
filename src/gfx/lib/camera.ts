import { mat4 } from 'gl-matrix';
import { vec3 } from '../../math';

export default class Camera {
  position = vec3();

  projectionMatrix = mat4.create();
  aspect: number;

  constructor(
    private gl: WebGL2RenderingContext,
    public fov: number,
    public near = 0.1,
    public far = 1000
  ) {
    const { clientWidth, clientHeight } = gl.canvas as HTMLCanvasElement;
    this.aspect = clientWidth / clientHeight;
  }

  setProjectionUniform(uniformLocation: WebGLUniformLocation): void {
    const { position, projectionMatrix, fov, aspect, near, far } = this;
    mat4.perspective(projectionMatrix, fov, aspect, near, far);
    mat4.translate(projectionMatrix, projectionMatrix, position.toArray());
    this.gl.uniformMatrix4fv(uniformLocation, false, projectionMatrix);
  }
}
