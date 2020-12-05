/* 
    The idea behind the parsing phase is to organize tokens into nodes in postfix notation.
    From there we can easily build an expression tree, which can be called by calling its root function "evaluate()".

    Some of the functions here might seem a little bit weird, for instance buildStack() returns two arguments, an array of INode and a number.
    The array is pretty straight-forward, but the number is used to represent the amount of tokens that have been processed.
    This was used in parsing functions, but since I've dropped that functionality for the moment, that number is just hanging in there, doing nothing.
*/

import {Token, TokenType} from './tokenizer'
import {default as functions} from './ast/functions'
import {default as operators, Operator} from './ast/operators'
import {INode, Variable} from './ast/node'

interface IParser {
    parse(): INode;
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

    // recursively create an execution tree. By calling createTree(...).evaluate() we can easily evaluate the whole expression without using stack machines
    private createTree(nodes: INode[]) : INode {
        let item = <INode>nodes.pop();

        if(item.type == TokenType.Variable || item.children.length > 0) {    // this is a variable (which indicates the last leaf of the tree) or it's already built
            return item;
        }

        let left = this.createTree(nodes);
        let right = this.createTree(nodes);

        item.children.push(left, right);
        return item;
    }

    // the following function does not work as intented, because I need to pass some more lexical phases before going into this one.
    /*private parseFunction(startIndex: number, tokens: Token[], parent: INode) : [INode, number] {
        let steps = startIndex;

        let tokensTab: Token[] = [];

        while(tokens[steps]) {
            let token = tokens[steps];

            if(token.type == TokenType.Comma) {
                let built = this.buildStack(tokensTab);
                //functionStack.push(this.createTree(built[0]));
                
                parent.children.push(this.createTree(built[0]));

                steps += built[1];
                tokensTab = [];
            }
            else if(token.type == TokenType.Character) {
                let built = this.parseFunction(steps + 2, tokens, functions[token.value]());
                parent.children.push(built[0]);
                steps += built[1] + 1;
            }
            else if(token.type == TokenType.RParen) {
                steps++;
                break;
            }
            else {
                tokensTab.push(token);
                steps++;
            }
        }

        if(tokensTab.length > 0) {
            let built = this.buildStack(tokensTab);
            parent.children.push(this.createTree(built[0]));
            steps += built[1];
        }

        return [parent, steps - startIndex];
    }*/

    // the following is a Shunting-Yard Algorithm implementation, we use it to convert tokens into nodes and arrange them in a postfix notation (Reversed Polish Notation)
    private buildStack(tokens: Token[]): [INode[], number] {
        let stack: INode[] = [];
        let steps = 0;

        let ops: INode[] = [];

        let start = 0;

        for(let token of tokens) {
            if(start >= tokens.length)
                break;

            switch(token.type) {
                case TokenType.Variable: {
                    stack.push(new Variable(parseFloat(token.value)));
                    start++;
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
                    start++;
                    break;
                }

                case TokenType.LParen: {
                    ops.push(operators['(']());
                    start++;
                    break;
                }

                case TokenType.RParen: {
                    let i = ops.length - 1;
                    while((<Operator>ops[i]).tokenVal !== '(') {
                        stack.push(<INode>ops.pop());
                        i--;
                    }

                    ops.pop();  // remove the last '('
                    start++;
                    break;
                }

                case TokenType.Character: {
                    /*let root = functions[token.value]();
                    let node = this.parseFunction(start + 2, tokens, root);

                    ops.push(node[0]);
                    start += node[1] + 2;
                    break;*/
                    throw new Error(`Invalid token "${token.value}" at position ${start}.`);    // no functions right now
                }
            }
        }

        while(ops.length > 0) {
            stack.push(<INode>ops.pop());   // add the remaining operators
        }

        return [stack, steps + 1];
    }

    parse(): INode {
        let postFixStack = this.buildStack(this.tokens)[0];
        return this.createTree(postFixStack);
    }
}


export default Parser;