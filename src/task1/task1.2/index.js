import csv from "csvtojson";
import { fileURLToPath } from "url";
import { createReadStream, createWriteStream } from "node:fs";
import { jsonKeysTransform } from "./jsonKeysTransform";

const csvFilePath = fileURLToPath(
  new URL("../../../src/task1/task1.2/csv/data.csv", import.meta.url)
);
const txtFilePath = fileURLToPath(new URL("data.txt", import.meta.url));

const readableStream = createReadStream(csvFilePath);
const writableStream = createWriteStream(txtFilePath);

readableStream
  .pipe(csv())
  .on("error", console.error)
  .pipe(jsonKeysTransform)
  .on("error", console.error)
  .pipe(writableStream)
  .on("error", console.error)
  .on("finish", () => {
    console.log("csv has been processed");
    process.exit();
  });
