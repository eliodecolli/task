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
        if(this._text !== _val) {
            let c = this._inputElement?.querySelector("input") as HTMLInputElement;
            if(c) {
                c.value = _val;
            }
            this._inputElement?.querySelector('input')?.dispatchEvent(new Event('input'));    // this will trigger, evaluate(), however there's perhaps a better way to do this?
        }
    }

    public set value(_val: number | null | undefined) {
        if(this._value !== _val) {
            if(_val !== null && _val !== undefined) {
                this.text = _val.toString();  // this will trigger re-evaluation which in turn will dictate the result
            }
            else {
                this._value = undefined;
                this._text = '';
                if(this._isValid) {
                    this._isValid = false;
                    this.validityChangedEvents?.signal();
                }
            }
        }
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
        this._inputElement = this.createInputElement();

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

    protected abstract evaluate(): void;

    protected createInputElement(): HTMLElement {
        let retval = document.createElement('div');

        let input = document.createElement('input');
        input.setAttribute('type', 'text');

        input.addEventListener('input', x => {
            let target = x.target as HTMLInputElement;
            if(target.value !== this._text) {
                let tempVal = this._value;
                let tempValidity = this._isValid;

                this._text = target.value;
                this.evaluate();
                
                if(tempValidity !== this._isValid) {
                    this.validityChangedEvents?.signal();
                }
                if(tempVal !== this._value) {
                    this.valueChangedEvents?.signal();
                }
                this.textChangedEvents?.signal();   // we already determined that the text has changed
            }
        });
        
        retval.appendChild(input);
        return retval;
    }

}


export {ITextInput, BaseTextInput};