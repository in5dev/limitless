/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { ReadonlyMat2, ReadonlyMat3, ReadonlyMat4 } from 'gl-matrix';

import Shader from './shader';
import Texture from './texture';
import screenSource from './screen.vert?raw';

interface GLBuffer {
  buffer: WebGLBuffer;
  data: number[][][];
  flatData: number[];
}

type AttributeType =
  | 'float'
  | 'vec2'
  | 'vec3'
  | 'vec4'
  | 'mat2'
  | 'mat3'
  | 'mat4';
const inputSizes: Record<AttributeType, number> = {
  float: 1,
  vec2: 2,
  vec3: 3,
  vec4: 4,
  mat2: 4,
  mat3: 9,
  mat4: 16
};
type Vec2 = readonly [x: number, y: number];
type Vec3 = readonly [x: number, y: number, z: number];
type Vec4 = readonly [x: number, y: number, z: number, w: number];
interface UniformData {
  int: number;
  'int[]': number[];
  float: number;
  'float[]': number[];
  ivec2: Vec2;
  'ivec2[]': Vec2[];
  vec2: Vec2;
  'vec2[]': Vec2[];
  ivec3: Vec3;
  'ivec3[]': Vec3[];
  vec3: Vec3;
  'vec3[]': Vec3[];
  ivec4: Vec4;
  'ivec4[]': Vec4[];
  vec4: Vec4;
  'vec4[]': Vec4[];
  mat2: ReadonlyMat2;
  mat3: ReadonlyMat3;
  mat4: ReadonlyMat4;
  struct: Record<string, StructType<keyof UniformData>>;
  'struct[]': Record<string, StructType<keyof UniformData>>[];
}
interface StructType<T extends keyof UniformData> {
  type: T;
  data: UniformData[T];
}

export default class GL {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;

  program!: WebGLProgram;

  vertexShader!: Shader;
  fragmentShader!: Shader;

  vertexBuffer!: GLBuffer;
  indexBuffer!: GLBuffer;

  attributeLocations: Record<string, GLint> = {};
  uniformLocations: Record<string, WebGLUniformLocation> = {};
  textures: Texture[] = [];

  onResize?: () => void;

  constructor(
    readonly width: number,
    readonly height = width,
    { depth = false, cull = false }: { depth?: boolean; cull?: boolean } = {}
  ) {
    const canvas = document.createElement('canvas');
    canvas.textContent = 'HTML5 not supported';
    document.body.appendChild(canvas);
    this.canvas = canvas;

    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;

    if (depth) {
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
    }
    if (cull) {
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
      gl.frontFace(gl.CCW);
    }
    this.resize(width, height);
  }

  static async fullscreen(
    fragmentSource: string,
    vertexSource?: string
  ): Promise<GL> {
    const gl = new GL(window.innerWidth, window.innerHeight);
    gl.createProgramFromSource(vertexSource || screenSource, fragmentSource);
    gl.screen();
    gl.attributes([
      {
        name: 'position',
        type: 'vec2'
      }
    ]);
    gl.onResize = () => gl.resize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', gl.onResize);
    return gl;
  }

  /**
   * Resizes the canvas to a width and height
   * @param w the width
   * @param h the height
   */
  resize(w: number, h: number): this {
    const { canvas, gl } = this;

    const dpr = window.devicePixelRatio;
    const pixw = w * dpr;
    const pixh = h * dpr;

    // Set size in 3 ways
    // Attribute
    canvas.width = pixw;
    canvas.height = pixh;
    // Style
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    // GL
    gl.viewport(0, 0, pixw, pixh);

    return this;
  }

  /**
   * Creates a vertex shader from its source text
   * @param source the source of the vertex shader
   */
  createVertexShader(source: string): Shader {
    return new Shader(this.gl, 'vertex', source);
  }

