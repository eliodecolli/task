
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
        if(x.value != undefined) {
            val = x.value;
        }
        span.innerText = val.toFixed(4);
    }
});

numeric.textChanged?.subscribe(textChanged);
numeric.textChanged?.subscribe(x => {
    let span = document.getElementById('textIdNumeric');
    if(span) {
        span.innerText = x.text;
    }
});

numeric.valueChanged?.subscribe(valueChanged);
numeric.valueChanged?.subscribe(x => {
    let span = document.getElementById('valueIdNumeric');
    if(span) {
        span.innerText = <string>x.value?.toString();   // this is supposed to be NaN if something's wrong
    }
});

numeric.validityChanged?.subscribe(validityChanged);
numeric.validityChanged?.subscribe(x => {
    let span = document.getElementById('validIdNumeric');
    if(span) {
        span.innerText = x.isValid.toString();
    }
});

let valBtn = document.getElementById('setValBtn');
let txtBtn = document.getElementById('setTextBtn');

if(valBtn) {
    valBtn.onclick = _ => {
        let val = document.getElementById('inputValue') as HTMLInputElement;
        if(val) {
            calc.value = Number(val.value);
        }
    };
}

if(txtBtn) {
    txtBtn.onclick = _ => {
        let txt = document.getElementById('inputText') as HTMLInputElement;
        if(txt) {
            calc.text = txt.value;
        }
    };
}

let nValBtn = document.getElementById('setValBtnNumeric');
let nTxtBtn = document.getElementById('setTextBtnNumeric');

if(nValBtn) {
    nValBtn.onclick = _ => {
        let val = document.getElementById('inputValueNumeric') as HTMLInputElement;
        if(val) {
            numeric.value = Number(val.value);
        }
    };
}

if(nTxtBtn) {
    nTxtBtn.onclick = _ => {
        let txt = document.getElementById('inputTextNumeric') as HTMLInputElement;
        if(txt) {
            numeric.text = txt.value;
        }
    };
}

let destroyBtn = document.getElementById('destroyBtn') as HTMLButtonElement;
if(destroyBtn) {
    destroyBtn.onclick = _ => {
        numeric.destroy();
        calc.destroy();
    };
}