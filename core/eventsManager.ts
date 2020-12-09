import { ITextInput } from "../components/base/baseTextInput";

interface IEventManager<T> {
    subscribe(func: (x: T) => void) : void;
    signal(): void;
    clear(): void;
}


class EventManager<T> implements IEventManager<T> {
    
    private funcStack: ((x: T) => void)[] = [];
    private ownerInstance: T;

    constructor(owner: T) {
        this.ownerInstance = owner;
    }

    clear(): void {
        this.funcStack = [];
    }

    subscribe(func: (x: T) => void): void {
        this.funcStack.push(func);
    }

    signal(): void {
        this.funcStack.forEach(x => x(this.ownerInstance));
    }
}

// this is to prevent other classes from calling the function signal() other than the ITextInput owner.
class EventManagerWrapper<T> {

    private core: IEventManager<T>;

    constructor(core: IEventManager<T>) {
        this.core = core;
    }

    subscribe(func: (x: T) => void) {
        this.core?.subscribe(func);
    }

}

export {IEventManager, EventManager, EventManagerWrapper};