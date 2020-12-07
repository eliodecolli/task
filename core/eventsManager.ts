import { ITextInput } from "../components/base/baseTextInput";

interface IEventManager {
    subscribe(func: (x: ITextInput) => void) : void;

    signal(): void;
}


class EventManager implements IEventManager {
    
    private funcStack: ((x: ITextInput) => void)[] = [];
    private ownerInstance: ITextInput;

    constructor(owner: ITextInput) {
        this.ownerInstance = owner;
    }

    subscribe(func: (x: ITextInput) => void): void {
        this.funcStack.push(func);
    }

    signal(): void {
        this.funcStack.forEach(x => x(this.ownerInstance));
    }
}

// this is to prevent other classes from calling the function signal() other than the ITextInput owner.
class EventManagerWrapper {

    private core: IEventManager;

    constructor(core: IEventManager) {
        this.core = core;
    }

    subscribe(func: (x: ITextInput) => void) {
        this.core?.subscribe(func);
    }

}

export {IEventManager, EventManager, EventManagerWrapper};