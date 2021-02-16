export class Buffer {
  private buffer: WebGLBuffer;

  constructor(private gl: WebGL2RenderingContext, data: Float32Array) {
    // Create the buffer
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error('Error creating buffer');

    // Bind the data to the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    this.buffer = buffer;
  }
}
