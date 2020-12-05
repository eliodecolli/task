import ExpressionEvaluator from '../core/expressionEvaluator';
import {BaseTextInput} from './base/baseTextInput';

class CalculatorInput extends BaseTextInput {

    constructor(hostElement: HTMLElement) {
        super(hostElement);

        this._inputElement = this.createInputElement();
        this._hostElement.appendChild(this._inputElement);
    }

    private createInputElement(): HTMLElement {
        let retval = new HTMLDivElement();
        
        let inputElement = new HTMLInputElement();
        inputElement.setAttribute('type', 'text');
        inputElement.setAttribute('class', 'calc-input');

        let resultElement = new HTMLInputElement();
        resultElement.setAttribute('type', 'text');
        resultElement.setAttribute('class', 'calc-result');
        resultElement.disabled = true;

        /// maybe this logic can also be added to the base component ?
        inputElement.addEventListener('change', x => {
            if(this._inputElement) {
                this._text = inputElement.innerText;
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
            }
            else {
                this._value = undefined;
                this._isValid = false;
            }

            this.subscribers['valueChanged'].forEach(x => x(this));
            this.subscribers['isValidChanged'].forEach(x => x(this));
        }
    }
}

export default CalculatorInput;