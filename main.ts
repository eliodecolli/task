import {Tokenizer} from "./core/tokenizer";
import Parser from './core/parser'

const formula = "12+10.2*(3+3)+sin(30)";


let tokenizer = new Tokenizer(formula);
let result = tokenizer.tokenize();

let pr = new Parser(result);

let parsed = pr.parse(0);


console.log(parsed);