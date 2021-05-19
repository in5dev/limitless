/* eslint-disable new-cap */
/* eslint-disable no-new */
import p5 from 'p5';

import { NeuralNetwork, random } from '../../src';

const nn = new NeuralNetwork([2, 10, 10, 10, 1]);
let lr_slider: p5.Element;
let numPoints = 15;
let resolution = 10;
let tpf = 1000;

type Data = { inputs: number[]; targets: number[] }[];
let training_data: Data = [];
for (let i = 0; i < numPoints; i++) {
  training_data.push({
    inputs: [random(1), random(1)],
    targets: [i % 2]
  });
}

new p5((p: p5) => {
  p.setup = () => {
    p.createCanvas(400, 400);
    lr_slider = p.createSlider(0.001, 0.5, 0.05, 0.01);
  };

  p.draw = () => {
    p.background(0);

    nn.setLearnRate(lr_slider.value() as number);

    for (let i = 0; i < tpf; i++) {
      let data = training_data.random();
      nn.train(data.inputs, data.targets);
    }

    let cols = p.width / resolution;
    let rows = p.height / resolution;
    p.noStroke();
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x1 = i / cols;
        let x2 = j / rows;
        let inputs = [x1, x2];
        let y = nn.predict(inputs)[0];

        p.fill(y * 255);
        p.rect(i * resolution, j * resolution, resolution, resolution);
      }
    }

    training_data.forEach(({ inputs, targets }) => {
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
