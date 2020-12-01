import {Token, TokenType} from './tokenizer'
import {default as functions} from './ast/functions'
import {default as operators, Operator} from './ast/operators'
import {INode, Variable} from './ast/node'

interface IParser {
    parse(): INode[];
}


class Parser implements IParser {

    private tokens: Token[] = [];

    constructor(tokens: Token[]) {
        this.tokens = tokens;

        // first things first
        if(this.tokens.filter(x => x.type == TokenType.LParen).length != this.tokens.filter(x => x.type == TokenType.RParen).length) {
            throw new Error('Check your parenthesis.');
        }
    }

    private buildStack(): INode[] {
        let stack: INode[] = [];

        let ops: INode[] = [];

        for(let token of this.tokens) {
            
            switch(token.type) {
                case TokenType.Variable: {
                    stack.push(new Variable(parseFloat(token.value)));
                    break;
                }

                case TokenType.Operator: {
                    let cOp = operators[token.value]();
                    if(ops.length > 0) {
                        let top = <Operator>ops[ops.length-1];

                        if(top.priority >= cOp.priority && top.tokenVal !== '(') {
                            stack.push(<INode>ops.pop());
                        }
                    }
                    ops.push(cOp);
                    break;
                }

                case TokenType.LParen: {
                    ops.push(operators['(']());
                    break;
                }

                case TokenType.RParen: {
                    let i = ops.length - 1;
                    while((<Operator>ops[i]).tokenVal !== '(') {
                        stack.push(<INode>ops.pop());
                        i--;
                    }

                    ops.pop();  // remove the last '('
                    break;
                }

                case TokenType.Character: {
                    ops.push(functions[token.value]());
                    break;
                }
            }
        }

        while(ops.length > 0) {
            stack.push(<INode>ops.pop());   // add the remaining operators
        }

        return stack;
    }

    private recursiveTree(stack: INode[]) : INode[] {
        let retval: INode[] = [];

        let cnode = stack.pop();
        if(cnode)
            retval.push(cnode);

        if(cnode !instanceof Variable) {
            
        }

        return retval;
    }

    parse(): INode[] {
        let stack = this.buildStack();

        let tree: INode[] = [];
        for(let i = stack.length - 1; i >= 0; i--) {    // go backwards
            let cNode = 
        }
    }
}


export default Parser;