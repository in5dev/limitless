/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Layer from './layer.ts';

export default class NeuralNetwork {
  layers: Layer[] = [];
  learningRate = 0.01;

  constructor(nodes: [number, ...number[], number]) {
    for (let i = 1; i < nodes.length; i++) {
      const layerNodes = nodes[i]!;
      const inputNodes = nodes[i - 1]!;
      this.layers.push(new Layer(layerNodes, inputNodes));
    }
  }

  predict(inputArray: number[]): number[] {
    let outputs = [...inputArray];
    this.layers.forEach(layer => (outputs = layer.predict(outputs)));
    return outputs;
  }

  train(inputArray: number[], targets: number[]): void {
    const { layers, learningRate } = this;
    this.predict(inputArray);
    let errors: number[] | undefined;
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i]!;
      layer.train(targets, learningRate, errors);
    }
  }
}
