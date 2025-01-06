const container = document.querySelector('.container');

function addDiv() {
    const newDiv = document.createElement('div');
    newDiv.style.backgroundColor = 'lightgray';
    container.appendChild(newDiv);
}

function removeFirstDiv() {
    const firstDiv = container.querySelector('div');
    if (firstDiv) {
        container.removeChild(firstDiv);
    } else {
        alert('Brak elementów do usunięcia!');
    }
}

function changeColor() {
    const thirdDiv = container.querySelectorAll('div')[2];
    if (thirdDiv) {
        thirdDiv.style.backgroundColor = 'lightblue';
    } else {
        alert('Trzeci div nie istnieje!');
    }
}

function changeText() {
    const allDivs = container.querySelectorAll('div');
    allDivs.forEach(div => {
        div.textContent = 'Nowy tekst';
    });
}


document.getElementById('addDiv').addEventListener('click', addDiv);
document.getElementById('removeFirstDiv').addEventListener('click', removeFirstDiv);
document.getElementById('changeColor').addEventListener('click', changeColor);
document.getElementById('changeText').addEventListener('click', changeText);
