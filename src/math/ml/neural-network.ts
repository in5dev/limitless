/* eslint-disable @typescript-eslint/naming-convention */
import Matrix from '../matrix';

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function dsigmoid(y: number): number {
  // sigmoid(x) * (1 - sigmoid(x))
  return y * (1 - y);
}

/* This creates a Neural Network with a certain amount
of input, hidden, and output layer neurons and it
trains through supervised learning */
export default class NeuralNetwork {
  weights_ih = Matrix.random(this.hidden_nodes, this.input_nodes);
  weights_ho = Matrix.random(this.output_nodes, this.hidden_nodes);

  bias_h = Matrix.random(this.hidden_nodes, 1);
  bias_o = Matrix.random(this.output_nodes, 1);

  learning_rate = 0.01;

  constructor(
    readonly input_nodes: number,
    readonly hidden_nodes: number,
    readonly output_nodes: number
  ) {}

  predict(input_array: number[]): number[] {
    // Processing the hidden layer outputs
    const inputs = Matrix.fromArray(input_array);
    const hidden = Matrix.mult(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    hidden.map(sigmoid); // Activation function

    // Processing the output layer outputs
    const output = Matrix.mult(this.weights_ho, hidden);
    output.add(this.bias_o);
    output.map(sigmoid); // Activation function

    // Outputting the guess of the network
    return output.toArray();
  }

  train(input_array: number[], target_array: number[]): void {
    const inputs = Matrix.fromArray(input_array);

    // Processing the hidden layer outputs
    const hidden = Matrix.mult(this.weights_ih, inputs);
    hidden.add(this.bias_h);
    hidden.map(sigmoid); // Activation function

    // Processing the output layer outputs
    const outputs = Matrix.mult(this.weights_ho, hidden);
    outputs.add(this.bias_o);
    outputs.map(sigmoid); // Activation function

    // Convert to matrices
    const targets = Matrix.fromArray(target_array);

    // BACK PROPAGATION
    // OUTPUT LAYER
    // Calculate errors
    const output_errors = Matrix.sub(targets, outputs);

    // Calculate gradients
    const gradients = Matrix.map(outputs, dsigmoid);
    gradients.mult(output_errors);
    gradients.mult(this.learning_rate);

    // Calculate deltas
    const hidden_T = Matrix.transpose(hidden);
    const weight_ho_deltas = Matrix.mult(gradients, hidden_T);

    // Adjust weights by deltas
    this.weights_ho.add(weight_ho_deltas);
    this.bias_o.add(gradients);

    // HIDDEN LAYER
    // Calculate errors
    const who_t = Matrix.transpose(this.weights_ho);
    const hidden_errors = Matrix.mult(who_t, output_errors);

    // Calculate gradient
    const hidden_gradient = Matrix.map(hidden, dsigmoid);
    hidden_gradient.mult(hidden_errors);
    hidden_gradient.mult(this.learning_rate);

    // Calculate deltas
    const inputs_T = Matrix.transpose(inputs);
    const weight_ih_deltas = Matrix.mult(hidden_gradient, inputs_T);

    // Adjust weights by deltas
    this.weights_ih.add(weight_ih_deltas);
    this.bias_h.add(hidden_gradient);
  }
}
