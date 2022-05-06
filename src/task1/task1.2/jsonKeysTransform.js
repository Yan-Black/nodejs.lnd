import { Transform } from "stream";

class JSONKeysTransform extends Transform {
  _transform(chunk, encoding, callback) {
    try {
      const tempObj = JSON.parse(chunk.toString());
      const processedObj = Object.keys(tempObj).reduce(
        (processed, upperCaseKey) => {
          const lowerCaseKey = upperCaseKey.toLowerCase();
          processed[lowerCaseKey] = tempObj[upperCaseKey];

          return processed;
        },
        {}
      );

      callback(null, `${JSON.stringify(processedObj)}\n`);
    } catch (error) {
      throw error;
    }
  }
}

const jsonKeysTransform = new JSONKeysTransform();

export { jsonKeysTransform };
