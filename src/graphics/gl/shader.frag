#version 300 es
precision highp float;

in vec3 dir;
in vec3 norm;

out vec4 color;

void main() {
    vec3 normal = normalize(norm);
    float d = dot(normal, -dir);
    color = vec4(vec3(d), 1.0);
}