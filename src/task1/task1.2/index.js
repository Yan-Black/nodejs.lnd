import csv from "csvtojson";
import { fileURLToPath } from "url";

const csvFilePath = fileURLToPath(new URL("csv/data.xlsx", import.meta.url));

csv()
  .fromFile(csvFilePath)
  .then((jsonArrayObj) => {
    //when parse finished, result will be emitted here.
    console.log(jsonArrayObj);
  });
