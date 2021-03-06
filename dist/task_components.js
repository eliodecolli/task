/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./components/base/baseTextInput.ts":
/*!******************************************!*
  !*** ./components/base/baseTextInput.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


/*
    File Name:
        baseTextInput.ts
    
    Purpose:
        Contains the base interface from which numeric controls can be derived.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseTextInput = void 0;
class BaseTextInput {
    constructor(hostElement) {
        this.textChangedEvents = null;
        this.valueChangedEvents = null;
        this.validityChangedEvents = null;
        if (hostElement.childNodes.length > 0 ||
            hostElement.tagName !== "DIV") {
            throw new Error("Host element must be an empty DIV.");
        }
        this._hostElement = hostElement;
        this._isValid = true;
        this._value = null;
        this._text = '';
        this._inputElement = this._createInputElement();
        this._hostElement.appendChild(this._inputElement);
        this._validityChangedWrapper = null;
        this._textChangedWrapper = null;
        this._valueChangedWrapper = null;
    }
    get textChanged() {
        return this._textChangedWrapper;
    }
    get valueChanged() {
        return this._valueChangedWrapper;
    }
    get validityChanged() {
        return this._validityChangedWrapper;
    }
    get isValid() {
        return this._isValid;
    }
    get hostElement() {
        return this._hostElement;
    }
    get text() {
        return this._text;
    }
    get value() {
        return this._value;
    }
    set text(_val) {
        this._setTextValue(_val, false);
    }
    set value(_val) {
        this._setTextValue(_val === null || _val === void 0 ? void 0 : _val.toString(), true);
    }
    onValidityChanged(nVal) {
        var _a;
        if (this._isValid !== nVal) {
            this._isValid = nVal;
            (_a = this.validityChangedEvents) === null || _a === void 0 ? void 0 : _a.signal();
        }
    }
    onValueChanged(nVal) {
        var _a;
        if (this._value !== nVal) {
            this._value = nVal;
            (_a = this.valueChangedEvents) === null || _a === void 0 ? void 0 : _a.signal();
        }
    }
    onTextChanged(nVal) {
        var _a;
        if (this._text !== nVal) {
            this._text = nVal;
            (_a = this.textChangedEvents) === null || _a === void 0 ? void 0 : _a.signal();
        }
    }
    _setTextValue(_val, isVal) {
        let evaluatedVal = NaN;
        let evaluatedText = '';
        let evaluatedValidity = false;
        if (isVal) { // here we can safely skip evaluation and [hopefully] gain some performance benefits, on the other hand this splits evaluation logic from the evaluate() function
            evaluatedVal = Number(_val);
            evaluatedText = _val;
            evaluatedValidity = !isNaN(evaluatedVal);
        }
        else {
            if (_val != null) {
                evaluatedText = _val;
                evaluatedVal = this._evaluate(evaluatedText);
                evaluatedValidity = !Number.isNaN(evaluatedVal);
            }
        }
        // trigger events
        this.onTextChanged(evaluatedText);
        this.onValueChanged(evaluatedVal);
        this.onValidityChanged(evaluatedValidity);
        // update UI
        this._setUIResult(Number.isNaN(evaluatedVal) ? '?' :
            (evaluatedVal !== undefined ? evaluatedVal.toString() : '')); // I don't really like the look of this but ok
        this._setValidUI(evaluatedValidity);
        this._setUIText(evaluatedText);
    }
    destroy() {
        var _a, _b, _c, _d;
        (_a = this.textChangedEvents) === null || _a === void 0 ? void 0 : _a.clear();
        (_b = this.valueChangedEvents) === null || _b === void 0 ? void 0 : _b.clear();
        (_c = this.validityChangedEvents) === null || _c === void 0 ? void 0 : _c.clear();
        (_d = this._inputElement) === null || _d === void 0 ? void 0 : _d.remove();
    }
    _setUIText(text) {
        var _a;
        let input = (_a = this._inputElement) === null || _a === void 0 ? void 0 : _a.querySelector('input');
        input.value = text;
    }
    _createInputElement() {
        var _a;
        let retval = document.createElement('div');
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.addEventListener('input', x => {
            let target = x.target;
            this._setTextValue(target.value, false);
        });
        retval.appendChild(input);
        (_a = retval.classList) === null || _a === void 0 ? void 0 : _a.add('input-valid');
        return retval;
    }
}
exports.BaseTextInput = BaseTextInput;


/***/ }),

