#version 300 es
precision highp float;

in vec3 dir;
in vec3 norm;

out vec4 color;

void main() {
    vec3 normal = normalize(norm);
    float d = dot(normal, -dir);
    if (d < 0.1) d = 0.05;
    color = vec4(vec3(d), 1.0);
}