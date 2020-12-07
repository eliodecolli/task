/*
    File Name:
        calcInput.ts
    
    Purpose:
        Provides the logic to extend the BaseTextInput element as an expression evaluator.
*/

import ExpressionEvaluator from '../core/expressionEvaluator';
import {BaseTextInput} from './base/baseTextInput';

class CalculatorInput extends BaseTextInput {

    constructor(hostElement: HTMLElement) {
        super(hostElement);

        this._inputElement = this.createInputElement();
        this._hostElement.appendChild(this._inputElement);
    }

    private createInputElement(): HTMLElement {
        let retval = document.createElement('div');
        
        let inputElement = document.createElement('input');
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('class', 'calc-input');
        inputElement.setAttribute('data-order', 'primary');    // data-order is used to differentiate between the input element and the result element

        let resultElement = document.createElement('input');
        resultElement.setAttribute('type', 'text');
        resultElement.setAttribute('class', 'calc-result');
        resultElement.setAttribute('data-order', 'secondary');  // ^
        resultElement.disabled = true;

        /// maybe this logic can also be added to the base component ?
        inputElement.addEventListener('change', x => {
            if(this._inputElement) {
                let target = x.target as HTMLInputElement;
                this._text = target.value;
                this.evaluate();
            }
        });

        retval.appendChild(inputElement);
        retval.appendChild(resultElement);

        return retval;
    }

    private evaluate(): void {
        if(this._text.length > 0) {
            let expEvaluator = new ExpressionEvaluator();
            let computed = expEvaluator.evaluate(this._text);

            if(computed) {
                this._value = computed;
                this._isValid = true;

                (this._inputElement?.querySelector("input[data-order='secondary']") as HTMLInputElement).value = this._value.toString();
            }
            else {
                this._value = undefined;
                this._isValid = false;

                (this._inputElement?.querySelector("input[data-order='secondary']") as HTMLInputElement).value = '?';
            }

            this.subscribers['valueChanged'].forEach(x => x(this));
            this.subscribers['isValidChanged'].forEach(x => x(this));
            this.subscribers['textChanged'].forEach(x => x(this));
        }
    }
}

export default CalculatorInput;