/***/ "./components/calcInput.ts":
/*!*********************************!*
  !*** ./components/calcInput.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*
   File Name:
       calcInput.ts
   
   Purpose:
       Provides the logic to extend the BaseTextInput element as an expression evaluator.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const expressionEvaluator_1 = __importDefault(__webpack_require__(/*! ../core/expressionEvaluator */ "./core/expressionEvaluator.ts"));
const baseTextInput_1 = __webpack_require__(/*! ./base/baseTextInput */ "./components/base/baseTextInput.ts");
const eventsManager_1 = __webpack_require__(/*! ../core/eventsManager */ "./core/eventsManager.ts");
class CalculatorInput extends baseTextInput_1.BaseTextInput {
    constructor(hostElement) {
        super(hostElement);
        this.textChangedEvents = new eventsManager_1.EventManager(this);
        this.valueChangedEvents = new eventsManager_1.EventManager(this);
        this.validityChangedEvents = new eventsManager_1.EventManager(this);
        this._textChangedWrapper = new eventsManager_1.EventManagerWrapper(this.textChangedEvents);
        this._valueChangedWrapper = new eventsManager_1.EventManagerWrapper(this.valueChangedEvents);
        this._validityChangedWrapper = new eventsManager_1.EventManagerWrapper(this.validityChangedEvents);
    }
    _createInputElement() {
        var _a;
        let retval = super._createInputElement();
        let inputElement = retval.firstChild;
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('class', 'calc-input');
        let innerSpan = document.createElement('span');
        innerSpan.setAttribute('class', 'calc-result');
        retval.appendChild(innerSpan);
        (_a = retval.classList) === null || _a === void 0 ? void 0 : _a.add('calc-div');
        return retval;
    }
    _setValidUI(valid) {
        var _a, _b, _c, _d;
        if (valid) {
            (_a = this._inputElement) === null || _a === void 0 ? void 0 : _a.classList.remove('input-invalid');
            (_b = this._inputElement) === null || _b === void 0 ? void 0 : _b.classList.add('input-valid');
        }
        else {
            (_c = this._inputElement) === null || _c === void 0 ? void 0 : _c.classList.add('input-invalid');
            (_d = this._inputElement) === null || _d === void 0 ? void 0 : _d.classList.remove('input-valid');
        }
    }
    _setUIResult(result) {
        var _a;
        let resultSpan = (_a = this._inputElement) === null || _a === void 0 ? void 0 : _a.querySelector("span");
        resultSpan.innerText = result;
    }
    _evaluate(expression) {
        let retval = NaN;
        if (expression.length > 0) {
            let expEvaluator = new expressionEvaluator_1.default();
            retval = expEvaluator.evaluate(expression);
        }
        else {
            retval = undefined;
        }
        return retval;
    }
}
exports.default = CalculatorInput;


/***/ }),

/***/ "./components/numericInput.ts":
/*!************************************!*
  !*** ./components/numericInput.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
    File Name:
        numericInput.ts
    
    Purpose:
        Provides the logic to extend the BaseTextInput element as a control which converts a string to a number value.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
const baseTextInput_1 = __webpack_require__(/*! ./base/baseTextInput */ "./components/base/baseTextInput.ts");
const eventsManager_1 = __webpack_require__(/*! ../core/eventsManager */ "./core/eventsManager.ts");
class NumericInput extends baseTextInput_1.BaseTextInput {
    constructor(hostElement) {
        super(hostElement);
        this.textChangedEvents = new eventsManager_1.EventManager(this);
        this.valueChangedEvents = new eventsManager_1.EventManager(this);
        this.validityChangedEvents = new eventsManager_1.EventManager(this);
        this._textChangedWrapper = new eventsManager_1.EventManagerWrapper(this.textChangedEvents);
        this._valueChangedWrapper = new eventsManager_1.EventManagerWrapper(this.valueChangedEvents);
        this._validityChangedWrapper = new eventsManager_1.EventManagerWrapper(this.validityChangedEvents);
    }
    _setUIResult(result) {
        // no overrides here as we do not have a result span
    }
    _setValidUI(valid) {
        var _a, _b, _c, _d;
        if (valid) {
            (_a = this._inputElement) === null || _a === void 0 ? void 0 : _a.classList.remove('input-invalid');
            (_b = this._inputElement) === null || _b === void 0 ? void 0 : _b.classList.add('input-valid');
        }
        else {
            (_c = this._inputElement) === null || _c === void 0 ? void 0 : _c.classList.remove('input-valid');
            (_d = this._inputElement) === null || _d === void 0 ? void 0 : _d.classList.add('input-invalid');
        }
    }
    _evaluate(expression) {
        let retval = NaN;
        if (expression.length > 0) {
            retval = Number(expression);
        }
        else {
            retval = undefined;
        }
        return retval;
    }
    _createInputElement() {
        let retval = super._createInputElement();
        retval.classList.add('input-div');
        return retval;
    }
}
exports.default = NumericInput;


