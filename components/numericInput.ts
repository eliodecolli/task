import { ITextInput, BaseTextInput } from "./base/baseTextInput";
import { EventManager, EventManagerWrapper } from '../core/eventsManager'

class NumericInput extends BaseTextInput {

    constructor(hostElement: HTMLElement) {
        super(hostElement);

        this.textChangedEvents = new EventManager<ITextInput>(this);
        this.valueChangedEvents = new EventManager<ITextInput>(this);
        this.validityChangedEvents = new EventManager<ITextInput>(this);

        this._textChangedWrapper = new EventManagerWrapper<ITextInput>(this.textChangedEvents);
        this._valueChangedWrapper = new EventManagerWrapper<ITextInput>(this.valueChangedEvents);
        this._validityChangedWrapper = new EventManagerWrapper<ITextInput>(this.validityChangedEvents);
    }

    protected evaluate(): void {
        if(this._text) {
            let temp = Number(this._text);
            if(this._value !== temp) {
                this.valueChangedEvents?.signal();
            }

            this._value = temp;
            this._isValid = !isNaN(this._value);

            this.textChangedEvents?.signal();
            this.validityChangedEvents?.signal();
        }
    }

}

export default NumericInput;