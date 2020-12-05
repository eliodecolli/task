/*
    File Name:
        baseTextInput.ts
    
    Purpose:
        Contains the base interface from which numeric controls can be derived.
*/


interface ITextInput {
    value: number | null | undefined;
    text: string;
    isValid: boolean;
    hostElement: HTMLElement;

    registerEventListener(onType: string, func: (x: ITextInput) => void) : void;
}


class BaseTextInput implements ITextInput {
    protected _text: string;
    protected _value: number | null | undefined;

    protected _isValid: boolean;

    protected _hostElement: HTMLElement;
    protected _inputElement: HTMLElement | undefined;


    protected subscribers: {[id: string]: ((x: ITextInput) => void)[]};

    public get text(): string {
        return this._text;
    }

    public get value(): number | null | undefined {
        return this._value;
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

        this.subscribers = {
            'textChanged': [],
            'valueChanged': [],
            'isValidChanged': []
        };
    }

    registerEventListener(onType: string, func: (x: ITextInput) => void): any {
        if(this.subscribers[onType]) {
            this.subscribers[onType].push(func);
        }
        else {
            throw new Error(`"${onType}" is not a valid event type.`);
        }
    }
}


export {ITextInput, BaseTextInput};