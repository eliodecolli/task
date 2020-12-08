class Token {
    
    private _type : TokenType;
    public get type() : TokenType {
        return this._type;
    }
    
    private _value : string;
    public get value() : string {
        return this._value;
    }
    
    constructor(type: TokenType, value: string) {
        this._type = type;
        this._value = value;
    }
}

enum TokenType {
    Variable = 0,
    Character = 1,
    LParen = 2,
    RParen = 3,
    Operator = 4,
    Comma = 5,
    Default = 6
}

interface ITokenizer {
    tokenize(): Token[];
}

class Tokenizer implements ITokenizer {
    private formula: string;

    private operators: { [id:string]: string } = {
        '+': 'add',
        '-': 'sub',
        '*': 'mul',
        '/': 'div'
    };

    private checkType(c: string): TokenType {
        if(c >= '0' && c <= '9' || c == '.') {
            return TokenType.Variable;
        }
        else if(c == '(') {
            return TokenType.LParen;
        }
        else if(c == ')'){
            return TokenType.RParen;
        }
        else if(this.operators[c]) {
            return TokenType.Operator;
        }
        else if(c >= 'a' && c <= 'z') {
            return TokenType.Character;
        }
        else if(c == ',') {
            return TokenType.Comma;
        }

        return TokenType.Default;
    }

    constructor(formula: string) {
        this.formula = formula.trim();
    }

    tokenize(): Token[] {
        let retval: Token[] = [];

        let cType = TokenType.Default;
        let cVal = '';

        let divided = this.formula.split('');

        divided.forEach((x, i) => {
            if(cVal === '') {
                cVal = x;
                cType = this.checkType(x);

                if(this.formula.length == 1) {
                    retval.push(new Token(cType, cVal));   // our only token
                }

                return;
            }

            if(x === ' ')
                return;

            if(cVal == '-' && this.checkType(x) == TokenType.Variable && (!divided[i-2] || (divided[i-2] && this.checkType(divided[i - 2]) != TokenType.Variable))) {
                cType = TokenType.Variable;    // this is now a number :)
            }

            if(cType == this.checkType(x)) { // we're still not past the current token

                if(cType == TokenType.Variable && (x == '.' && cVal.endsWith('.'))) {  // floating point numbers must be of the format NUMBER.NUMBER
                    throw new Error(`Invalid '.' after token "${cVal}"`);
                } 
                else if(cType == TokenType.LParen || cType == TokenType.RParen) {
                    // add the previous token and clear it up then
                    retval.push(new Token(cType, cVal));
                    cVal = '';
                }
                else if(cType == TokenType.Operator && x == '-') {
                    let token = new Token(cType, cVal);
                    retval.push(token);

                    cType = TokenType.Variable;
                    cVal = '';
                }

                cVal += x;  // keep on building the current token
            }
            else { // the current token is done start creating the new one
                let token = new Token(cType, cVal);
                retval.push(token);

                cType = this.checkType(x);
                cVal = x;

                // check validity
                if(cType != TokenType.LParen && retval[retval.length - 1].type == TokenType.Character) {     // after a function we expect a '('
                    throw new Error(`Invalid token ${cVal} after function "${retval[retval.length - 1].value}"`);
                }
            }
            if(i == this.formula.length - 1) {
                let lastToken = new Token(cType, cVal);
                retval.push(lastToken);
            }
        });
        
        return retval;
    };
}

export {Tokenizer, TokenType, Token}