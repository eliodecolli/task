import CalculatorInput from "../components/calcInput";
let calc = new CalculatorInput(document.getElementById('mainDiv') as HTMLElement);


calc.registerEventListener('textChanged', x => {
    let item = document.getElementById('textId');
    if(item) {
        item.innerText = x.text;
    }
});
calc.registerEventListener('isValidChanged', x => {
    let item = document.getElementById('validId');
    if(item) {
        item.innerText = x.isValid.toString();
    }
});
calc.registerEventListener('valueChanged', _ => console.log('the value has changed'));