export default class Shader {
  shader: WebGLShader;

  constructor(
    gl: WebGL2RenderingContext,
    type: 'vertex' | 'fragment',
    source: string
  ) {
    // Create the vertex shader
    const shader = gl.createShader(
      type === 'vertex' ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (!shader) throw new Error(`Error creating ${type} shader`);
    this.shader = shader;

    // Bind the source
    gl.shaderSource(shader, source);

    // Check for shader errors
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(
        `Error compiling vertex shader: ${gl.getShaderInfoLog(shader)}`
      );
  }
}
