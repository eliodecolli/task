import INode from './node'

class Function implements INode{

    private args: number[] = [];

    public get arguments(): number[] {
        return this.args;
    }

    constructor(args: number[]){
        this.args = args;
    }

    evaluate(): number {
        return  0;
    }

    children: INode[] = [];
}

class Sine extends Function {

    constructor(args: number[]) {
        if(args.length > 1) {
            throw new Error(`Sine functions expect a single argument.`);
        }

        super(args);
    }

    evaluate(): number {
        return Math.sin(this.arguments[0]);
    }
}

class Cosine extends Function {

    constructor(args: number[]) {
        if(args.length != 1) {
            throw new Error(`Cosine functions expect a single argument.`);
        }

        super(args);
    }

    evaluate(): number {
        return Math.cos(this.arguments[0]);
    }
}

const Functions: {[id:string]: (args: number[]) => Function} = {
    'sin': a => new Sine(a),
    'cos': a => new Cosine(a)
}

export default Functions;