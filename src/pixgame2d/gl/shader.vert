#version 300 es
precision highp float;

in vec2 position;
in vec2 uv;

out vec2 uvCoords;

uniform mat3 modelViewMatrix;
uniform mat3 projectionMatrix;

void main() {
    uvCoords = uv;
    mat3 matrix = projectionMatrix * modelViewMatrix;
    vec3 pos = matrix * vec3(position, 1.0);
    gl_Position = vec4(pos, 1.0);
}