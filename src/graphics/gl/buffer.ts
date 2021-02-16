export class Buffer {
  private buffer: WebGLBuffer;

  constructor(private gl: WebGL2RenderingContext, data: Float32Array) {
    // Create the buffer
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error('Error creating buffer');
    this.buffer = buffer;

    // Bind the data to the buffer
    this.bind();
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  }

  bind(): void {
    const { gl, buffer } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  }

  create(
    attribLocation: GLuint,
    size: GLint,
    type: GLenum,
    stride: GLsizei,
    offset: GLintptr
  ): void {
    this.gl.vertexAttribPointer(
      attribLocation,
      size,
      type,
      false,
      stride,
      offset
    );
  }
}
