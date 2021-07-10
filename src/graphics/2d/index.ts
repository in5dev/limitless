import { TAU } from '../../math/constants';

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
export default class Renderer2D {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private doStroke = true;
  private doFill = true;

  constructor(container: HTMLCanvasElement);
  constructor(container: HTMLElement);
  constructor();
  constructor(container?: HTMLElement) {
    if (container instanceof HTMLCanvasElement) this.canvas = container;
    else {
      this.canvas = document.createElement('canvas');
      if (container) container.appendChild(this.canvas);
      else document.appendChild(this.canvas);
    }

    const context = this.canvas.getContext('2d');
    if (!context) throw new Error('Unable to get canvas 2D rendering context');
    this.context = context;
  }

  stroke(color: string): void {
    this.context.strokeStyle = color;
    this.doStroke = true;
  }
  noStroke(): void {
    this.doStroke = false;
  }

  fill(color: string): void {
    this.context.fillStyle = color;
    this.doFill = true;
  }
  noFill(): void {
    this.doFill = false;
  }

  point(x: number, y: number): void {
    const { context, doStroke } = this;
    if (doStroke) {
      const { fillStyle } = context;
      context.fillStyle = context.strokeStyle;
      context.fillRect(x, y, x + 1, y + 1);
      context.fillStyle = fillStyle;
    }
  }

  line(x1: number, y1: number, x2: number, y2: number): void {
    const { context, doStroke } = this;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    if (doStroke) context.stroke();
  }

  rect(x: number, y: number, w: number, h = w): void {
    const { context, doStroke, doFill } = this;
    if (doStroke) context.strokeRect(x, y, w, h);
    if (doFill) context.fillRect(x, y, w, h);
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
    const { context, doStroke, doFill } = this;
    context.beginPath();
    context.ellipse(x, y, w / 2, h / 2, rotation, startAngle, endAngle);
    if (doStroke) context.stroke();
    if (doFill) context.fill();
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

  poly(vertices: { x: number; y: number }[]): void {
    const first = vertices[0];
    if (!first) return;
    const { context, doStroke, doFill } = this;
    context.beginPath();
    context.moveTo(first.x, first.y);
    for (let i = 1; i < vertices.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { x, y } = vertices[i]!;
      context.lineTo(x, y);
    }
    context.closePath();
    if (doStroke) context.stroke();
    if (doFill) context.fill();
  }
}