/***/ }),

/***/ "./core/ast/node.ts":
/*!**************************!*
  !*** ./core/ast/node.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Comma = exports.Variable = void 0;
const tokenizer_1 = __webpack_require__(/*! ../tokenizer */ "./core/tokenizer.ts");
// default Node implementation is a variable
class Variable {
    constructor(val) {
        this.children = [];
        this.type = tokenizer_1.TokenType.Variable;
        this.val = val;
    }
    evaluate() {
        return this.val;
    }
}
exports.Variable = Variable;
class Comma {
    constructor() {
        this.children = [];
        this.type = tokenizer_1.TokenType.Comma;
    }
    evaluate() {
        return 0;
    }
}
exports.Comma = Comma;


/***/ }),

/***/ "./core/ast/operators.ts":
/*!*******************************!*
  !*** ./core/ast/operators.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Operator = void 0;
const tokenizer_1 = __webpack_require__(/*! ../tokenizer */ "./core/tokenizer.ts");
class Operator {
    constructor() {
        this._tokenVal = "";
        this.children = [];
        this.type = tokenizer_1.TokenType.Operator;
    }
    evaluate() {
        return 0; // to be overriden
    }
    get priority() {
        return 0;
    }
    get tokenVal() {
        return this._tokenVal;
    }
}
exports.Operator = Operator;
class Add extends Operator {
    evaluate() {
        return this.children[1].evaluate() + this.children[0].evaluate();
    }
}
class Subtract extends Operator {
    get tokenVal() {
        return '-';
    }
    evaluate() {
        return this.children[1].evaluate() - this.children[0].evaluate();
    }
}
class Multiply extends Operator {
    evaluate() {
        return this.children[1].evaluate() * this.children[0].evaluate();
    }
    get priority() {
        return 1;
    }
}
class Divide extends Operator {
    evaluate() {
        return this.children[1].evaluate() / this.children[0].evaluate();
    }
    get priority() {
        return 1;
    }
}
class LParen extends Operator {
    constructor() {
        super(...arguments);
        this.type = tokenizer_1.TokenType.LParen;
    }
    evaluate() {
        throw new Error("Cannot call evaluate() on a parenthesis.");
    }
    get tokenVal() {
        return '(';
    }
    get priority() {
        return -1;
    }
}
class RParen extends LParen {
    constructor() {
        super(...arguments);
        this.type = tokenizer_1.TokenType.RParen;
    }
    get tokenVal() {
        return ')';
    }
}
const Operators = {
    '+': () => new Add(),
    '-': () => new Subtract(),
    '*': () => new Multiply(),
    '/': () => new Divide(),
    '(': () => new LParen(),
    ')': () => new RParen()
};
exports.default = Operators;


/***/ }),

/***/ "./core/eventsManager.ts":
/*!*******************************!*
  !*** ./core/eventsManager.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManagerWrapper = exports.EventManager = void 0;
class EventManager {
    constructor(owner) {
        this.funcStack = [];
        this.ownerInstance = owner;
    }
    clear() {
        this.funcStack = [];
    }
    subscribe(func) {
        this.funcStack.push(func);
    }
    signal() {
        this.funcStack.forEach(x => x(this.ownerInstance));
    }
}
exports.EventManager = EventManager;
// this is to prevent other classes from calling the function signal() other than the ITextInput owner.
class EventManagerWrapper {
    constructor(core) {
        this.core = core;
    }
    subscribe(func) {
        var _a;
        (_a = this.core) === null || _a === void 0 ? void 0 : _a.subscribe(func);
    }
}
exports.EventManagerWrapper = EventManagerWrapper;


/***/ }),

