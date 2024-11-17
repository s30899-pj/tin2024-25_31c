function Pitagoras(a, b, c) {
    
    let liczby = [a, b, c].sort((x, y) => x - y);

    return Math.pow(liczby[0], 2) + Math.pow(liczby[1], 2) === Math.pow(liczby[2], 2);
}

console.log(Pitagoras(3, 4, 5));
console.log(Pitagoras(5, 12, 13));
console.log(Pitagoras(1, 2, 3));

function WypiszLiczby(a, b){

    let liczby

    return 
}