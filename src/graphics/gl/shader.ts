export enum Type {
  Vertex,
  Fragment
}

export default class Shader {
  shader: WebGLShader;

  constructor(gl: WebGL2RenderingContext, type: Type, source: string) {
    // Create the vertex shader
    const shader = gl.createShader(
      type === Type.Vertex ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const name = Type[type]!;
    if (!shader) throw new Error(`Error creating ${name.toLowerCase()} shader`);
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
