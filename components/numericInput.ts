/*
    File Name:
        numericInput.ts
    
    Purpose:
        Provides the logic to extend the BaseTextInput element as a control which converts a string to a number value.
*/

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

    protected _setUIResult(result: string) {
        // no overrides here as we do not have a result span
    }

    protected _setValidUI(valid: boolean) {
        if(valid) {
            this._inputElement?.classList.remove('input-invalid');
            this._inputElement?.classList.add('input-valid');
        }
        else {
            this._inputElement?.classList.remove('input-valid');
            this._inputElement?.classList.add('input-invalid');
        }
    }

    protected _evaluate(expression: string): number | undefined {
        let retval: number | undefined = NaN;

        if(expression.length > 0) {
            retval = Number(expression);
        }
        else {
            retval = undefined;
        }

        return retval;
    }

    protected _createInputElement(): HTMLElement {
        let retval = super._createInputElement();
        retval.classList.add('input-div');
        return retval;
    }

}

export default NumericInput;