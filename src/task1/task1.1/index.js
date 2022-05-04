import InputTransformer from "./inputTransformer.mjs";
import { inputReverseTransform } from "./inpurReverseTransform.mjs";

const inputTransformer = new InputTransformer(inputReverseTransform);

inputTransformer.init();
