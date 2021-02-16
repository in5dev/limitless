export enum Type {
  Vertex,
  Fragment
}

export default class Shader {
  private shader: WebGLShader;

  constructor(private gl: WebGL2RenderingContext, type: Type, source: string) {
    // Create the vertex shader
    const shader = gl.createShader(
      type === Type.Vertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER
    );
    const name = Type[type];
    if (!shader) throw new Error(`Error creating ${name.toLowerCase()} shader`);

    // Bind the source
    gl.shaderSource(shader, source);

    // Check for shader errors
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
      throw new Error(
        `Error compiling vertex shader: ${gl.getShaderInfoLog(shader)}`
      );

    this.shader = shader;
  }
}
