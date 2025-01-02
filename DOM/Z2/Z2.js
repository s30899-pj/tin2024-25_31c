const calculateResult = () => {
    const firstNumber = parseFloat(document.getElementById('firstNumber').value);
    const secondNumber = parseFloat(document.getElementById('secondNumber').value);
    const operation = document.getElementById('operation').value;
    const resultElement = document.getElementById('result');

    let result;

    if (isNaN(firstNumber) || isNaN(secondNumber)) {
        resultElement.textContent = 'Błąd!';
        return;
    }

    switch (operation) {
        case '+':
            result = firstNumber + secondNumber;
            break;
        case '-':
            result = firstNumber - secondNumber;
            break;
        case '*':
            result = firstNumber * secondNumber;
            break;
        case '/':
            if (secondNumber === 0) {
                resultElement.textContent = 'Błąd: Dzielenie przez zero!';
                return;
            }
            result = firstNumber / secondNumber;
            break;
        default:
            resultElement.textContent = 'Błąd!';
            return;
    }

    resultElement.textContent = result;
};

document.getElementById('calculate').addEventListener('click', calculateResult);

document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateResult();
    }
});
