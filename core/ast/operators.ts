import INode from './node'

class Operator implements INode {

    private _op1: number;
    private _op2: number;
    
    public get op1(): number {
        return this._op1;
    }

    public get op2(): number {
        return this._op2;
    }

    get priority(): number{
        return 0;
    }

    constructor(op1: number, op2: number) {
        this._op1 = op1;
        this._op2 = op2;
    }

    evaluate(): number {
        return 0;   // to be overriden
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

const Operators: {[id:string]: (op1: number, op2: number) => Operator} = {
    '+': (a, b) => new Add(a, b),
    '-': (a, b) => new Subtract(a, b),
    '*': (a, b) => new Multiply(a, b),
    '/': (a, b) => new Divide(a, b)
};

export default Operators;