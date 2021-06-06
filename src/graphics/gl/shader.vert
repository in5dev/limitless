#version 300 es
precision highp float;

in vec3 position;
in vec3 normal;

uniform vec3 direction;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec3 dir;
out vec3 norm;

void main() {
    dir = direction;
    mat4 matrix = projectionMatrix * modelViewMatrix;
    norm = mat3(matrix) * normal;
    gl_Position = matrix * vec4(position, 1.0);
}