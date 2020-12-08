
import { ITextInput } from "../components/base/baseTextInput";
import CalculatorInput from "../components/calcInput";
import NumericInput from '../components/numericInput';

let calc = new CalculatorInput(document.getElementById('calculator-div') as HTMLElement);
let numeric = new NumericInput(document.getElementById('numeric-div') as HTMLElement);

function textChanged(x: ITextInput) {
    console.log(`${x.hostElement.id} text has been set to ${x.text}`);
}

function validityChanged(x: ITextInput) {
    console.log(`${x.hostElement.id} validity has been set to ${x.isValid}`);
}

function valueChanged(x: ITextInput) {
    console.log(`${x.hostElement.id} value has been set to ${x.value}`);
}

calc.textChanged?.subscribe(textChanged);
calc.textChanged?.subscribe(x => {
    let item = document.getElementById('textId');
    if(item) {
        item.innerText = x.text;
    }
});

calc.validityChanged?.subscribe(validityChanged);
calc.validityChanged?.subscribe(x => {
    let item = document.getElementById('validId');
    if(item) {
        item.innerText = x.isValid.toString();
    }
});

calc.valueChanged?.subscribe(valueChanged);
calc.valueChanged?.subscribe(x => {
    let span = document.getElementById('valueId');
    if(span) {
        let val = NaN;
        if(x.value) {
            val = x.value;
        }
        span.innerText = val.toFixed(4);
    }
});

numeric.textChanged?.subscribe(textChanged);
numeric.valueChanged?.subscribe(valueChanged);
numeric.validityChanged?.subscribe(validityChanged);