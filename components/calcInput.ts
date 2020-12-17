 /*
    File Name:
        calcInput.ts
    
    Purpose:
        Provides the logic to extend the BaseTextInput element as an expression evaluator.
*/

import ExpressionEvaluator from '../core/expressionEvaluator';
import {ITextInput, BaseTextInput} from './base/baseTextInput';
import {EventManager, EventManagerWrapper} from '../core/eventsManager'


class CalculatorInput extends BaseTextInput {
    
    constructor(hostElement: HTMLElement) {
        super(hostElement);
        
        this.textChangedEvents = new EventManager<ITextInput>(this);
        this.valueChangedEvents = new EventManager<ITextInput>(this);
        this.validityChangedEvents = new EventManager<ITextInput>(this);

        this._textChangedWrapper = new EventManagerWrapper<ITextInput>(this.textChangedEvents);
        this._valueChangedWrapper = new EventManagerWrapper<ITextInput>(this.valueChangedEvents);
        this._validityChangedWrapper = new EventManagerWrapper<ITextInput>(this.validityChangedEvents);
    }

    protected _createInputElement(): HTMLElement {
        let retval = super._createInputElement();

        let inputElement = retval.firstChild as HTMLInputElement;
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('class', 'calc-input');

        let innerSpan = document.createElement('span');
        innerSpan.setAttribute('class', 'calc-result');

        retval.appendChild(innerSpan);
        retval.classList?.add('calc-div');
        return retval;
    }

    protected _setValidUI(valid: boolean) {
        if(valid) {
            this._inputElement?.classList.remove('input-invalid');
            this._inputElement?.classList.add('input-valid');
        }
        else {
            this._inputElement?.classList.add('input-invalid');
            this._inputElement?.classList.remove('input-valid');
        }
    }

    protected _setUIResult(result: string) {
        let resultSpan = this._inputElement?.querySelector("span") as HTMLSpanElement;
        resultSpan.innerText = result;
    }

    protected _evaluate(expression: string): number | undefined {
        let retval: number | undefined = NaN;

        if(expression.length > 0) {
            let expEvaluator = new ExpressionEvaluator();
            retval = expEvaluator.evaluate(expression);
        }
        else {
            retval = undefined;
        }
        return retval;
    }
}

export default CalculatorInput;