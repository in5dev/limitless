/* eslint-disable max-classes-per-file */
export class VertexBuffer {
  private buffer: WebGLBuffer;
  readonly size: number;

  constructor(private gl: WebGL2RenderingContext, data: readonly number[][]) {
    // Create the buffer
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error('Error creating vertex buffer');
    this.buffer = buffer;

    this.size = data[0]?.length || 0;

    // Bind the data to the buffer
    this.bind();
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(data.flat() as unknown as number[]),
      gl.STATIC_DRAW
    );
  }

  bind(): void {
    const { gl, buffer } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  }

  enable(attribLocation: GLuint): void {
    const { gl, size } = this;
    gl.enableVertexAttribArray(attribLocation);
    gl.vertexAttribPointer(attribLocation, size, gl.FLOAT, false, 0, 0);
  }

  unbind(): void {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}

export class IndexBuffer {
  private buffer: WebGLBuffer;
  readonly count: number;

  constructor(private gl: WebGL2RenderingContext, data: readonly number[]) {
    // Create the buffer
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error('Error index creating index buffer');
    this.buffer = buffer;

    this.count = data.length;

    // Bind the data to the buffer
    this.bind();
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(data),
      gl.STATIC_DRAW
    );
  }

  bind(): void {
    const { gl, buffer } = this;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
  }

  unbind(): void {
    const { gl } = this;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
}
