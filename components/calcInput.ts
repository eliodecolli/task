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

    public set text(_val: string) {
        this._text = _val;

        let c = this._inputElement?.querySelector("input[data-order='primary']") as HTMLInputElement;
        if(c) {
            c.value = _val;
        }
        this.textChangedEvents?.signal();
    }

    public set value(_val: number | null | undefined) {
        this._value = _val;
        this.valueChangedEvents?.signal();
    }
    
    public get text(): string {
        return this._text;
    }

    public get value(): number | null | undefined {
        return this._value;
    }

    constructor(hostElement: HTMLElement) {
        super(hostElement);

        this._inputElement = this.createInputElement();
        this._hostElement.appendChild(this._inputElement);

        this.textChangedEvents = new EventManager<ITextInput>(this);
        this.valueChangedEvents = new EventManager<ITextInput>(this);
        this.validityChangedEvents = new EventManager<ITextInput>(this);

        this._textChangedWrapper = new EventManagerWrapper<ITextInput>(this.textChangedEvents);
        this._valueChangedWrapper = new EventManagerWrapper<ITextInput>(this.valueChangedEvents);
        this._validityChangedWrapper = new EventManagerWrapper<ITextInput>(this.validityChangedEvents);
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