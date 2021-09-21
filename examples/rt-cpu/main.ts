import { Camera, RayTracer, Scene, Sphere } from '../../src/gfx/rt';
import { ReflectionType } from '../../src/gfx/rt/sphere';
import { vec3 } from '../../src/math';

const camera = new Camera(vec3(50, 52, 295.6), vec3(0, -0.042612, -1), 0.5135);

const scene = new Scene();
scene.add(
  ...[
    new Sphere(
      vec3(1e5 + 1, 40.8, 81.6),
      1e5,
      vec3(0.75, 0.25, 0.25),
      ReflectionType.DIFFUSE
    ), // Left
    new Sphere(
      vec3(-1e5 + 99, 40.8, 81.6),
      1e5,
      vec3(0.25, 0.25, 0.75),
      ReflectionType.DIFFUSE
    ), // Right
    new Sphere(
      vec3(50, 40.8, 1e5),
      1e5,
      vec3(0.75, 0.75, 0.75),
      ReflectionType.DIFFUSE
    ), // Back
    new Sphere(vec3(50, 40.8, -1e5 + 170), 1e5, vec3(), ReflectionType.DIFFUSE), // Front
    new Sphere(
      vec3(50, 1e5, 81.6),
      1e5,
      vec3(0.75, 0.75, 0.75),
      ReflectionType.DIFFUSE
    ), // Bottom
    new Sphere(
      vec3(50, -1e5 + 81.6, 81.6),
      1e5,
      vec3(0.75, 0.75, 0.75),
      ReflectionType.DIFFUSE
    ), // Top
    new Sphere(
      vec3(27, 16.5, 47),
      16.5,
      vec3(1, 1, 1),
      ReflectionType.SPECULAR
    ), // Mirror
    new Sphere(
      vec3(73, 16.5, 78),
      16.5,
      vec3(1, 1, 1),
      ReflectionType.REFRACTIVE
    ), // Glass
    new Sphere(
      vec3(50, 681.6 - 0.27, 81.6),
      600,
      vec3(),
      ReflectionType.DIFFUSE,
      vec3(12, 12, 12)
    ) // Light
  ]
);

const raytracer = new RayTracer(scene, camera, 100);
raytracer.render();
