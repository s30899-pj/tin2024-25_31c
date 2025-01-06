function pythagoras(a, b, c) {

    // return (
    //     (a * a + b * b === c * c) ||
    //     (a * a + c * c === b * b) ||
    //     (b * b + c * c === a * a)
    // );

    let numbers = [a, b, c].sort((x, y) => x - y);

    return Math.pow(numbers[0], 2) + Math.pow(numbers[1], 2) === Math.pow(numbers[2], 2);
}

console.log(pythagoras(3, 5, 4));
console.log(pythagoras(5, 7, 11));
console.log(pythagoras(2, 4, 3));
console.log("");

function writeNumbers(a, b, c){

    for (let i = a; i <= b; i ++){
        if (i !== 0 && i % c === 0){
            console.log(i);
        }
    }
}

writeNumbers(0,10,2);
console.log("");

function multiplicationTable (a) {
    for (let i = 1; i <= a; i++) {
        let row  = "";
        for (let j = 1; j <= a; j++){
            row += (i * j) + " ";
        }
        console.log(row.trim());
    }
}

multiplicationTable(3);
console.log("");

function fibonacci(n) {
    let fib = [0, 1];

    if (n === 1) {
        console.log(fib[0]);
        return;
    }

    if (n === 2) {
        console.log(fib.join(' '));
        return;
    }

    for (let i = 2; i < n; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
    }

    console.log(fib.join(' '));
}

fibonacci(10);
console.log("");

function tree (a) {
   for (let i  =1; i <= a; i++) {
       console.log("*".repeat(i));
   }
}

tree(5);
console.log("");

function nightTree (height) {
    const maxWidth = height * 2 - 1;
    
    console.log("*".repeat(maxWidth));
    
    for (let i = 0; i < height - 2; i++) {
        const stars = "*".repeat((maxWidth / 2) - i);
        const spaces = " ".repeat(i * 2 + 1);
        console.log(stars + spaces + stars);
    }
    
    console.log("*".repeat(maxWidth));
}

nightTree(10);
console.log("");

function areaOfShapes(shape, a, b, h) {
    
    function areaOfRectangle (a, b) {
        return a * b;
    }

    function areaOfTrapezoid (a, b, h) {
        return ((a + b) * h) / 2;
    }

    function areaOfParallelogram (a, h) {
        return a * h;
    }

    function areaOfTriangle (a, h) {
        return (a * h) / 2;
    }

    switch (shape) {
        case "rectangle":
            return areaOfRectangle(a, b);
        case "trapezoid":
            return areaOfTrapezoid(a, b, h);
        case "parallelogram":
            return areaOfParallelogram(a, b);
        case "triangle":
            return areaOfTriangle(a, b);
        default:
            return "Unknown shape!";
    }
}

console.log(areaOfShapes("rectangle", 5, 10));
console.log(areaOfShapes("trapezoid", 5, 7, 8));
console.log(areaOfShapes("parallelogram", 4, 6));
console.log(areaOfShapes("triangle", 6, 8));
console.log("");

function areaOfShapesv2(figure, a, b, h) {
    const areaCalculators = {
        "rectangle": (a, b) => a * b,
        "trapezoid": (a, b, h) => ((a + b) * h) / 2,
        "parallelogram": (a, h) => a * h,
        "triangle": (a, h) => (a * h) / 2 
    };

    return areaCalculators[figure](a, b, h);
}

console.log(areaOfShapesv2("rectangle", 5, 10));  
console.log(areaOfShapesv2("trapezoid", 5, 10, 4)); 
console.log(areaOfShapesv2("parallelogram", 5, 4));
console.log(areaOfShapesv2("triangle", 5, 4));
console.log("");

function printPascalsTriangle(height) {
    let triangle = pascalTriangle(height);
    
    for (let row of triangle) {
        console.log(row.join(' ').padStart(height + row.length, ' '));
    }
    
    function pascalTriangle(height) {
        let triangle = [[1]];

        for (let row = 1; row < height; row++) {
            let newRow = [1];
            
            for (let col = 1; col < row; col++) {
                newRow.push(triangle[row - 1][col - 1] + triangle[row - 1][col]);
            }

            newRow.push(1);
            triangle.push(newRow);
        }
        
        return triangle;
    }
}

printPascalsTriangle(5);
console.log("");

function censorship(forbiddenWords, sentence) {
        forbiddenWords.forEach(word => {
            let regex = new RegExp(word, 'gi');
            sentence = sentence.replace(regex, '*');
        });
        return sentence;
}

console.log(censorship(['Ala', 'kot'], 'Ala ma kota i psa'));
console.log(censorship(['psa', 'kot'], 'Ala ma psa i kotke'));