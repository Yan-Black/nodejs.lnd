import csv from "csvtojson";
import { fileURLToPath } from "url";
import { createReadStream, createWriteStream } from "node:fs";

const csvFilePath = fileURLToPath(new URL("csv/data.csv", import.meta.url));
const txtFilePath = fileURLToPath(new URL("txt/data.txt", import.meta.url));

const readableStream = createReadStream(csvFilePath);
const writableStream = createWriteStream(txtFilePath);

readableStream.pipe(csv()).pipe(writableStream);
