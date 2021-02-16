#version 300 es
precision highp float;

in vec2 f_position;

out vec4 color;

void main() {
    color = vec4(f_position, 0.0, 1.0);
}