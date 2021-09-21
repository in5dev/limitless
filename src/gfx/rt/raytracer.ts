import Ray from './ray';
import { ReflectionType } from './sphere';
import { vec3, Vector3 } from '../../math';
import type Camera from './camera';
import type Scene from './scene';

export default class RayTracer {
  canvas: HTMLCanvasElement;

  constructor(
    public scene: Scene,
    public camera: Camera,
    public width: number,
    public height = width,
    public maxDepth = 5
  ) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    this.canvas = canvas;
  }

  async render(samples = 4) {
    const { canvas, camera, width, height } = this;
    const ctx = canvas.getContext('2d')!;

    let passes = 0;
    while (true) {
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const rays = camera.getRays(x, height - y, width, height, samples);
          const color = vec3();
          rays.forEach(ray => color.add(this.radiance(ray)));
          color.div(rays.length);

          const currentData = ctx.getImageData(x, y, 1, 1).data;
          const currentColor = vec3(
            currentData[0],
            currentData[1],
            currentData[2]
          );
          const newColor = Vector3.add(
            currentColor.mult(passes / 255),
            color
          ).div(passes + 1);

          ctx.fillStyle = `rgb(${newColor
            .toArray()
            .map(x => x * 255)
            .join(',')})`;
          ctx.fillRect(x, y, 1, 1);
        }
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      passes++;
    }
  }

  private radiance(ray: Ray): Vector3 {
    const { scene, maxDepth } = this;
    let depth = 0;
    const L = vec3();
    const F = vec3(1);

    while (true) {
      const { t, sphere, normal: n } = scene.intersect(ray);
      if (t === Infinity) return vec3();
      const p = ray.at(t);

      L.add(Vector3.mult(F, sphere.emission));
      F.mult(sphere.color);

      if (++depth > maxDepth) {
        const continueProbability = sphere.color.max();
        if (Math.random() >= continueProbability) return L;
        F.div(continueProbability);
      }

      switch (sphere.reflectionType) {
        case ReflectionType.DIFFUSE: {
          const w = n.dot(ray.direction) < 0 ? n : n.neg();
          const u = (Math.abs(w.x) > 0.1 ? vec3(0, 1, 0) : vec3(1, 0, 0))
            .cross(w)
            .normalize();
          const v = w.cross(u);

          const sample_d = cosine_weighted_sample_on_hemisphere(
            Math.random(),
            Math.random()
          );
          const d = Vector3.add(
            Vector3.add(
              Vector3.mult(u, sample_d.x),
              Vector3.mult(v, sample_d.y)
            ),
            Vector3.mult(w, sample_d.z)
          ).normalize();
          ray = new Ray(p, d);
          continue;
        }
        case ReflectionType.SPECULAR: {
          const dRe = Vector3.reflect(ray.direction, n);
          ray = new Ray(p, dRe);
          continue;
        }
        case ReflectionType.REFRACTIVE: {
          const [dTr, pr] = specular_transmit(ray.direction, n, 1, 1.5);
          F.mult(pr);
          ray = new Ray(p, dTr);
          continue;
        }
      }
    }
  }
}

function reflectance0(n1: number, n2: number): number {
  const sqrt_R0 = (n1 - n2) / (n1 + n2);
  return sqrt_R0 * sqrt_R0;
}

function schlick_reflectance(n1: number, n2: number, c: number): number {
  const R0 = reflectance0(n1, n2);
  return R0 + (1 - R0) * c * c * c * c * c;
}

function specular_transmit(
  d: Vector3,
  n: Vector3,
  n_out: number,
  n_in: number
): [Vector3, number] {
  let d_Re: Vector3 = Vector3.reflect(d, n);

  let out_to_in: boolean = n.dot(d) < 0;
  let nl: Vector3 = out_to_in ? n : n.neg();
  let nn: number = out_to_in ? n_out / n_in : n_in / n_out;
  let cos_theta: number = d.dot(nl);
  let cos2_phi: number = 1.0 - nn * nn * (1.0 - cos_theta * cos_theta);

  // Total Internal Reflection
  if (cos2_phi < 0) {
    return [d_Re, 1.0];
  }

  let d_Tr: Vector3 = Vector3.sub(
    Vector3.mult(d, nn),
    Vector3.mult(nl, nn * cos_theta + Math.sqrt(cos2_phi))
  ).normalize();
  let c: number = 1.0 - (out_to_in ? -cos_theta : d_Tr.dot(n));

  let Re: number = schlick_reflectance(n_out, n_in, c);
  let p_Re: number = 0.25 + 0.5 * Re;
  if (Math.random() < p_Re) {
    return [d_Re, Re / p_Re];
  }
  let Tr: number = 1.0 - Re;
  let p_Tr: number = 1.0 - p_Re;
  return [d_Tr, Tr / p_Tr];
}

function uniform_sample_on_hemisphere(u1: number, u2: number): Vector3 {
  let sin_theta: number = Math.sqrt(Math.max(0.0, 1.0 - u1 * u1));
  let phi: number = 2.0 * Math.PI * u2;
  return vec3(Math.cos(phi) * sin_theta, Math.sin(phi) * sin_theta, u1);
}

function cosine_weighted_sample_on_hemisphere(u1: number, u2: number): Vector3 {
  let cos_theta: number = Math.sqrt(1.0 - u1);
  let sin_theta: number = Math.sqrt(u1);
  let phi: number = 2.0 * Math.PI * u2;
  return vec3(Math.cos(phi) * sin_theta, Math.sin(phi) * sin_theta, cos_theta);
}
