import type { Vector2 } from '../../math';
import { Points } from './geometry';
import Program from './program';
import Shader, { Type } from './shader';

export default class GL {
  canvas: HTMLCanvasElement;
  gl: WebGL2RenderingContext;

  program: Program;

  time = 0;
  animateFn?: (time: number) => void;

  constructor(vertexSource: string, fragmentSource: string) {
    const canvas = document.createElement('canvas');
    this.canvas = canvas;
    canvas.textContent = 'Your browser does not support HTML5';
    document.body.appendChild(canvas);

    // Set up the WebGL rendering context
    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);

    this.setSize(400, 400).background(0, 0, 0);

    this.program = new Program(gl, [
      new Shader(gl, Type.Vertex, vertexSource),
      new Shader(gl, Type.Fragment, fragmentSource)
    ]);
  }

  /**
   * Resizes the canvas to a width and height
   * @param w the width
   * @param h the height
   */
  setSize(w: number, h: number): this {
    const { canvas, gl } = this;

    const dpr = devicePixelRatio || 1;
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
   * Resizes the canvas to the full window
   */
  fullscreen(): this {
    const onresize = () => this.setSize(window.innerWidth, window.innerHeight);
    onresize();
    window.addEventListener('resize', onresize);
    return this;
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
    gl.clear(gl.COLOR_BUFFER_BIT);
    return this;
  }

  animate(fn: (dt: number) => void): this {
    this.animateFn = fn;
    this.time = performance.now();
    requestAnimationFrame(this.loop.bind(this));
    return this;
  }

  private loop(): void {
    // Calculate change in time
    const nowTime = performance.now();
    const dt = (nowTime - this.time) / 2;
    this.time = nowTime;

    if (this.animateFn) this.animateFn(dt);
    requestAnimationFrame(this.loop.bind(this));
  }

  getAttributeLocation(name: string): GLint {
    return this.program.getAttributeLocation(name);
  }

  getUniformLocation(name: string): WebGLUniformLocation | null {
    return this.program.getUniformLocation(name);
  }

  setUniforms(uniforms: Record<string, number | Vector2>): void {
    this.program.setUniforms(uniforms);
  }

  Points(attribute: string, points: Vector2[]): Points {
    return new Points(this.gl, this.getAttributeLocation(attribute), points);
  }

  static unitCubeTextured = {
    vertexData: [
      // X, Y, Z --- U, V
      // Top
      [
        [-1.0, 1.0, -1.0, 0, 0],
        [-1.0, 1.0, 1.0, 0, 1],
        [1.0, 1.0, 1.0, 1, 1],
        [1.0, 1.0, -1.0, 1, 0]
      ],

      // Left
      [
        [-1.0, 1.0, 1.0, 0, 0],
        [-1.0, -1.0, 1.0, 1, 0],
        [-1.0, -1.0, -1.0, 1, 1],
        [-1.0, 1.0, -1.0, 0, 1]
      ],

      // Right
      [
        [1.0, 1.0, 1.0, 1, 1],
        [1.0, -1.0, 1.0, 0, 1],
        [1.0, -1.0, -1.0, 0, 0],
        [1.0, 1.0, -1.0, 1, 0]
      ],

      // Front
      [
        [1.0, 1.0, 1.0, 1, 1],
        [1.0, -1.0, 1.0, 1, 0],
        [-1.0, -1.0, 1.0, 0, 0],
        [-1.0, 1.0, 1.0, 0, 1]
      ],

      // Back
      [
        [1.0, 1.0, -1.0, 0, 0],
        [1.0, -1.0, -1.0, 0, 1],
        [-1.0, -1.0, -1.0, 1, 1],
        [-1.0, 1.0, -1.0, 1, 0]
      ],

      // Bottom
      [
        [-1.0, -1.0, -1.0, 1, 1],
        [-1.0, -1.0, 1.0, 1, 0],
        [1.0, -1.0, 1.0, 0, 0],
        [1.0, -1.0, -1.0, 0, 1]
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

  static screen = {
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

// interface GLShader {
//   shader: WebGLShader;
//   source: string;
// }

// interface GLBuffer {
//   buffer: WebGLBuffer;
//   data: number[][][];
//   flatData: number[];
// }

// export default class GL {
//   canvas: HTMLCanvasElement;
//   gl: WebGL2RenderingContext;

//   program!: WebGLProgram;

//   vertexShader!: GLShader;
//   fragmentShader!: GLShader;

//   vertexBuffer!: GLBuffer;
//   indexBuffer!: GLBuffer;

//   attributeLocations: Map<string, GLint> = new Map();
//   uniformLocations: Map<string, WebGLUniformLocation> = new Map();
//   textures: WebGLTexture[] = [];

//   time = 0;
//   animateFn?: (time: number) => void;

//   constructor(canvas?: HTMLCanvasElement) {
//     // If no canvas, create one
//     if (!canvas) {
//       canvas = document.createElement('canvas');
//       canvas.textContent = 'Your browser does not support HTML5';
//       document.body.appendChild(canvas);
//     }

//     // Set up the WebGL rendering context
//     const gl = canvas.getContext('webgl2');

//     if (!gl) throw new Error('WebGL not supported');

//     gl.enable(gl.DEPTH_TEST);
//     gl.enable(gl.CULL_FACE);
//     gl.frontFace(gl.CCW);
//     gl.cullFace(gl.BACK);

//     this.canvas = canvas;
//     this.gl = gl;
//     this.setSize(400, 400).background(0, 0, 0);
//   }

//   /**
//    * Resizes the canvas to a width and height
//    * @param w the width
//    * @param h the height
//    */
//   setSize(w: number, h: number): this {
//     const { canvas, gl } = this;

//     // Set size in 3 ways
//     // Attribute
//     canvas.width = w;
//     canvas.height = h;
//     // Style
//     canvas.style.width = `${w}px`;
//     canvas.style.height = `${h}px`;
//     // GL
//     gl.viewport(0, 0, w, h);
//     return this;
//   }

//   /**
//    * Resizes the canvas to the full window
//    */
//   fullscreen(): this {
//     return this.setSize(window.innerWidth, window.innerHeight);
//   }

//   /**
//    * Gets the text of a file
//    * @param path path to the file
//    */
//   static async loadFile(path: string): Promise<string> {
//     const response = await fetch(path);
//     const text = await response.text();
//     return text;
//   }

//   /**
//    * Creates a vertex shader from its source code
//    * @param source the source of the vertex shader
//    */
//   createVertexShader(source: string): WebGLShader {
//     const { gl } = this;
//     // Create the vertex shader and bind the source
//     const shader = gl.createShader(gl.VERTEX_SHADER);
//     if (!shader) throw new Error('Error creating vertex shader');
//     this.vertexShader = { shader, source };

//     this.setShaderSource('vertex', source);

//     // Check for shader errors
//     gl.compileShader(shader);
//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
//       throw new Error(
//         `Error compiling vertex shader: ${gl.getShaderInfoLog(shader)}`
//       );

//     return shader;
//   }

//   /**
//    * Creates a fragment shader from its source code
//    * @param source the source of the fragment shader
//    */
//   createFragmentShader(source: string): WebGLShader {
//     const { gl } = this;
//     // Create the fragment shader and bind the source
//     const shader = gl.createShader(gl.FRAGMENT_SHADER);
//     if (!shader) throw new Error('Error creating fragment shader');
//     this.fragmentShader = { shader, source };

//     this.setShaderSource('fragment', source);

//     // Check for shader errors
//     gl.compileShader(shader);
//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
//       throw new Error(
//         `Error compiling fragment shader: ${gl.getShaderInfoLog(shader)}`
//       );

//     return shader;
//   }

//   /**
//    * Sets the source code of a shader
//    * @param type vertex or fragment
//    * @param source the shader source
//    */
//   setShaderSource(type: 'vertex' | 'fragment', source: string): this {
//     const { gl } = this;
//     // Bind the source
//     const version = '#version 300 es\n';
//     gl.shaderSource(
//       (type === 'vertex' ? this.vertexShader : this.fragmentShader).shader,
//       (source.startsWith(version) ? '' : version) + source
//     );

//     return this;
//   }

//   /**
//    * Creates a program to run in WebGL
//    * @param vertexShader
//    * @param fragmentShader
//    */
//   createProgram(
//     vertexShader: WebGLShader,
//     fragmentShader: WebGLShader
//   ): WebGLProgram {
//     const { gl } = this;
//     // Create the program and bind the vertex and fragment shaders
//     const program = gl.createProgram();
//     if (!program) throw new Error('Error creating program');

//     gl.attachShader(program, vertexShader);
//     gl.attachShader(program, fragmentShader);

//     // Check for program errors
//     gl.linkProgram(program);
//     if (!gl.getProgramParameter(program, gl.LINK_STATUS))
//       throw new Error(
//         `Error linking program: ${gl.getProgramInfoLog(program)}`
//       );

//     gl.validateProgram(program);
//     if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
//       throw new Error(
//         `Error validating program: ${gl.getProgramInfoLog(program)}`
//       );

//     gl.useProgram(program);
//     this.program = program;
//     return program;
//   }

//   createProgramFromSources(
//     vertexSource: string,
//     fragmentSource: string
//   ): WebGLProgram {
//     return this.createProgram(
//       this.createVertexShader(vertexSource),
//       this.createFragmentShader(fragmentSource)
//     );
//   }

//   async createProgramFromPaths(
//     vertexShaderPath: string,
//     fragmentShaderPath: string
//   ): Promise<WebGLProgram> {
//     return this.createProgramFromSources(
//       await GL.loadFile(vertexShaderPath),
//       await GL.loadFile(fragmentShaderPath)
//     );
//   }

//   /**
//    * Creates a vertex buffer
//    * @param data the data for the buffer
//    */
//   createVertexBuffer(data: number[][][]): WebGLBuffer {
//     const { gl } = this;
//     // Create the vertex buffer
//     const buffer = gl.createBuffer();
//     if (!buffer) throw new Error('Error creating vertex buffer');

//     // Bind the data to the buffer
//     const flatData = data.flat(2);
//     gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatData), gl.STATIC_DRAW);

//     this.vertexBuffer = { buffer, data, flatData };
//     return buffer;
//   }

//   /**
//    * Creates an index buffer
//    * @param data the data for the buffer
//    */
//   createIndexBuffer(data: number[][][]): WebGLBuffer {
//     const { gl } = this;
//     // Create the index buffer
//     const buffer = gl.createBuffer();
//     if (!buffer) throw new Error('Error creating index buffer');

//     // Bind the data to the buffer
//     const flatData = data.flat(2);
//     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
//     gl.bufferData(
//       gl.ELEMENT_ARRAY_BUFFER,
//       new Uint16Array(flatData),
//       gl.STATIC_DRAW
//     );

//     this.indexBuffer = { buffer, data, flatData };
//     return buffer;
//   }

//   /**
//    * Gets the location of a attribute
//    * @param name the name of the attribute
//    */
//   getAttributeLocation(name: string): GLint {
//     // Attribute location is already cached
//     let attributeLocation = this.attributeLocations.get(name);
//     if (attributeLocation) return attributeLocation;

//     // Need to find the attribute location
//     attributeLocation = this.gl.getAttribLocation(this.program, name);
//     if (attributeLocation !== -1)
//       this.attributeLocations.set(name, attributeLocation);
//     return attributeLocation;
//   }

//   /**
//    * Gets the location of a uniform
//    * @param name the name of the uniform
//    */
//   getUniformLocation(name: string): WebGLUniformLocation | null {
//     // Uniform location is already cached
//     const cachedUniformLocation = this.uniformLocations.get(name);
//     if (cachedUniformLocation) return cachedUniformLocation;

//     // Need to find the uniform location
//     const uniformLocation = this.gl.getUniformLocation(this.program, name);
//     if (uniformLocation) this.uniformLocations.set(name, uniformLocation);
//     return uniformLocation;
//   }

//   /**
//    *
//    * @param name the name of the attribute
//    * @param config
//    * Number of elements per attribute,
//    * Type of elements,
//    * Is it normalized?,
//    * Size of an individual vertex,
//    * Offset from the beginning of a single vertex to this attribute
//    * @returns the attribute location
//    */
//   createAttribute(
//     name: string,
//     config: [GLint, GLenum, GLboolean, GLsizei, GLintptr]
//   ): GLint {
//     const { gl } = this;
//     // Find the attribute location
//     const attributeLocation = this.getAttributeLocation(name);
//     // Config and enable the attribute
//     gl.vertexAttribPointer(
//       attributeLocation, // Attribute location
//       ...config
//       // Number of elements per attribute
//       // Type of elements
//       // Is it normalized?
//       // Size of an individual vertex
//       // Offset from the beginning of a single vertex to this attribute
//     );
//     gl.enableVertexAttribArray(attributeLocation);

//     return attributeLocation;
//   }

//   /**
//    * Creates a texture from an image
//    * @param imgElement the <img> element of the image
//    */
//   createTexture(imgElement: HTMLImageElement): WebGLTexture {
//     const { gl } = this;
//     // Create the texture
//     const texture = gl.createTexture();
//     if (!texture) throw new Error('Error creating texture');

//     // Bind and config the texture
//     gl.bindTexture(gl.TEXTURE_2D, texture);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//     gl.texImage2D(
//       gl.TEXTURE_2D,
//       0,
//       gl.RGBA,
//       gl.RGBA,
//       gl.UNSIGNED_BYTE,
//       imgElement
//     );
//     gl.bindTexture(gl.TEXTURE_2D, null);

//     this.textures.push(texture);
//     return texture;
//   }

//   /**
//    * Prepares the stored textures to be drawn
//    */
//   bindTextures(): this {
//     const { gl, textures } = this;
//     for (let i = 0, { length } = textures; i < length; i++) {
//       gl.bindTexture(gl.TEXTURE_2D, textures[i]);
//       gl.activeTexture(gl.TEXTURE0 + i);
//     }
//     return this;
//   }

//   /**
//    * Fills the canvas with a background color
//    * @param r red value
//    * @param g green value
//    * @param b blue value
//    * @param a alpha value
//    */
//   background(r: number, g: number, b: number, a = 1): this {
//     const { gl } = this;
//     gl.clearColor(r, g, b, a);
//     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
//     return this;
//   }

//   /**
//    * Draws triangles based on the vertex buffer
//    */
//   drawArrays(): this {
//     const { gl } = this;
//     gl.drawArrays(
//       gl.TRIANGLES, // Type of shape
//       0, // Where to start
//       this.vertexBuffer.data.length // Number of vertices
//     );
//     return this;
//   }

//   /**
//    * Draws triangles based on the index buffer
//    */
//   drawElements(): this {
//     const { gl } = this;
//     gl.drawElements(
//       gl.TRIANGLES, // Type of shape
//       this.indexBuffer.flatData.length, // Number of vertices
//       gl.UNSIGNED_SHORT, // Type of the indices
//       0 // Where to start
//     );
//     return this;
//   }

//   animate(fn: (dt: number) => void): this {
//     this.animateFn = fn;
//     this.time = performance.now();
//     requestAnimationFrame(this.loop.bind(this));
//     return this;
//   }

//   private loop(): void {
//     // Calculate change in time
//     const nowTime = performance.now();
//     const dt = nowTime - this.time;
//     this.time = nowTime;

//     if (this.animateFn) this.animateFn(dt);
//     requestAnimationFrame(this.loop.bind(this));
//   }

//   static unitCubeTextured = {
//     vertexData: [
//       // X, Y, Z --- U, V
//       // Top
//       [
//         [-1.0, 1.0, -1.0, 0, 0],
//         [-1.0, 1.0, 1.0, 0, 1],
//         [1.0, 1.0, 1.0, 1, 1],
//         [1.0, 1.0, -1.0, 1, 0]
//       ],

//       // Left
//       [
//         [-1.0, 1.0, 1.0, 0, 0],
//         [-1.0, -1.0, 1.0, 1, 0],
//         [-1.0, -1.0, -1.0, 1, 1],
//         [-1.0, 1.0, -1.0, 0, 1]
//       ],

//       // Right
//       [
//         [1.0, 1.0, 1.0, 1, 1],
//         [1.0, -1.0, 1.0, 0, 1],
//         [1.0, -1.0, -1.0, 0, 0],
//         [1.0, 1.0, -1.0, 1, 0]
//       ],

//       // Front
//       [
//         [1.0, 1.0, 1.0, 1, 1],
//         [1.0, -1.0, 1.0, 1, 0],
//         [-1.0, -1.0, 1.0, 0, 0],
//         [-1.0, 1.0, 1.0, 0, 1]
//       ],

//       // Back
//       [
//         [1.0, 1.0, -1.0, 0, 0],
//         [1.0, -1.0, -1.0, 0, 1],
//         [-1.0, -1.0, -1.0, 1, 1],
//         [-1.0, 1.0, -1.0, 1, 0]
//       ],

//       // Bottom
//       [
//         [-1.0, -1.0, -1.0, 1, 1],
//         [-1.0, -1.0, 1.0, 1, 0],
//         [1.0, -1.0, 1.0, 0, 0],
//         [1.0, -1.0, -1.0, 0, 1]
//       ]
//     ],
//     indexData: [
//       // Top
//       [
//         [0, 1, 2],
//         [0, 2, 3]
//       ],

//       // Left
//       [
//         [5, 4, 6],
//         [6, 4, 7]
//       ],

//       // Right
//       [
//         [8, 9, 10],
//         [8, 10, 11]
//       ],

//       // Front
//       [
//         [13, 12, 14],
//         [15, 14, 12]
//       ],

//       // Back
//       [
//         [16, 17, 18],
//         [16, 18, 19]
//       ],

//       // Bottom
//       [
//         [21, 20, 22],
//         [22, 20, 23]
//       ]
//     ]
//   };

//   static screen = {
//     vertexData: [
//       [
//         [-1, 1],
//         [1, 1],
//         [-1, -1],
//         [1, -1]
//       ]
//     ],
//     indexData: [
//       [
//         [0, 2, 3],
//         [3, 1, 0]
//       ]
//     ]
//   };
// }
