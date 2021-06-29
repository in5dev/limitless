/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { mat3 } from 'gl-matrix';

import { Program, Shader, Texture } from './core';
import Rect from './rect';
import type { Vector2 } from '../../math';

import vertexSource from './shader.vert';
import fragmentSource from './shader.frag';

export default class GL {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;

  program: Program;

  textures = new Map<string, Texture>();

  rect = this.Rect();

  time = 0;
  animateFn?: (time: number) => void;

  projectionMatrix = mat3.create();

  constructor() {
    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    canvas.textContent = 'Your browser does not support HTML5';
    document.body.appendChild(canvas);

    // Set up the WebGL rendering context
    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;

    gl.activeTexture(gl.TEXTURE0);

    this.program = new Program(gl, [
      new Shader(gl, 'vertex', vertexSource),
      new Shader(gl, 'fragment', fragmentSource)
    ]);

    this.setSize(400, 400);
  }

  /**
   * Resizes the canvas to a width and height
   * @param w the width
   * @param h the height
   */
  setSize(w: number, h: number): this {
    const { canvas, gl } = this;

    const dpr = window.devicePixelRatio || 1;
    const pixw = w * dpr;
    const pixh = h * dpr;

    // Set size in 3 ways
    // Attribute
    canvas.width = pixw;
    canvas.height = pixh;
    // Style
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    // GL
    gl.viewport(0, 0, pixw, pixh);

    const { clientWidth, clientHeight } = canvas;
    mat3.projection(this.projectionMatrix, clientWidth, clientHeight);
    const uniformLocation = this.getUniformLocation('projectionMatrix');
    gl.uniformMatrix3fv(uniformLocation, false, this.projectionMatrix);

    return this;
  }

  /**
   * Resizes the canvas to the full window
   */
  fullscreen(): this {
    const onresize = () => this.setSize(window.innerWidth, window.innerHeight);
    onresize();
    window.addEventListener('resize', onresize);
    return this;
  }

  /**
   * Fills the canvas with a background color
   * @param r red value
   * @param g green value
   * @param b blue value
   * @param a alpha value
   */
  background(r: number, g: number, b: number, a = 1): this {
    const { gl } = this;
    gl.clearColor(r, g, b, a);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    return this;
  }

  animate(fn?: (dt: number) => void): this {
    this.animateFn = fn;
    this.time = performance.now();
    requestAnimationFrame(this.loop.bind(this));
    return this;
  }

  private loop(): void {
    // Calculate change in time
    const nowTime = performance.now();
    const dt = (nowTime - this.time) / 2;
    this.time = nowTime;

    this.program.use();

    if (this.animateFn) this.animateFn(dt);
    requestAnimationFrame(this.loop.bind(this));
  }

  getAttributeLocation(name: string): GLint {
    return this.program.getAttributeLocation(name);
  }

  getUniformLocation(name: string): WebGLUniformLocation | null {
    return this.program.getUniformLocation(name);
  }

  setUniforms(uniforms: Record<string, number | Vector2>): void {
    this.program.setUniforms(uniforms);
  }

  Texture(path: string): Texture {
    const { textures } = this;
    let texture = textures.get(path);
    if (texture) return texture;

    texture = new Texture(this.gl, path);
    textures.set(path, texture);
    return texture;
  }

  Rect(): Rect {
    return new Rect(this.gl, this.program);
  }
}
