import { TokenType } from "../tokenizer";

interface INode{
    children: INode[];
    evaluate(): number;

    type: TokenType;
}


// default Node implementation is a variable
class Variable implements INode {
    private val: number;

    constructor(val: number) {
        this.val = val;
    }

    evaluate(): number {
        return this.val;
    }

    children: INode[] = [];

    type: TokenType = TokenType.Variable;
}

class Comma implements INode {
    evaluate(): number {
        return 0;
    }

    children: INode[] = [];

    type: TokenType = TokenType.Comma;
}

export {INode, Variable, Comma};