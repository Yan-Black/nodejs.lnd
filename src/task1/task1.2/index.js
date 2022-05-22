import csv from "csvtojson";
import { fileURLToPath } from "url";
import { createReadStream, createWriteStream } from "node:fs";
import { jsonKeysTransform } from "./jsonKeysTransform";
import { pipeline } from "stream";

const csvFilePath = fileURLToPath(
  new URL("../../../src/task1/task1.2/csv/data.csv", import.meta.url)
);
const txtFilePath = fileURLToPath(new URL("data.txt", import.meta.url));

const readableStream = createReadStream(csvFilePath);
const writableStream = createWriteStream(txtFilePath);

pipeline(readableStream, csv(), jsonKeysTransform, writableStream, (error) => {
  if (error) {
    console.error(error.message);
    return;
  }

  console.log("csv has been processed");
  process.exit();
});
