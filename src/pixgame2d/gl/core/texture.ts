export default class Texture {
  private texture: WebGLTexture;

  constructor(private gl: WebGL2RenderingContext, path: string) {
    // Create the texture
    const texture = gl.createTexture();
    if (!texture) throw new Error('Error creating texture');
    this.texture = texture;

    this.bind();

    // Blue image before load
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 255, 255])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    const image = new Image();
    image.src = path;
    image.addEventListener('load', () => {
      this.bind();
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );
      this.unbind();
    });

    this.unbind();
  }

  bind(): void {
    const { gl, texture } = this;
    gl.bindTexture(gl.TEXTURE_2D, texture);
  }

  setSamplerUniform(uniform: WebGLUniformLocation): void {
    this.gl.uniform1i(uniform, 0);
  }

  unbind(): void {
    const { gl } = this;
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}
