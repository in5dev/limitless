import { mat4 } from 'gl-matrix';

import { vec3 } from '../../math/index.js';
import type Geometry from './geometries/geometry.js';

export default class Model {
  position = vec3();
  scale = vec3(1);
  rotation = vec3();

  modelViewMatrix = mat4.create();

  constructor(private gl: WebGL2RenderingContext, private geometry: Geometry) {}

  setModelViewUniform(uniformLocation: WebGLUniformLocation): void {
    const { gl, position, scale, rotation, modelViewMatrix } = this;
    mat4.identity(modelViewMatrix);
    mat4.translate(modelViewMatrix, modelViewMatrix, position.toArray());
    mat4.scale(modelViewMatrix, modelViewMatrix, scale.toArray());
    mat4.rotateX(this.modelViewMatrix, modelViewMatrix, rotation.x);
    mat4.rotateY(this.modelViewMatrix, modelViewMatrix, rotation.y);
    mat4.rotateZ(this.modelViewMatrix, modelViewMatrix, rotation.z);
    gl.uniformMatrix4fv(uniformLocation, false, modelViewMatrix);
  }

  render(): void {
    this.geometry.render();
  }
}