  /**
   * Creates a fragment shader from its source text
   * @param source the source of the fragment shader
   */
  createFragmentShader(source: string): Shader {
    return new Shader(this.gl, 'fragment', source);
  }

  /**
   * Creates a program to run in WebGL
   * @param vertexShader
   * @param fragmentShader
   */
  createProgram(vertexShader: Shader, fragmentShader: Shader): WebGLProgram {
    const { gl } = this;
    // Create the program and bind the vertex and fragment shaders
    const program = gl.createProgram()!;
    vertexShader.attach(program);
    fragmentShader.attach(program);

    // Check for program errors
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      console.error('Error linking program:', gl.getProgramInfoLog(program));

    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
      console.error('Error validating program:', gl.getProgramInfoLog(program));

    this.program = program;
    gl.useProgram(program);
    return program;
  }

  createProgramFromSource(
    vertexSource: string,
    fragmentSource: string
  ): WebGLProgram {
    return this.createProgram(
      this.createVertexShader(vertexSource),
      this.createFragmentShader(fragmentSource)
    );
  }

  screen(): void {
    this.createVertexBuffer(GL.screenData.vertexData);
    this.createIndexBuffer(GL.screenData.indexData);
  }

  /**
   * Creates a vertex buffer
   * @param data the data for the buffer
   */
  createVertexBuffer(data: number[][][]): WebGLBuffer {
    const { gl } = this;
    // Create the vertex buffer
    const buffer = gl.createBuffer()!;
    // Bind the data to the buffer
    const flatData = data.flat(2);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatData), gl.STATIC_DRAW);

    this.vertexBuffer = { buffer, data, flatData };
    return buffer;
  }

  /**
   * Creates an index buffer
   * @param data the data for the buffer
   */
  createIndexBuffer(data: number[][][]): WebGLBuffer {
    const { gl } = this;
    // Create the index buffer
    const buffer = gl.createBuffer()!;
    // Bind the data to the buffer
    const flatData = data.flat(2);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(flatData),
      gl.STATIC_DRAW
    );

    this.indexBuffer = { buffer, data, flatData };
    return buffer;
  }

  /**
   * Gets the location of a attribute
   * @param name the name of the attribute
   */
  getAttributeLocation(name: string): GLint {
    // Attribute location is already cached
    if (Object.prototype.hasOwnProperty.call(this.attributeLocations, name))
      return this.attributeLocations[name]!;

    // Need to find the attribute location
    const attributeLocation = this.gl.getAttribLocation(this.program, name);
    if (attributeLocation !== -1)
      this.attributeLocations[name] = attributeLocation;
    return attributeLocation;
  }

  /**
   * Gets the location of a uniform
   * @param name the name of the uniform
   */
  getUniformLocation(name: string): WebGLUniformLocation | null {
    // Uniform location is already cached
    if (Object.prototype.hasOwnProperty.call(this.uniformLocations, name))
      return this.uniformLocations[name]!;

    // Need to find the uniform location
    const uniformLocation = this.gl.getUniformLocation(this.program, name);
    if (uniformLocation !== null) this.uniformLocations[name] = uniformLocation;
    return uniformLocation;
  }

  attributes(inputs: { name: string; type: AttributeType }[]): void {
    const { gl } = this;
    let offset = 0;
    const stride = inputs.reduce(
      (acc, { type }) =>
        acc + inputSizes[type] * Float32Array.BYTES_PER_ELEMENT,
      0
    );
    inputs.forEach(({ name, type }) => {
      const size = inputSizes[type];
      this.createAttribute(name, [size, gl.FLOAT, false, stride, offset]);
      offset += size * Float32Array.BYTES_PER_ELEMENT;
    });
  }

  uniform<T extends keyof Readonly<UniformData>>(
    name: string,
    type: T,
    data: UniformData[T]
  ): void {
    const { gl } = this;
    const location = this.getUniformLocation(name);
    switch (type) {
      case 'int':
        gl.uniform1i(location, data as UniformData['int']);
        break;
      case 'int[]':
        (data as UniformData['int[]']).forEach((value, i) =>
          this.uniform(`${name}[${i}]`, 'int', value)
        );
        break;
      case 'float':
        gl.uniform1f(location, data as UniformData['float']);
        break;
      case 'float[]':
        (data as UniformData['float[]']).forEach((value, i) =>
          this.uniform(`${name}[${i}]`, 'float', value)
        );
        break;
      case 'ivec2':
        gl.uniform2i(location, ...(data as UniformData['ivec2']));
        break;
      case 'ivec2[]':
        (data as UniformData['ivec2[]']).forEach((value, i) =>
          this.uniform(`${name}[${i}]`, 'ivec2', value)
        );
        break;
      case 'vec2':
        gl.uniform2f(location, ...(data as UniformData['vec2']));
        break;
      case 'vec2[]':
        (data as UniformData['vec2[]']).forEach((value, i) =>
          this.uniform(`${name}[${i}]`, 'vec2', value)
        );
        break;
      case 'ivec3':
        gl.uniform3i(location, ...(data as UniformData['ivec3']));
        break;
      case 'ivec3[]':
        (data as UniformData['ivec3[]']).forEach((value, i) =>
          this.uniform(`${name}[${i}]`, 'ivec3', value)
        );
        break;
      case 'vec3':
        gl.uniform3f(location, ...(data as UniformData['vec3']));
        break;
      case 'vec3[]':
        (data as UniformData['vec3[]']).forEach((value, i) =>
          this.uniform(`${name}[${i}]`, 'vec3', value)
        );
        break;
      case 'ivec4':
        gl.uniform4i(location, ...(data as UniformData['ivec4']));
        break;
      case 'ivec4[]':
        (data as UniformData['ivec4[]']).forEach((value, i) =>
          this.uniform(`${name}[${i}]`, 'ivec4', value)
        );
        break;
      case 'vec4':
        gl.uniform4f(location, ...(data as UniformData['vec4']));
        break;
      case 'vec4[]':
        (data as UniformData['vec4[]']).forEach((value, i) =>
          this.uniform(`${name}[${i}]`, 'vec4', value)
        );
        break;
      case 'mat2':
        gl.uniformMatrix2fv(
          location,
          false,
          new Float32Array(data as UniformData['mat2'])
        );
        break;
      case 'mat3':
        gl.uniformMatrix3fv(
          location,
          false,
          new Float32Array(data as UniformData['mat3'])
        );
        break;
      case 'mat4':
        gl.uniformMatrix4fv(
          location,
          false,
          new Float32Array(data as UniformData['mat4'])
        );
        break;
      case 'struct':
        Object.entries(data as UniformData['struct']).forEach(
          ([key, { type, data }]) => this.uniform(`${name}.${key}`, type, data)
        );
        break;
      case 'struct[]':
        (data as UniformData['struct[]']).forEach((value, i) =>
          this.uniform(`${name}[${i}]`, 'struct', value)
        );
    }
  }

  /**
   *
   * @param name the name of the attribute
   * @param config
   * Number of elements per attribute,
   * Type of elements,
   * Is it normalized?,
   * Size of an individual vertex,
   * Offset from the beginning of a single vertex to this attribute
   * @returns the attribute location
   */
  createAttribute(
    name: string,
    config: [
      size: GLint,
      type: GLenum,
      normalized: GLboolean,
      stride: GLsizei,
      offset: GLintptr
    ]
  ): GLint {
    const { gl } = this;
    // Find the attribute location
    const attributeLocation = this.getAttributeLocation(name);
    // Enable the attribute and config
    gl.vertexAttribPointer(
      attributeLocation, // Attribute location
      ...config
      // Number of elements per attribute
      // Type of elements
      // Is it normalized?
      // Size of an individual vertex
      // Offset from the beginning of a single vertex to this attribute
    );
    gl.enableVertexAttribArray(attributeLocation);

    return attributeLocation;
  }

  /**
   * Creates a texture from an image
   * @param url a file url to the image
   */
  async createTexture(image: TexImageSource, param?: GLenum): Promise<Texture> {
    const { gl, textures } = this;
    const texture = new Texture(image, gl, param);
    textures.push(texture);
    return texture;
  }

  createScreenTexture(): WebGLTexture {
    const { gl } = this;

    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.activeTexture(gl.TEXTURE0);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return texture;
  }

  /**
   * Fills the canvas with a background color
   * @param r red value
   * @param g green value
   * @param b blue value
   * @param a alpha value
   */
  background(r: number, g: number, b: number, a = 1): this {
    const { gl } = this;
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    return this;
  }

  bindTextures(): void {
    this.textures.forEach((texture, i) => texture.activate(i));
  }

  /**
   * Draws triangles based on the index buffer
   */
  render(): this {
    const { gl } = this;
    gl.drawElements(
      gl.TRIANGLES, // Type of shape
      this.indexBuffer.flatData.length, // Number of vertices
      gl.UNSIGNED_SHORT, // Type of the indices
      0 // Where to start
    );
    return this;
  }

  buffer(): Uint8Array {
    const { gl, width, height } = this;
    const buffer = new Uint8Array(width * height * 4);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, buffer);
    return buffer;
  }

  remove(): void {
    const { gl, textures } = this;
    textures.forEach(texture => texture.remove());
    gl.deleteBuffer(this.indexBuffer.buffer);
    gl.deleteBuffer(this.vertexBuffer.buffer);
    if (this.onResize) window.removeEventListener('resize', this.onResize);
  }

  static unitCubeTextured = {
    vertexData: [
      // X, Y, Z -- U, V
      // Top
      [
        [-1, 1, -1, 0, 0],
        [-1, 1, 1, 0, 1],
        [1, 1, 1, 1, 1],
        [1, 1, -1, 1, 0]
      ],

      // Left
      [
        [-1, 1, 1, 0, 0],
        [-1, -1, 1, 1, 0],
        [-1, -1, -1, 1, 1],
        [-1, 1, -1, 0, 1]
      ],

      // Right
      [
        [1, 1, 1, 1, 1],
        [1, -1, 1, 0, 1],
        [1, -1, -1, 0, 0],
        [1, 1, -1, 1, 0]
      ],

      // Front
      [
        [1, 1, 1, 1, 1],
        [1, -1, 1, 1, 0],
        [-1, -1, 1, 0, 0],
        [-1, 1, 1, 0, 1]
      ],

      // Back
      [
        [1, 1, -1, 0, 0],
        [1, -1, -1, 0, 1],
        [-1, -1, -1, 1, 1],
        [-1, 1, -1, 1, 0]
      ],

      // Bottom
      [
        [-1, -1, -1, 1, 1],
        [-1, -1, 1, 1, 0],
        [1, -1, 1, 0, 0],
        [1, -1, -1, 0, 1]
      ]
    ],
    indexData: [
      // Top
      [
        [0, 1, 2],
        [0, 2, 3]
      ],

      // Left
      [
        [5, 4, 6],
        [6, 4, 7]
      ],

      // Right
      [
        [8, 9, 10],
        [8, 10, 11]
      ],

      // Front
      [
        [13, 12, 14],
        [15, 14, 12]
      ],

      // Back
      [
        [16, 17, 18],
        [16, 18, 19]
      ],

      // Bottom
      [
        [21, 20, 22],
        [22, 20, 23]
      ]
    ]
  };

  static screenData = {
    vertexData: [
      [
        [-1, 1],
        [1, 1],
        [-1, -1],
        [1, -1]
      ]
    ],
    indexData: [
      [
        [0, 2, 3],
        [3, 1, 0]
      ]
    ]
  };
}
