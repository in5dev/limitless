/* eslint-disable @typescript-eslint/no-non-null-assertion */
import GL from './gl/index.js';
import Sprite from './sprite.js';

export default class Game {
  gl = new GL();
  sprites: Sprite[] = [];

  time = 0;
  animateFn?: (time: number) => void;

  fullscreen(): this {
    this.gl.fullscreen();
    return this;
  }

  background(r: number, g: number, b: number, a?: number): this {
    this.gl.background(r, g, b, a);
    return this;
  }

  Sprite(path: string): Sprite {
    const texture = this.gl.Texture(path);
    const sprite = new Sprite(this.gl.rect, texture);
    this.sprites.push(sprite);
    return sprite;
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

    this.gl.program.use();
    if (this.animateFn) this.animateFn(dt);
    this.render();

    requestAnimationFrame(this.loop.bind(this));
  }

  render(): void {
    const modelViewUniform = this.gl.getUniformLocation('modelViewMatrix')!;
    const samplerUniform = this.gl.getUniformLocation('sprite')!;
    this.sprites.forEach(sprite =>
      sprite.render(this.gl.gl, modelViewUniform, samplerUniform)
    );
  }
}
