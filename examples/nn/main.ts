/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';

import { NeuralNetwork, random } from '../../src/limitless';

const nn = new NeuralNetwork([2, 10, 10, 10, 1]);
let lrSlider: p5.Element;
const numPoints = 15;
const resolution = 10;
const tpf = 1000;

type Data = { inputs: [number, number]; targets: [number] }[];
const trainingData: Data = [];
for (let i = 0; i < numPoints; i++) {
  trainingData.push({
    inputs: [random(1), random(1)],
    targets: [i % 2]
  });
}

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400);
    lrSlider = p.createSlider(0.001, 0.5, 0.05, 0.01);
  };

  p.draw = () => {
    p.background(0);

    nn.setLearnRate(lrSlider.value() as number);

    for (let i = 0; i < tpf; i++) {
      const data = p.random(trainingData);
      nn.train(data.inputs, data.targets);
    }

    const cols = p.width / resolution;
    const rows = p.height / resolution;
    p.noStroke();
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x1 = i / cols;
        const x2 = j / rows;
        const inputs = [x1, x2];
        const y = nn.predict(inputs)[0] || 0;

        p.fill(y * 255);
        p.rect(i * resolution, j * resolution, resolution, resolution);
      }
    }

    trainingData.forEach(({ inputs, targets }) => {
      if (targets[0] === 1) p.fill(96, 155, 255);
      else p.fill(255, 165, 94);
      p.ellipse(inputs[0] * p.width, inputs[1] * p.height, 8);
    });

    p.fill(0, 0, 255);
    p.textSize(20);
    p.textAlign(p.LEFT, p.TOP);
    p.text(p.frameCount, 0, 0);
  };
});
