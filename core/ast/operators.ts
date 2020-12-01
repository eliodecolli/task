import {INode} from './node'

class Operator implements INode {

    private _op1: number;
    private _op2: number;
    
    public get op1(): number {
        return this._op1;
    }

    public get op2(): number {
        return this._op2;
    }

    public set op1(val: number) {
        this._op1 = val;
    }

    public set op2(val: number) {
        this._op2 = val;
    }

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
}

class Add extends Operator {
    evaluate() : number {
        return this.op1 + this.op2;
    }
}

class Subtract extends Operator {
    evaluate(): number {
        return this.op1 - this.op2;
    }
}

class Multiply extends Operator {
    evaluate(): number {
        return this.op1 * this.op2;
    }

    get priority(): number {
        return 1;
    }
}

class Divide extends Operator { 
    evaluate(): number {
        return this.op1 / this.op2;
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
}

class RParen extends LParen {
    get tokenVal(): string {
        return ')';
    }
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