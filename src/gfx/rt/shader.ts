export default `#version 300 es
precision highp float;

#define INFINTY 1.0e6
#define EPSILON 0.01
#define PI 3.1415926535897932384626433832795

out vec4 fragColor;

uniform vec2 resolution;
uniform float passes;

uniform sampler2D tex;

struct Camera {
    vec3 origin;
    vec3 direction;
    float fov;
};
uniform Camera camera;

struct Material {
    int reflectionType;
    float indexOfRefraction;
    vec3 emission;
};
struct Sphere {
    vec3 center;
    float radius;
    vec3 color;
    Material material;
};
#define SPHERES 9
uniform Sphere spheres[SPHERES];

struct Ray {
    vec3 origin;
    vec3 direction;
};

uniform float time;

float rand(inout float seed) {
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt = dot(gl_FragCoord.xy, vec2(a, b));
    float sn = mod(dt, 3.14);
    float r = fract(sin(sn + time + seed) * c);
    seed += 1.0;
    return r;
}

float intersect_sphere(Ray ray, Sphere sphere) {
    vec3 op = sphere.center - ray.origin;
    float b = dot(op, ray.direction);
    float det = b * b - dot(op, op) + sphere.radius * sphere.radius;
    if (det < 0.0) return 0.0;
    det = sqrt(det);
    float t;
    return (t = b - det) > EPSILON ? t : (t = b + det) > EPSILON ? t : 0.0;
}

struct Hit {
    float t;
    Sphere sphere;
    vec3 normal;
};
Hit intersect(Ray ray) {
    Hit closest = Hit(INFINTY, spheres[0], vec3(0.0));
    for (int i = 0; i < SPHERES; i++) {
        Sphere sphere = spheres[i];
        float d = intersect_sphere(ray, sphere);
        if (d != 0.0 && d < closest.t) {
            closest.t = d;
            closest.sphere = sphere;
        }
    }
    closest.normal = normalize(ray.origin + closest.t * ray.direction - closest.sphere.center);
    return closest;
}


float reflectance0(float n1, float n2) {
    float sqrt_R0 = (n1 - n2) / (n1 + n2);
    return sqrt_R0 * sqrt_R0;
}

float schlick_reflectance(float n1, float n2, float c) {
    float R0 = reflectance0(n1, n2);
    return R0 + (1.0 - R0) * c * c * c * c * c;
}

struct Transmit {
    vec3 dTr;
    float pr;
};
Transmit specular_transmit(
    vec3 d,
    vec3 n,
    float n_out,
    float n_in,
    inout float seed
) {
    vec3 d_Re = reflect(d, n);

    bool out_to_in = dot(n, d) < 0.0;
    vec3 nl = out_to_in ? n : -n;
    float nn = out_to_in ? n_out / n_in : n_in / n_out;
    float cos_theta = dot(d, nl);
    float cos2_phi = 1.0 - nn * nn * (1.0 - cos_theta * cos_theta);

    // Total Internal Reflection
    if (cos2_phi < 0.0) return Transmit(d_Re, 1.0);

    vec3 d_Tr = normalize(d * nn - nl * (nn * cos_theta + sqrt(cos2_phi)));
    float c = 1.0 - (out_to_in ? -cos_theta : dot(d_Tr, n));

    float Re = schlick_reflectance(n_out, n_in, c);
    float p_Re = 0.25 + 0.5 * Re;
    if (rand(seed) < p_Re) return Transmit(d_Re, Re / p_Re);
    
    float Tr = 1.0 - Re;
    float p_Tr = 1.0 - p_Re;
    return Transmit(d_Tr, Tr / p_Tr);
}

vec3 cosine_weighted_sample_on_hemisphere(float u1, float u2) {
  float cos_theta = sqrt(1.0 - u1);
  float sin_theta = sqrt(u1);
  float phi = 2.0 * PI * u2;
  return vec3(cos(phi) * sin_theta, sin(phi) * sin_theta, cos_theta);
}

vec3 radiance(Ray ray, inout float seed) {
    int depth = 0;
    vec3 L = vec3(0.0);
    vec3 F = vec3(1.0);

    while (true) {
        if (depth > 600) break;
        Hit hit = intersect(ray);
        float t = hit.t;
        if (t == INFINTY) return vec3(0.0);
        Sphere sphere = hit.sphere;
        vec3 p = ray.origin + t * ray.direction;
        vec3 n = hit.normal;

        L += F * sphere.material.emission;
        F *= sphere.color;

        if (depth > 4) {
            float continueProbability = max(sphere.color.x, max(sphere.color.y, sphere.color.z));
            if (rand(seed) >= continueProbability) return L;
            F /= continueProbability;
        }
        depth++;

        switch (sphere.material.reflectionType) {
            // Diffuse
            case 0: {
                vec3 w = dot(n, ray.direction) < 0.0 ? n : -n;
                vec3 u = normalize(cross(abs(w.x) > 0.1 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0), w));
                vec3 v = cross(w, u);

                vec3 sample_d = cosine_weighted_sample_on_hemisphere(rand(seed), rand(seed));
                vec3 d = normalize(u * sample_d.x + v * sample_d.y + w * sample_d.z);
                ray = Ray(p, d);
                break;
            }
            // Specular
            case 1: {
                vec3 d = reflect(ray.direction, n);
                ray = Ray(p, d);
                break;
            }
            // Refractive
            default: {
                Transmit transmit = specular_transmit(ray.direction, n, 1.0, sphere.material.indexOfRefraction, seed);
                F *= transmit.pr;
                vec3 d = transmit.dTr;
                ray = Ray(p, d);
            }
        }
    }
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float width = resolution.x;
    float height = resolution.y;
    float seed = 0.0;

    vec3 cx = vec3((width * camera.fov) / height, 0.0, 0.0);
    vec3 cy = normalize(cross(cx, camera.direction)) * camera.fov;

    vec2 u2 = vec2(rand(seed), rand(seed));
    vec2 cs = (gl_FragCoord.xy + u2) / resolution - vec2(0.5);
    vec3 d = camera.direction + cs.x * cx + cs.y * cy;
    Ray ray = Ray(camera.origin + d * 130.0, normalize(d));
    vec3 color = radiance(ray, seed);

    color += texture(tex, uv).rgb * passes;
    color /= passes + 1.0;
    fragColor = vec4(color, 1.0);
}`;
