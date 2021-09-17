export default class Texture {
  texture: WebGLTexture;

  constructor(
    image: TexImageSource,
    private gl: WebGLRenderingContext,
    param?: GLenum
  ) {
    {
      // Create the texture
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const texture = gl.createTexture()!;
      // Bind and config the texture
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_S,
        param || gl.CLAMP_TO_EDGE
      );
      gl.texParameteri(
        gl.TEXTURE_2D,
        gl.TEXTURE_WRAP_T,
        param || gl.CLAMP_TO_EDGE
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        image
      );

      this.texture = texture;
    }
  }

  activate(unit = 0): void {
    const { gl, texture } = this;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.activeTexture(gl.TEXTURE0 + unit);
  }

  remove(): void {
    this.gl.deleteTexture(this.texture);
  }
}
