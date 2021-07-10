/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Matrix from '../math/matrix';
import { dsigmoid, sigmoid } from './functions';

export default class Layer {
  weights: Matrix;
  biases: Matrix;

  learningRate = 0.01;

  inputArray: number[] = [];
  outputs: number[] = [];

  constructor(readonly nodes: number, readonly inputNodes: number) {
    this.weights = Matrix.random(nodes, inputNodes);
    this.biases = Matrix.random(nodes, 1);
  }

  predict(inputArray: number[]): number[] {
    const inputs = Matrix.fromArray(inputArray);
    const outputs = Matrix.mult(this.weights, inputs);
    outputs.add(this.biases);
    outputs.map(sigmoid);

    this.outputs = outputs.toArray();
    this.inputArray = inputArray;
    return this.outputs;
  }

  train(targets: number[], errorArray?: number[]): number[] {
    const outputsMat = Matrix.fromArray(this.outputs);
    const errors = errorArray
      ? Matrix.fromArray(errorArray)
      : Matrix.sub(Matrix.fromArray(targets), outputsMat);

    const gradients = Matrix.map(outputsMat, dsigmoid)
      .mult(errors)
      .mult(this.learningRate);

    const inputs = Matrix.transpose(Matrix.fromArray(this.inputArray));
    const deltas = Matrix.mult(gradients, inputs);

    this.weights.add(deltas);
    this.biases.add(gradients);

    return errors.toArray();
  }
}
