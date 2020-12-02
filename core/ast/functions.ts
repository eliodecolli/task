import { TokenType } from '../tokenizer';
import {INode} from './node'

class Function implements INode {
    evaluate(): number {
        return  0;
    }

    get priority(): number{
        return 3;   // functions are supposed to have higher precedence
    }

    children: INode[] = [];

    type: TokenType = TokenType.Character;
}

class Sine extends Function {
    evaluate(): number {
        return Math.sin(this.children[0].evaluate());
    }
}

class Cosine extends Function {
    evaluate(): number {
        return Math.cos(this.children[0].evaluate());
    }
}

class Max extends Function {
    evaluate(): number {
        let args: number[] = [];

        this.children.forEach(x => args.push(x.evaluate()));
        return Math.max(...args);
    }
}

const Functions: {[id:string]: () => Function} = {
    'sin': () => new Sine(),
    'cos': () => new Cosine(),
    'max': () => new Max()
}

export default Functions;