/***/ "./core/expressionEvaluator.ts":
/*!*************************************!*
  !*** ./core/expressionEvaluator.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const parser_1 = __importDefault(__webpack_require__(/*! ./parser */ "./core/parser.ts"));
const tokenizer_1 = __webpack_require__(/*! ./tokenizer */ "./core/tokenizer.ts");
class ExpressionEvaluator {
    constructor() {
        this._lastError = undefined;
    }
    get lastError() {
        return this._lastError;
    }
    evaluate(expression) {
        try {
            let tokenizer = new tokenizer_1.Tokenizer(expression);
            let parser = new parser_1.default(tokenizer.tokenize());
            let expTree = parser.parse();
            let retval = expTree.evaluate();
            this._lastError = undefined;
            return retval;
        }
        catch (e) {
            this._lastError = e;
            return NaN;
        }
    }
}
exports.default = ExpressionEvaluator;


/***/ }),

/***/ "./core/parser.ts":
/*!************************!*
  !*** ./core/parser.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*
    The idea behind the parsing phase is to organize tokens into nodes in postfix notation.
    From there we can easily build an expression tree, which can be called by calling its root function "evaluate()".

    Some of the functions here might seem a little bit weird, for instance buildStack() returns two arguments, an array of INode and a number.
    The array is pretty straight-forward, but the number is used to represent the amount of tokens that have been processed.
    This was used in parsing functions, but since I've dropped that functionality for the moment, that number is just hanging in there, doing nothing.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const tokenizer_1 = __webpack_require__(/*! ./tokenizer */ "./core/tokenizer.ts");
const operators_1 = __importDefault(__webpack_require__(/*! ./ast/operators */ "./core/ast/operators.ts"));
const node_1 = __webpack_require__(/*! ./ast/node */ "./core/ast/node.ts");
class Parser {
    constructor(tokens) {
        this.tokens = [];
        this.tokens = tokens;
        // first things first
        if (this.tokens.filter(x => x.type == tokenizer_1.TokenType.LParen).length != this.tokens.filter(x => x.type == tokenizer_1.TokenType.RParen).length) {
            throw new Error('Check your parenthesis.');
        }
    }
    // recursively create an execution tree. By calling createTree(...).evaluate() we can easily evaluate the whole expression without using stack machines
    createTree(nodes) {
        let item = nodes.pop();
        if (item.type == tokenizer_1.TokenType.Variable || item.children.length > 0) { // this is a variable (which indicates the last leaf of the tree) or it's already built
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
    buildStack(tokens) {
        let stack = [];
        let steps = 0;
        let ops = [];
        let start = 0;
        for (let token of tokens) {
            if (start >= tokens.length)
                break;
            switch (token.type) {
                case tokenizer_1.TokenType.Variable: {
                    stack.push(new node_1.Variable(parseFloat(token.value)));
                    start++;
                    break;
                }
                case tokenizer_1.TokenType.Operator: {
                    let cOp = operators_1.default[token.value]();
                    if (ops.length > 0) {
                        let top = ops[ops.length - 1];
                        if (top.priority >= cOp.priority && top.tokenVal !== '(') {
                            stack.push(ops.pop());
                        }
                    }
                    ops.push(cOp);
                    start++;
                    break;
                }
                case tokenizer_1.TokenType.LParen: {
                    ops.push(operators_1.default['(']());
                    start++;
                    break;
                }
                case tokenizer_1.TokenType.RParen: {
                    let i = ops.length - 1;
                    while (ops[i].tokenVal !== '(') {
                        stack.push(ops.pop());
                        i--;
                    }
                    ops.pop(); // remove the last '('
                    start++;
                    break;
                }
                case tokenizer_1.TokenType.Character: {
                    /*let root = functions[token.value]();
                    let node = this.parseFunction(start + 2, tokens, root);

                    ops.push(node[0]);
                    start += node[1] + 2;
                    break;*/
                    throw new Error(`Invalid token "${token.value}" at position ${start}.`); // no functions right now
                }
            }
        }
        while (ops.length > 0) {
            stack.push(ops.pop()); // add the remaining operators
        }
        return [stack, steps + 1];
    }
    parse() {
        let postFixStack = this.buildStack(this.tokens)[0];
        return this.createTree(postFixStack);
    }
}
exports.default = Parser;


/***/ }),

