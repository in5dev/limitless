import { vec3 } from '../../math/index.js';

export enum ReflectionType {
  DIFFUSE,
  SPECULAR,
  REFRACTIVE
}

export default class Material {
  constructor(
    public reflectionType = ReflectionType.DIFFUSE,
    public indexOfRefraction = 1,
    public emission = vec3()
  ) {}

  static SOLID = new Material();
  static MIRROR = new Material(ReflectionType.SPECULAR);
  static WATER = new Material(ReflectionType.REFRACTIVE, 1.33);
  static GLASS = new Material(ReflectionType.REFRACTIVE, 1.52);
  static LIGHT = new Material(ReflectionType.DIFFUSE, 1, vec3(12));
}
