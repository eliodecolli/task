
import CalculatorInput from "../components/calcInput";
let calc = new CalculatorInput(document.getElementById('mainDiv') as HTMLElement);


calc.textChanged.subscribe(x => {
    let item = document.getElementById('textId');
    if(item) {
        item.innerText = x.text;
    }
});

calc.validityChanged.subscribe(x => {
    let item = document.getElementById('validId');
    if(item) {
        item.innerText = x.isValid.toString();
    }
});

calc.valueChanged.subscribe(_ => console.log('the value has changed'));