/***/ "./core/tokenizer.ts":
/*!***************************!*
  !*** ./core/tokenizer.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Token = exports.TokenType = exports.Tokenizer = void 0;
class Token {
    constructor(type, value) {
        this._type = type;
        this._value = value;
    }
    get type() {
        return this._type;
    }
    get value() {
        return this._value;
    }
}
exports.Token = Token;
var TokenType;
(function (TokenType) {
    TokenType[TokenType["Variable"] = 0] = "Variable";
    TokenType[TokenType["Character"] = 1] = "Character";
    TokenType[TokenType["LParen"] = 2] = "LParen";
    TokenType[TokenType["RParen"] = 3] = "RParen";
    TokenType[TokenType["Operator"] = 4] = "Operator";
    TokenType[TokenType["Comma"] = 5] = "Comma";
    TokenType[TokenType["Default"] = 6] = "Default";
})(TokenType || (TokenType = {}));
exports.TokenType = TokenType;
class Tokenizer {
    constructor(formula) {
        this.operators = {
            '+': 'add',
            '-': 'sub',
            '*': 'mul',
            '/': 'div'
        };
        this.formula = formula.trim();
    }
    checkType(c) {
        if (c >= '0' && c <= '9' || c == '.') {
            return TokenType.Variable;
        }
        else if (c == '(') {
            return TokenType.LParen;
        }
        else if (c == ')') {
            return TokenType.RParen;
        }
        else if (this.operators[c]) {
            return TokenType.Operator;
        }
        else if (c >= 'a' && c <= 'z') {
            return TokenType.Character;
        }
        else if (c == ',') {
            return TokenType.Comma;
        }
        return TokenType.Default;
    }
    tokenize() {
        let retval = [];
        let cType = TokenType.Default;
        let cVal = '';
        let divided = this.formula.split('');
        divided.forEach((x, i) => {
            if (cVal === '') {
                cVal = x;
                cType = this.checkType(x);
                if (this.formula.length == 1) {
                    retval.push(new Token(cType, cVal)); // our only token
                }
                return;
            }
            if (x === ' ')
                return;
            if (cVal == '-' && this.checkType(x) == TokenType.Variable && (!divided[i - 2] || (divided[i - 2] && this.checkType(divided[i - 2]) != TokenType.Variable))) {
                cType = TokenType.Variable; // this is now a number :)
            }
            if (cType == this.checkType(x)) { // we're still not past the current token
                if (cType == TokenType.Variable && (x == '.' && cVal.endsWith('.'))) { // floating point numbers must be of the format NUMBER.NUMBER
                    throw new Error(`Invalid '.' after token "${cVal}"`);
                }
                else if (cType == TokenType.LParen || cType == TokenType.RParen) {
                    // add the previous token and clear it up then
                    retval.push(new Token(cType, cVal));
                    cVal = '';
                }
                else if (cType == TokenType.Operator && x == '-') {
                    let token = new Token(cType, cVal);
                    retval.push(token);
                    cType = TokenType.Variable;
                    cVal = '';
                }
                cVal += x; // keep on building the current token
            }
            else { // the current token is done start creating the new one
                let token = new Token(cType, cVal);
                retval.push(token);
                cType = this.checkType(x);
                cVal = x;
                // check validity
                if (cType != TokenType.LParen && retval[retval.length - 1].type == TokenType.Character) { // after a function we expect a '('
                    throw new Error(`Invalid token ${cVal} after function "${retval[retval.length - 1].value}"`);
                }
            }
            if (i == this.formula.length - 1) {
                let lastToken = new Token(cType, cVal);
                retval.push(lastToken);
            }
        });
        return retval;
    }
    ;
}
exports.Tokenizer = Tokenizer;


/***/ }),

