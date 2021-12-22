import GL from '../../src/gfx/lib/gl';
import { vec3 } from '../../src/math';

const gl = new GL().fullscreen().background(0, 0, 0);

gl.Camera(Math.PI / 3);
gl.DirectionalLight(vec3(0, 0, -1));

const boxes = new Array(10);
for (let i = 0; i < 10; i++) {
  const box = gl.Box();
  box.position.set(i * 2, 0, -10 - i * 4);
  boxes[i] = box;
}

gl.animate(() => {
  boxes.forEach(box => box.rotation.add(0.01, 0.02, 0.03));
});
