import notes from './notes.js';

let ctx: AudioContext | undefined;

export default class Note {
  readonly frequency: number;
  private osc?: OscillatorNode;

  constructor(name: keyof typeof notes, private wave: OscillatorType = 'sine') {
    this.frequency = notes[name];
  }

  play(): void {
    if (!ctx) ctx = new AudioContext();
    if (!this.osc) {
      const osc = ctx.createOscillator();
      osc.type = this.wave;
      osc.frequency.value = this.frequency;
      osc.connect(ctx.destination);
      this.osc = osc;
    }
    this.osc.start();
  }

  stop(): void {
    this.osc?.stop();
  }
}
