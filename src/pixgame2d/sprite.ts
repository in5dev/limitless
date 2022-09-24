import { mat3 } from 'gl-matrix';

import { vec2 } from '../math/index.js';
import type { Rect, Texture } from './gl/index.js';

export default class Sprite {
  position = vec2();
  size = vec2(1);
  rotation = 0;

  modelViewMatrix = mat3.create();

  constructor(private rect: Rect, private texture: Texture) {}

  private calcModelView(): void {
    const { position, size, rotation, modelViewMatrix } = this;
    mat3.identity(modelViewMatrix);
    mat3.translate(modelViewMatrix, modelViewMatrix, position.toArray());
    mat3.scale(modelViewMatrix, modelViewMatrix, size.toArray());
    mat3.rotate(this.modelViewMatrix, modelViewMatrix, rotation);
  }

  render(
    gl: WebGL2RenderingContext,
    modelViewUniform: WebGLUniformLocation,
    samplerUniform: WebGLUniformLocation
  ): void {
    this.calcModelView();
    gl.uniformMatrix3fv(modelViewUniform, false, this.modelViewMatrix);
    this.texture.bind();
    this.texture.setSamplerUniform(samplerUniform);
    this.rect.render();
  }
}
