/*
    File Name:
        calcInput.ts
    
    Purpose:
        Provides the logic to extend the BaseTextInput element as an expression evaluator.
*/

import ExpressionEvaluator from '../core/expressionEvaluator';
import {BaseTextInput} from './base/baseTextInput';
import {EventManager, EventManagerWrapper} from '../core/eventsManager'


class CalculatorInput extends BaseTextInput {

    private _textChangedWrapper: EventManagerWrapper;
    private _valueChangedWrapper: EventManagerWrapper;
    private _validityChangedWrapper: EventManagerWrapper;

    public get textChanged(): EventManagerWrapper {
        return this._textChangedWrapper;
    }

    public get valueChanged(): EventManagerWrapper {
        return this._valueChangedWrapper;
    }

    public get validityChanged(): EventManagerWrapper {
        return this._validityChangedWrapper;
    }

    constructor(hostElement: HTMLElement) {
        super(hostElement);

        this._inputElement = this.createInputElement();
        this._hostElement.appendChild(this._inputElement);

        this.textChangedEvents = new EventManager(this);
        this.valueChangedEvents = new EventManager(this);
        this.validityChangedEvents = new EventManager(this);

        this._textChangedWrapper = new EventManagerWrapper(this.textChangedEvents);
        this._valueChangedWrapper = new EventManagerWrapper(this.valueChangedEvents);
        this._validityChangedWrapper = new EventManagerWrapper(this.validityChangedEvents);
    }

    private createInputElement(): HTMLElement {
        let retval = document.createElement('div');
        
        let inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('class', 'calc-input');
        inputElement.setAttribute('data-order', 'primary');    // data-order is used to differentiate between the input element and the result element

        let innerSpan = document.createElement('span');
        innerSpan.setAttribute('class', 'calc-result');
        innerSpan.setAttribute('data-order', 'secondary');  // ^

        /// maybe this logic can also be added to the base component ?
        inputElement.addEventListener('change', x => {
            if(this._inputElement) {
                let target = x.target as HTMLInputElement;
                this._text = target.value;
                this.evaluate();
            }
        });

        retval.appendChild(inputElement);
        retval.appendChild(innerSpan);
        retval.classList.add('calc-valid');
        //retval.appendChild(resultElement);

        return retval;
    }

    private evaluate(): void {
        if(this._text.length > 0) {
            let expEvaluator = new ExpressionEvaluator();
            let computed = expEvaluator.evaluate(this._text);

            let resultSpan = this._inputElement?.querySelector("span[data-order='secondary']") as HTMLSpanElement;

            if(computed) {
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

            this.textChangedEvents?.signal();
            this.validityChangedEvents?.signal();
            this.valueChangedEvents?.signal();
        }
    }
}

export default CalculatorInput;