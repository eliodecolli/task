import {Token, TokenType} from './tokenizer'
import {default as functions} from './ast/functions'
import {default as operators} from './ast/operators'
import INode from './ast/node'

interface IParser {
    parse(startIndex: number): [INode, number];
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

    private parseFunctionArguments(startIndex: number, tokens: Token[]): [number[], number] {
        let retval: number[] = [];

        let i = startIndex;
        let cTokenType: number = 0;

        while(cTokenType != TokenType.RParen) {
            let x = tokens[i];

            cTokenType = x.type;
            if(cTokenType == TokenType.Character && tokens[i+1].type != TokenType.Variable) {   // end of the line => (NUM,NUM,) or (NUM,,)
                throw new Error(`Function was expecting a parameter.`);
            }

            if(cTokenType == TokenType.Character && x.value != ',') {  // it's not a comma
                throw new Error(`Invalid character ${x.value} inside function arguments.`);
            }

            if(cTokenType == TokenType.Variable) {
                retval.push(parseFloat(x.value));
            }
            i++;
        }

        let steps = i - startIndex;
        return [retval, steps];
    }

    parse(startIndex: number): [INode, number] {
        let node: INode = {children: []};

        let i = startIndex;

        let opStack: Token[] = [];
        let valStack: number[] = [];

        while(i < this.tokens.length) {
            let x = this.tokens[i];

            switch(x.type) {
                case TokenType.Character: {    // functions are considered as characters
                    if(functions[x.value]) {
                        if(this.tokens[i+1] == undefined || this.tokens[i+1].type != TokenType.LParen){
                            throw new Error(`[parser]: Cannot parse function "${x.value}"`);
                        }

                        let args = this.parseFunctionArguments(i, this.tokens);
                        node = functions[x.value](args[0]);
                        i += args[1];
                    }
                    break;
                }

                case TokenType.LParen: {
                    // it's a new day, it's a new life, it's a neew NOOOOODEE
                    let parsed = this.parse(i + 1);   // we don't wanna end up in the same position and trigger a stack overflow do we?

                    node = parsed[0];
                    i += parsed[1] + 1;
                    break;
                }

                case TokenType.RParen: {   // apparently we're done with this node
                    return [node, i - startIndex];
                }

                case TokenType.Operator: {
                    opStack.push(x);
                    break;
                }

                case TokenType.Variable: {
                    valStack.push(parseFloat(x.value));

                    if(valStack.length == 2) {
                        // time to return the value

                        let op = opStack.pop().value;
                        let opNode = operators[op](<number>valStack.pop(), <number>valStack.pop());

                        node.children.push(opNode);
                    }
                    break;
                }
            }

            i++;
        }

        return [node, i-startIndex];
    }

}


export default Parser;