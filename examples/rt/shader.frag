#version 300 es
precision highp float;

out vec4 fragColor;

uniform ivec2 resolution;

struct Ray {
    vec3 origin;
    vec3 direction;
};

struct Sphere {
    vec3 center;
    float radius;
};
uniform Sphere spheres[2];

uniform vec3 light;

uniform int maxReflections;

float intersect(Ray ray, Sphere sphere) {
    vec3 oc = ray.origin - sphere.center;
    float a = dot(ray.direction, ray.direction);
    float b = 2.0 * dot(oc, ray.direction);
    float c = dot(oc, oc) - (sphere.radius * sphere.radius);
    float disc = b * b - 4.0 * a * c;
    if (disc < 0.0) return -1.0;
    return (-b - sqrt(disc)) / (2.0 * a);
}

void main() {
    vec2 uv = gl_FragCoord.xy / vec2(resolution);
    Ray ray = Ray(vec3(0.0), normalize(vec3(uv - vec2(0.5), -1.0)));
    
    vec3 diffuse = vec3(0.0);
    for (int i = 0; i < maxReflections; i++) {
        float inf = 1.0e6;
        float m = inf;
        vec3 hit = vec3(0.0);
        vec3 normal = vec3(0.0);
        for (int j = 0; j < 2; j++) {
            Sphere sphere = spheres[j];
            float t = intersect(ray, sphere);
            if (t > 0.0) {
                m = min(t, m);
                hit = ray.origin + ray.direction * t;
                normal = normalize(hit - sphere.center);
            }
        }
        if (m == inf) break;
        vec3 toLight = normalize(light - hit);
        diffuse += vec3(max(dot(normal, toLight), 0.0));
        ray = Ray(hit, reflect(ray.direction, normal));
    }
    fragColor = vec4(diffuse / float(maxReflections), 1.0);
}