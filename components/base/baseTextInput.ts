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


class BaseTextInput implements ITextInput {
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

        this._validityChangedWrapper = null;
        this._textChangedWrapper = null;
        this._valueChangedWrapper = null;
    }
}


export {ITextInput, BaseTextInput};