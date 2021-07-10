#version 300 es
precision highp float;

in vec2 uvCoords;

out vec4 color;

uniform sampler2D sprite;

void main() {
    color = texture(sprite, uvCoords);
}