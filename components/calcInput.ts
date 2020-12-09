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

    protected createInputElement(): HTMLElement {
        let retval = super.createInputElement();

        let inputElement = retval.firstChild as HTMLInputElement;
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('class', 'calc-input');

        let innerSpan = document.createElement('span');
        innerSpan.setAttribute('class', 'calc-result');

        retval.appendChild(innerSpan);
        retval.classList.add('calc-valid');

        return retval;
    }

    protected evaluate(): void {
        if(this._text.length > 0) {
            let expEvaluator = new ExpressionEvaluator();
            let computed = expEvaluator.evaluate(this._text);

            let resultSpan = this._inputElement?.querySelector("span") as HTMLSpanElement;

            let tempVal = this._value;
            let tempValidity = this._isValid;

            if(computed != undefined) {
                this._value = computed;
                this._isValid = true;

                resultSpan.innerText = this._value.toString();
                this._inputElement?.classList.remove('calc-invalid');
                this._inputElement?.classList.add('calc-valid');
            }
            else {
                this._value = undefined;
                this._isValid = false;

                resultSpan.innerText = '?';
                this._inputElement?.classList.add('calc-invalid');
                this._inputElement?.classList.remove('calc-valid');
            }
            
            if(tempValidity !== this._isValid) {
                this.validityChangedEvents?.signal();
            }

            if(tempVal !== this._value) {
                this.valueChangedEvents?.signal();
            }
        }
    }
}

export default CalculatorInput;