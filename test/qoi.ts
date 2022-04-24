import { writeFile } from 'node:fs/promises';
import axios from 'axios';
import { createCanvas, createImageData } from 'canvas';

// eslint-disable-next-line import/no-relative-packages
import { decode } from '../src/formats/qoi';

const url = 'https://github.com/floooh/qoiview/raw/main/images/baboon.qoi';
axios.get<Buffer>(url, { responseType: 'arraybuffer' }).then(response => {
  const bytes = new Uint8Array(response.data);
  const { width, height, pixels } = decode(bytes);

  const canvas = createCanvas(width, height);
  const data = new Uint8ClampedArray(
    pixels.flatMap(({ r, g, b, a }) => [r, g, b, a])
  );
  const image = createImageData(data, width, height);
  const ctx = canvas.getContext('2d');
  ctx.putImageData(image, 0, 0);

  return writeFile('baboon.png', canvas.toBuffer());
});
