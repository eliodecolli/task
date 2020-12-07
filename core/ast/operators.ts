import {INode} from './node'
import {TokenType} from '../tokenizer'

class Operator implements INode {

    evaluate(): number {
        return 0;   // to be overriden
    }

    get priority(): number{
        return 0;
    }

    private _tokenVal: string = "";

    public get tokenVal(): string {
        return this._tokenVal;
    }

    children: INode[] = [];

    type: TokenType = TokenType.Operator;
}

class Add extends Operator {
    evaluate() : number {
        return this.children[1].evaluate() + this.children[0].evaluate();
    }
}

class Subtract extends Operator {
    public get tokenVal(): string {
        return '-';
    }

    evaluate(): number {
        return this.children[1].evaluate() - this.children[0].evaluate();
    }
}

class Multiply extends Operator {
    evaluate(): number {
        return this.children[1].evaluate() * this.children[0].evaluate();
    }

    get priority(): number {
        return 1;
    }
}

class Divide extends Operator { 
    evaluate(): number {
        return this.children[1].evaluate() / this.children[0].evaluate();
    }

    get priority(): number {
        return 1;
    }
}

class LParen extends Operator {
    evaluate(): number {
        throw new Error("Cannot call evaluate() on a parenthesis.");
    }

    get tokenVal(): string {
        return '(';
    }

    get priority(): number {
        return -1;
    }

    type = TokenType.LParen;
}

class RParen extends LParen {
    get tokenVal(): string {
        return ')';
    }

    type = TokenType.RParen;
}

const Operators: {[id:string]: () => Operator} = {
    '+': () => new Add(),
    '-': () => new Subtract(),
    '*': () => new Multiply(),
    '/': () => new Divide(),
    '(': () => new LParen(),
    ')': () => new RParen()
};

export {Operator};
export default Operators;