export default class InputTransformer {
  constructor(input, output, transformer) {
    this.input = input;
    this.output = output;
    this.transformer = transformer;
  }

  static onError(error) {
    console.error(error.message || error);
  }

  init() {
    if (!this.input.pipe || !this.transformer.pipe || !this.output.pipe) {
      console.warn(
        "input, transformer and output must be of stream type and has pipe method"
      );

      return;
    }

    this.input
      .pipe(this.transformer)
      .on("error", InputTransformer.onError)
      .pipe(this.output);
  }
}
