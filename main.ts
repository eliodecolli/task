import {Tokenizer} from "./core/tokenizer";
import Parser from './core/parser'

const formula = "2 * (10 / (3+2.00000001))";


let tokenizer = new Tokenizer(formula);
let result = tokenizer.tokenize();

let parser = new Parser(result);
let parsed = parser.parse();

//let tree = parser.createTree([new Variable(1), new Variable(2), new Variable(3), Operators['*'](), Operators['+']()]);
console.log(parsed);
console.log(parsed.evaluate());