/***/ "./typescript/index.ts":
/*!*****************************!*
  !*** ./typescript/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
const calcInput_1 = __importDefault(__webpack_require__(/*! ../components/calcInput */ "./components/calcInput.ts"));
const numericInput_1 = __importDefault(__webpack_require__(/*! ../components/numericInput */ "./components/numericInput.ts"));
let calc = new calcInput_1.default(document.getElementById('calculator-div'));
let numeric = new numericInput_1.default(document.getElementById('numeric-div'));
function textChanged(x) {
    console.log(`${x.hostElement.id} text has been set to ${x.text}`);
}
function validityChanged(x) {
    console.log(`${x.hostElement.id} validity has been set to ${x.isValid}`);
}
function valueChanged(x) {
    console.log(`${x.hostElement.id} value has been set to ${x.value}`);
}
(_a = calc.textChanged) === null || _a === void 0 ? void 0 : _a.subscribe(textChanged);
(_b = calc.textChanged) === null || _b === void 0 ? void 0 : _b.subscribe(x => {
    let item = document.getElementById('textId');
    if (item) {
        item.innerText = x.text;
    }
});
(_c = calc.validityChanged) === null || _c === void 0 ? void 0 : _c.subscribe(validityChanged);
(_d = calc.validityChanged) === null || _d === void 0 ? void 0 : _d.subscribe(x => {
    let item = document.getElementById('validId');
    if (item) {
        item.innerText = x.isValid.toString();
    }
});
(_e = calc.valueChanged) === null || _e === void 0 ? void 0 : _e.subscribe(valueChanged);
(_f = calc.valueChanged) === null || _f === void 0 ? void 0 : _f.subscribe(x => {
    let span = document.getElementById('valueId');
    if (span) {
        let val = NaN;
        if (x.value != undefined) {
            val = x.value;
        }
        span.innerText = val.toFixed(4);
    }
});
(_g = numeric.textChanged) === null || _g === void 0 ? void 0 : _g.subscribe(textChanged);
(_h = numeric.textChanged) === null || _h === void 0 ? void 0 : _h.subscribe(x => {
    let span = document.getElementById('textIdNumeric');
    if (span) {
        span.innerText = x.text;
    }
});
(_j = numeric.valueChanged) === null || _j === void 0 ? void 0 : _j.subscribe(valueChanged);
(_k = numeric.valueChanged) === null || _k === void 0 ? void 0 : _k.subscribe(x => {
    var _a;
    let span = document.getElementById('valueIdNumeric');
    if (span) {
        span.innerText = (_a = x.value) === null || _a === void 0 ? void 0 : _a.toString(); // this is supposed to be NaN if something's wrong
    }
});
(_l = numeric.validityChanged) === null || _l === void 0 ? void 0 : _l.subscribe(validityChanged);
(_m = numeric.validityChanged) === null || _m === void 0 ? void 0 : _m.subscribe(x => {
    let span = document.getElementById('validIdNumeric');
    if (span) {
        span.innerText = x.isValid.toString();
    }
});
let valBtn = document.getElementById('setValBtn');
let txtBtn = document.getElementById('setTextBtn');
if (valBtn) {
    valBtn.onclick = _ => {
        let val = document.getElementById('inputValue');
        if (val) {
            let calcVal = val.value.length > 0 ? val.value : undefined;
            calc.value = Number(calcVal);
        }
    };
}
if (txtBtn) {
    txtBtn.onclick = _ => {
        let txt = document.getElementById('inputText');
        if (txt) {
            calc.text = txt.value;
        }
    };
}
let nValBtn = document.getElementById('setValBtnNumeric');
let nTxtBtn = document.getElementById('setTextBtnNumeric');
if (nValBtn) {
    nValBtn.onclick = _ => {
        let val = document.getElementById('inputValueNumeric');
        if (val) {
            let numVal = val.value.length > 0 ? val.value : undefined;
            numeric.value = Number(numVal);
        }
    };
}
if (nTxtBtn) {
    nTxtBtn.onclick = _ => {
        let txt = document.getElementById('inputTextNumeric');
        if (txt) {
            numeric.text = txt.value;
        }
    };
}
let destroyBtn = document.getElementById('destroyBtn');
if (destroyBtn) {
    destroyBtn.onclick = _ => {
        var _a, _b;
        numeric.destroy();
        calc.destroy();
        // clear up the divs as well
        (_a = document.getElementById('calcInputDiv')) === null || _a === void 0 ? void 0 : _a.remove();
        (_b = document.getElementById('numericInputDiv')) === null || _b === void 0 ? void 0 : _b.remove();
    };
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./typescript/index.ts");
/******/ })()
;
//# sourceMappingURL=task_components.js.map