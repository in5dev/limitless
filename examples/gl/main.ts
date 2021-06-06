import GL from '../../src/graphics/gl/gl';
import { vec3 } from '../../src/math';

const gl = new GL().fullscreen().background(0, 0, 0);
gl.Camera(Math.PI / 3);
gl.DirectionalLight(vec3(0, 0, -1));

const boxes = [gl.Box(), gl.Box()];
boxes.forEach((box, i) => {
  box.position.set(i, 0, -10 - i * 4);
});

gl.animate(() => {
  boxes.forEach((box, i) => {
    box.rotation.add(0.01, 0.02, 0.03);
  });
});
