import { Sphere, Camera, createRayTracer, Material } from '../../src/gfx/rt';
import { vec3 } from '../../src/math';

const camera = new Camera(vec3(50, 52, 295.6), vec3(0, -0.042612, -1), 0.5135);
const tracer = await createRayTracer(camera);

tracer.add(
  new Sphere(vec3(1e4 + 1, 40.8, 81.6), 1e4, vec3(0.75, 0.25, 0.25)), // Left
  new Sphere(vec3(-1e4 + 99, 40.8, 81.6), 1e4, vec3(0.25, 0.25, 0.75)), // Right
  new Sphere(vec3(50, 40.8, 1e4), 1e4, vec3(0.75, 0.75, 0.75)), // Back
  new Sphere(vec3(50, 40.8, -1e4 + 170), 1e4, vec3(1, 0, 1)), // Front
  new Sphere(vec3(50, 1e4, 81.6), 1e4, vec3(0.75, 0.75, 0.75)), // Bottom
  new Sphere(vec3(50, -1e4 + 81.6, 81.6), 1e4, vec3(0.75, 0.75, 0.75)), // Top
  new Sphere(vec3(27, 16.5, 47), 16.5, vec3(1, 1, 1), Material.MIRROR), // Mirror
  new Sphere(vec3(73, 16.5, 78), 16.5, vec3(1, 1, 1), Material.GLASS), // Glass
  new Sphere(vec3(50, 681.6 - 0.27, 81.6), 600, vec3(), Material.LIGHT) // Light
);
tracer.animate(100);
