import InputTransformer from "./inputTransformer.js";
import { inputReverseTransform } from "./inpurReverseTransform.js";

const inputTransformer = new InputTransformer(inputReverseTransform);

inputTransformer.init();
