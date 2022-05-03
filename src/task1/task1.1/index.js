import { Transform } from "stream";
import { stdin as input, stdout as output } from "node:process";

class TransformInput extends Transform {
  _transform(chunk, encoding, callback) {
    const result = chunk.toString().split("").reverse().join("").trim();
    callback(null, result);
  }
}

const transformInput = new TransformInput();

input.pipe(transformInput).on("error", console.error).pipe(output);
