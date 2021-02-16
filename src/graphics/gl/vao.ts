export default class VertexArrayObject {
  vao: WebGLVertexArrayObject;

  constructor(private gl: WebGL2RenderingContext) {
    const vao = gl.createVertexArray();
    if (!vao) throw new Error('Error creating vertex array object');
    this.vao = vao;

    this.bind();
  }

  bind(): void {
    this.gl.bindVertexArray(this.vao);
  }

  add(
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
