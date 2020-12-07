import { BaseTextInput } from "./base/baseTextInput";
import { EventManager, EventManagerWrapper } from '../core/eventsManager'

class NumericInput extends BaseTextInput {

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

        /// maybe this logic can also be added to the base component ?
        inputElement.addEventListener('change', x => {
            if(this._inputElement) {
                let target = x.target as HTMLInputElement;
                this._text = target.value;
                this.evaluate();
            }
        });

        retval.appendChild(inputElement);
        return retval;
    }


    private evaluate(): void {
        if(this._text) {
            this._value = parseFloat(this._text);
            this._isValid = !isNaN(this._value);

            this.valueChangedEvents?.signal();
            this.textChangedEvents?.signal();
            this.validityChangedEvents?.signal();
        }
    }

}

export default NumericInput;