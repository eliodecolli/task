import {Tokenizer} from "./core/tokenizer";
import Parser from './core/parser'

const formula = "sin(max(2, 3)+sin(45))";


let tokenizer = new Tokenizer(formula);
let result = tokenizer.tokenize();

let parser = new Parser(result);
let parsed = parser.parse();

console.log(result);