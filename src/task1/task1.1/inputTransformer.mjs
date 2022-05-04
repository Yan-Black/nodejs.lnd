import { stdin as input, stdout as output } from "node:process";

export default class InputTransformer {
  constructor(transformer) {
    this._input = input;
    this._output = output;
    this.transformer = transformer;
  }

  static onError(error) {
    console.error(error.message || error);
  }

  init() {
    if (!this._input || !this._output) {
      return;
    }

    if (
      !this.transformer._transform ||
      typeof this.transformer._transform !== "function"
    ) {
      console.warn(
        "transformer must implement Stream.Transfrom._transform method"
      );

      return;
    }

    this._input
      .pipe(this.transformer)
      .on("error", InputTransformer.onError)
      .pipe(this._output);
  }
}
