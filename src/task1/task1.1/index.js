import { Transform } from "stream";
import { stdin as input, stdout as output } from "node:process";
import InputTransformer from "./inputTransformer.mjs";

class InputReverseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    const result = chunk.toString().split("").reverse().join("").trim();
    callback(null, result);
  }
}

const inputReverseTransform = new InputReverseTransform();
const inputTransformer = new InputTransformer(
  input,
  output,
  inputReverseTransform
);

inputTransformer.init();
