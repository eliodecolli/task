import Parser from "./parser";
import { Tokenizer } from "./tokenizer";

class ExpressionEvaluator {

    private _lastError: string | undefined;

    public get lastError(): string | undefined {    // influenced by WinAPI :)
        return this._lastError;
    }

    constructor() {
        this._lastError = undefined;
    }

    evaluate(expression: string) : number | undefined {
        try{
            let tokenizer = new Tokenizer(expression);

            let parser = new Parser(tokenizer.tokenize());
            let expTree = parser.parse();

            let retval = expTree.evaluate();
            this._lastError = undefined;
            return retval;
        }
        catch(e) {
            this._lastError = e;
            return undefined;
        }
    }
}

export default ExpressionEvaluator;