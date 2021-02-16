import { Vector2 } from '../../math';
import type Shader from './shader';

export default class Program {
  program: WebGLProgram;

  attributeLocations = new Map<string, GLint>();
  uniformLocations = new Map<string, WebGLUniformLocation>();

  constructor(private gl: WebGL2RenderingContext, shaders: Shader[]) {
    // Create the program
    const program = gl.createProgram();
    if (!program) throw new Error('Error creating program');

    // Bind the shaders
    shaders.forEach(shader => gl.attachShader(program, shader));

    // Check for program errors
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(
        `Error linking program: ${gl.getProgramInfoLog(program)}`
      );

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
      throw new Error(
        `Error validating program: ${gl.getProgramInfoLog(program)}`
      );

    gl.useProgram(program);
    this.program = program;
  }

  /**
   * Gets the location of a attribute
   * @param name the name of the attribute
   */
  getAttributeLocation(name: string): GLint {
    // Attribute location is already cached
    let attributeLocation = this.attributeLocations.get(name);
    if (attributeLocation) return attributeLocation;

    // Need to find the attribute location
    attributeLocation = this.gl.getAttribLocation(this.program, name);
    if (attributeLocation !== -1)
      this.attributeLocations.set(name, attributeLocation);
    return attributeLocation;
  }

  /**
   * Gets the location of a uniform
   * @param name the name of the uniform
   */
  getUniformLocation(name: string): WebGLUniformLocation | null {
    // Uniform location is already cached
    const cachedUniformLocation = this.uniformLocations.get(name);
    if (cachedUniformLocation) return cachedUniformLocation;

    // Need to find the uniform location
    const uniformLocation = this.gl.getUniformLocation(this.program, name);
    if (uniformLocation) this.uniformLocations.set(name, uniformLocation);
    return uniformLocation;
  }

  setUniforms(uniforms: Record<string, number | Vector2>): void {
    const { gl } = this;
    Object.entries(uniforms).forEach(([name, value]) => {
      const uniformLocation = this.getUniformLocation(name);
      if (typeof value === 'number') gl.uniform1f(uniformLocation, value);
      if (value instanceof Vector2)
        gl.uniform2f(uniformLocation, ...value.toArray());
    });
  }
}
