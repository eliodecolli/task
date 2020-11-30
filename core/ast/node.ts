interface INode{
    children: INode[];
    evaluate(): number;
}


// default Node implementation is a variable
class Variable implements INode {
    private val: number;

    constructor(val: number) {
        this.val = val;
    }

    evaluate(): number {
        return this.val;
    }

    children: INode[] = [];
}

export default INode;