#version 300 es
precision highp float;

in vec2 position;

out vec2 f_position;

void main() {
    f_position = position;
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = 10.0;
}