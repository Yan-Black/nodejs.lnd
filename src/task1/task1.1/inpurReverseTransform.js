import { Transform } from "stream";

class InputReverseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    const result = chunk.toString().split("").reverse().join("").trim();
    callback(null, `${result}\n`);
  }
}

const inputReverseTransform = new InputReverseTransform();

export { inputReverseTransform };
