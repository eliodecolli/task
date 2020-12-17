/*
    File Name:
        baseTextInput.ts
    
    Purpose:
        Contains the base interface from which numeric controls can be derived.
*/

import {IEventManager, EventManagerWrapper} from '../../core/eventsManager'


interface ITextInput {
    value: number | null | undefined;
    text: string;
    isValid: boolean;
    hostElement: HTMLElement;
}


abstract class BaseTextInput implements ITextInput {
    protected _text: string;
    protected _value: number | null | undefined;

    protected _isValid: boolean;

    protected _hostElement: HTMLElement;
    protected _inputElement: HTMLElement | undefined;

    protected textChangedEvents: IEventManager<ITextInput> | null = null;
    protected valueChangedEvents: IEventManager<ITextInput> | null = null;
    protected validityChangedEvents: IEventManager<ITextInput> | null = null;

    protected _textChangedWrapper: EventManagerWrapper<ITextInput> | null;
    protected _valueChangedWrapper: EventManagerWrapper<ITextInput> | null;
    protected _validityChangedWrapper: EventManagerWrapper<ITextInput> | null;

    public get textChanged(): EventManagerWrapper<ITextInput> | null {
        return this._textChangedWrapper;
    }

    public get valueChanged(): EventManagerWrapper<ITextInput> | null {
        return this._valueChangedWrapper;
    }

    public get validityChanged(): EventManagerWrapper<ITextInput> |null {
        return this._validityChangedWrapper;
    }

    public get isValid(): boolean {
        return this._isValid;
    }

    public get hostElement(): HTMLElement {
        return this._hostElement;
    }

    public get text(): string {
        return this._text;
    }

    public get value(): number | null | undefined {
        return this._value;
    }

    public set text(_val: string) {
        this._setTextValue(_val, false);
    }

    public set value(_val: number | null | undefined) {
        this._setTextValue(_val?.toString(), true);
    }

    protected onValidityChanged(nVal: boolean): void {
        if(this._isValid !== nVal) {
            this._isValid = nVal;
            this.validityChangedEvents?.signal();
        }
    }

    protected onValueChanged(nVal: number | undefined): void {
        if(this._value !== nVal) {
            this._value = nVal;
            this.valueChangedEvents?.signal();
        }
    }

    protected onTextChanged(nVal: string): void {
        if(this._text !== nVal) {
            this._text = nVal;
            this.textChangedEvents?.signal();
        }
    }

    protected _setTextValue(_val:  string | undefined | null, isVal: boolean) {
        let evaluatedVal: number | undefined = NaN;
        let evaluatedText: string = '';
        let evaluatedValidity: boolean = false;

        if(isVal) {  // here we can safely skip evaluation and [hopefully] gain some performance benefits, on the other hand this splits evaluation logic from the evaluate() function
            evaluatedVal = Number(_val);
            evaluatedText = <string>_val;
            evaluatedValidity = !isNaN(evaluatedVal);
        }
        else {
            if(_val != null) {
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
                                                            (evaluatedVal !== undefined ? evaluatedVal.toString() : ''));   // I don't really like the look of this but ok

        this._setValidUI(evaluatedValidity);
        this._setUIText(evaluatedText);
    }
    
    constructor(hostElement: HTMLElement) {
        if(hostElement.childNodes.length > 0 ||
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

    public destroy(): void {
        this.textChangedEvents?.clear();
        this.valueChangedEvents?.clear();
        this.validityChangedEvents?.clear();

        this._inputElement?.remove();
    }

    protected abstract _evaluate(expression: string): number | undefined;

    protected abstract _setUIResult(result: string): void;     // updates UI with the result of the evaluation

    protected abstract _setValidUI(valid: boolean): void;      // updates UI with the validity indicator

    protected _setUIText(text: string): void {
        let input = this._inputElement?.querySelector('input') as HTMLInputElement;
        input.value = text;
    }

    protected _createInputElement(): HTMLElement {
        let retval = document.createElement('div');

        let input = document.createElement('input');
        input.setAttribute('type', 'text');

        input.addEventListener('input', x => {
            let target = x.target as HTMLInputElement;
            this._setTextValue(target.value, false);
        });
        
        retval.appendChild(input);
        retval.classList?.add('input-valid');
        return retval;
    }

}


export {ITextInput, BaseTextInput};