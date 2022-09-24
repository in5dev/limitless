import { TAU } from '../../math/constants.js';

interface Point {
  x: number;
  y: number;
}

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
export default class Renderer2D {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  private doStroke = true;
  private doFill = true;

  private callback?: () => void;
  private handle?: number;

  constructor(canvas: HTMLCanvasElement);
  constructor(container: HTMLElement, width: number, height?: number);
  constructor(width: number, height?: number);
  constructor(
    container: HTMLElement | number,
    width?: number,
    height?: number
  ) {
    if (container instanceof HTMLCanvasElement) this.canvas = container;
    else if (container instanceof HTMLElement) {
      this.canvas = document.createElement('canvas');
      container.appendChild(this.canvas);
      this.resize(width || 400, height);
    } else {
      this.canvas = document.createElement('canvas');
      document.body.appendChild(this.canvas);
      this.resize(container, width);
    }

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to get canvas 2D rendering ctx');
    this.ctx = ctx;
  }

  get width(): number {
    return this.canvas.width;
  }
  get height(): number {
    return this.canvas.height;
  }

  resize(width: number, height = width): void {
    const { canvas } = this;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  background(color: string): void {
    const { ctx } = this;
    const { fillStyle } = ctx;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = fillStyle;
  }

  stroke(color: string): void {
    this.ctx.strokeStyle = color;
    this.doStroke = true;
  }
  noStroke(): void {
    this.doStroke = false;
  }

  fill(color: string): void {
    this.ctx.fillStyle = color;
    this.doFill = true;
  }
  noFill(): void {
    this.doFill = false;
  }

  point(x: number, y: number): void {
    const { ctx, doStroke } = this;
    if (doStroke) {
      const { fillStyle } = ctx;
      ctx.fillStyle = ctx.strokeStyle;
      ctx.fillRect(x, y, x + 1, y + 1);
      ctx.fillStyle = fillStyle;
    }
  }

  line(x1: number, y1: number, x2: number, y2: number): void {
    const { ctx, doStroke } = this;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    if (doStroke) ctx.stroke();
  }

  rect(x: number, y: number, w: number, h = w): void {
    const { ctx, doStroke, doFill } = this;
    if (doStroke) ctx.strokeRect(x, y, w, h);
    if (doFill) ctx.fillRect(x, y, w, h);
  }
  square(x: number, y: number, w: number): void {
    this.rect(x, y, w);
  }

  ellipse(
    x: number,
    y: number,
    w: number,
    h = w,
    rotation = 0,
    startAngle = 0,
    endAngle = TAU
  ): void {
    const { ctx, doStroke, doFill } = this;
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, h / 2, rotation, startAngle, endAngle);
    if (doStroke) ctx.stroke();
    if (doFill) ctx.fill();
  }
  circle(
    x: number,
    y: number,
    r: number,
    startAngle?: number,
    endAngle?: number
  ): void {
    this.ellipse(x, y, r * 2, r * 2, 0, startAngle, endAngle);
  }

  poly(vertices: Point[]): void {
    const first = vertices[0];
    if (!first) return;
    const { ctx, doStroke, doFill } = this;
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < vertices.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { x, y } = vertices[i]!;
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    if (doStroke) ctx.stroke();
    if (doFill) ctx.fill();
  }

  triangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): void {
    this.poly([
      { x: x1, y: y1 },
      { x: x2, y: y2 },
      { x: x3, y: y3 }
    ]);
  }

  quad(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    x4: number,
    y4: number
  ): void {
    this.poly([
      { x: x1, y: y1 },
      { x: x2, y: y2 },
      { x: x3, y: y3 },
      { x: x4, y: y4 }
    ]);
  }

  arc(
    x: number,
    y: number,
    r: number,
    startAngle: number,
    endAngle: number,
    anticlockwise = false
  ): void {
    const { ctx, doStroke, doFill } = this;
    ctx.beginPath();
    ctx.arc(x, y, r, startAngle, endAngle, anticlockwise);
    if (doStroke) ctx.stroke();
    if (doFill) ctx.fill();
  }

  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    const { ctx, doStroke, doFill } = this;
    ctx.beginPath();
    ctx.arcTo(x1, y1, x2, y2, radius);
    if (doStroke) ctx.stroke();
    if (doFill) ctx.fill();
  }

  bezier(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): void {
    const { ctx, doStroke, doFill } = this;
    ctx.beginPath();
    ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    if (doStroke) ctx.stroke();
    if (doFill) ctx.fill();
  }

  curve(x1: number, y1: number, x2: number, y2: number): void {
    const { ctx, doStroke, doFill } = this;
    ctx.beginPath();
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    if (doStroke) ctx.stroke();
    if (doFill) ctx.fill();
  }

  render(callback: () => void): void {
    this.callback = callback;
    this.start();
  }

  start(): void {
    if (!this.callback) return;
    if (this.handle) cancelAnimationFrame(this.handle);
    const draw = () => {
      this.callback?.();
      this.handle = requestAnimationFrame(draw);
    };
    this.handle = requestAnimationFrame(draw);
  }

  stop(): void {
    if (this.handle) cancelAnimationFrame(this.handle);
    this.handle = undefined;
  }

  remove(): void {
    this.stop();
    this.canvas.remove();
  }
}
