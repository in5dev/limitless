#version 300 es
precision highp float;

#define INFINTY 1.0e6
#define EPSILON 0.0001

out vec4 fragColor;

uniform vec2 resolution;

struct AmbientLight {
    vec3 color;
    float intensity;
};
uniform AmbientLight ambientLight;

struct PointLight {
    vec3 position;
    vec3 color;
    float intensity;
};
uniform PointLight pointLight;

struct Material {
    vec3 color;
    float shininess;
    float reflectivity;
};

struct Sphere {
    vec3 center;
    float radius;
    Material material;
};
#define SPHERES 2
uniform Sphere spheres[SPHERES];

struct Plane {
    vec3 position;
    vec3 normal;
    Material material;
};
#define PLANES 1
uniform Plane planes[PLANES];

uniform int maxReflections;

struct Ray {
    vec3 origin;
    vec3 direction;
};

float hitPlane(Ray ray, Plane plane) {
    float denom = dot(ray.direction, plane.normal);
    if (abs(denom) < EPSILON) return -1.0;
    float t = dot(plane.position - ray.origin, plane.normal) / denom;
    if (t < EPSILON) return -1.0;
    return t;
}

float hitSphere(Ray ray, Sphere sphere) {
    vec3 oc = ray.origin - sphere.center;
    float a = dot(ray.direction, ray.direction);
    float b = 2.0 * dot(oc, ray.direction);
    float c = dot(oc, oc) - sphere.radius * sphere.radius;
    float discriminant = b * b - 4.0 * a * c;
    if (discriminant < 0.0) return -1.0;

    float t = (-b - sqrt(discriminant)) / (2.0 * a);
    if (t < EPSILON) t = (-b + sqrt(discriminant)) / (2.0 * a);
    if (t < EPSILON) return -1.0;
    return t;
}

struct Hit {
    float t;
    vec3 position;
    vec3 normal;
    Material material;
};

Hit trace(Ray ray) {
    Hit hit = Hit(INFINTY, vec3(0.0), vec3(0.0), Material(vec3(0.0), 0.0, 0.0));

    for (int i = 0; i < SPHERES; i++) {
        Sphere sphere = spheres[i];
        float t = hitSphere(ray, sphere);
        if (t > 0.0) {
            hit.t = min(hit.t, t);
            hit.position = ray.origin + ray.direction * hit.t;
            hit.normal = normalize(hit.position - sphere.center);
            hit.material = sphere.material;
        }
    }
    for (int i = 0; i < PLANES; i++) {
        Plane plane = planes[i];
        float t = hitPlane(ray, plane);
        if (t > 0.0) {
            hit.t = min(hit.t, t);
            hit.material = plane.material;
            hit.normal = plane.normal;
        }
    }
    hit.position = ray.origin + ray.direction * hit.t;

    if (hit.t == INFINTY) hit.t = -1.0;
    return hit;
}

vec3 phong(Ray ray, Hit hit) {
    vec3 normal = hit.normal;
    vec3 lightDir = normalize(pointLight.position - hit.position);
    vec3 viewDir = -ray.direction;
    vec3 reflectDir = reflect(-lightDir, normal);

    Ray shadowRay = Ray(hit.position + hit.normal * EPSILON, lightDir);
    Hit shadowHit = trace(shadowRay);
    float shadow = shadowHit.t > 0.0 ? 0.0 : 1.0;

    vec3 ambient = ambientLight.color * ambientLight.intensity;
    float diffuse = max(dot(lightDir, normal), 0.0);
    float specular = pow(max(dot(viewDir, reflectDir), 0.0), hit.material.shininess);

    return hit.material.color * (ambient + pointLight.color * pointLight.intensity * (diffuse + specular) * shadow);
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.x;
    Ray ray = Ray(vec3(0.0), normalize(vec3(uv - vec2(0.5), -1.0)));
    
    vec3 color = vec3(0.0);
    float reflectivity = 1.0;
    for (int i = 0; i < maxReflections + 1; i++) {
        Hit hit = trace(ray);
        if (hit.t < 0.0) break;
        color += phong(ray, hit) * reflectivity;
        reflectivity *= hit.material.reflectivity;
        // Slight offset to remove graininess
        ray = Ray(hit.position + hit.normal * EPSILON, reflect(ray.direction, hit.normal));
    }
    fragColor = vec4(color / float(maxReflections + 1), 1.0);
}