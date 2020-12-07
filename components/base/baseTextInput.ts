/*
    File Name:
        baseTextInput.ts
    
    Purpose:
        Contains the base interface from which numeric controls can be derived.
*/

import {IEventManager} from '../../core/eventsManager'


interface ITextInput {
    value: number | null | undefined;
    text: string;
    isValid: boolean;
    hostElement: HTMLElement;
}


class BaseTextInput implements ITextInput {
    protected _text: string;
    protected _value: number | null | undefined;

    protected _isValid: boolean;

    protected _hostElement: HTMLElement;
    protected _inputElement: HTMLElement | undefined;

    protected textChangedEvents: IEventManager | null = null;
    protected valueChangedEvents: IEventManager | null = null;
    protected validityChangedEvents: IEventManager | null = null;

    public get text(): string {
        return this._text;
    }

    public set text(_val: string) {
        this._text = _val;
    }

    public get value(): number | null | undefined {
        return this._value;
    }

    public set value(_val: number | undefined | null) {
        this._value = _val;
    }

    public get isValid(): boolean {
        return this._isValid;
    }

    public get hostElement(): HTMLElement {
        return this._hostElement;
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
        this._inputElement = undefined;
    }
}


export {ITextInput, BaseTextInput};