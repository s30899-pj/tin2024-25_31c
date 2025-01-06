class Car {
    constructor(year, mileage, starting_price) {
        this.year = year;
        this.mileage = mileage;
        this.starting_price = starting_price;
        this.end_price = starting_price;
    }

    increasePrice(){
        this.starting_price += 1000;
    }

    reductionPriceDate(){
        const date = new Date().getFullYear();
        const factor =  date - this.year

        this.end_price -= 1000 * factor;
    }
    
    reductionPriceMileage(){
        const factor = Math.floor(this.mileage / 100000);
        
        this.end_price -= 10000 * factor;
    }

    updatePriceMileage(newYear, newMileage){
        this.year = newYear;
        this.mileage = newMileage;
        this.end_price = this.starting_price;

        this.reductionPriceDate();
        this.reductionPriceMileage();
    }

}

function addCarIfEligible(cars) {
    const eligibleCars = [];

    cars.forEach(car => {
        if (car.starting_price > 10000) {
            eligibleCars.push(car);
            console.log(`Samochód został dodany: ${JSON.stringify(car)}`);
        } else {
            console.log(`Samochód ${JSON.stringify(car)} nie został dodany, ponieważ nie spełnia warunków.`);
        }
    });

    return eligibleCars;
}

function increaseCarYear (cars) {
    if (!Array.isArray(cars)) {
        console.error("Błąd: cars nie jest tablicą!");
        return;
    }

    cars.forEach(car => {
        car.year += 1;
        console.log(`Zaaktualizowano rok auta: ${JSON.stringify(car)}`);
    });
}

const car = new Car(2015, 150000, 50000);

car.increasePrice();
console.log(`Cena poczatkowa po powiekszeniu: ${car.starting_price}`);

car.reductionPriceDate();
console.log(`Cena koncowa po redukcji na podstawie wieku: ${car.end_price}`);

car.reductionPriceMileage();
console.log(`Cena koncowa po redukcji na podstawie przebiegu: ${car.end_price}`);

car.updatePriceMileage(2016, 160000);
console.log(`Cena koncowa po aktualizacji: ${car.end_price}`);

const cars = [
    new Car(2000, 250000, 9000),
    new Car(2005, 190000, 40000),
    new Car(2010, 120000, 65000),
]

const eligibleCars = addCarIfEligible(cars);

console.log("Tablica samochodow spelniajacych kryteria:");
console.log(eligibleCars);

increaseCarYear(eligibleCars);

console.log("Tablica aut po zwiekszeniu roku:");
console.log(eligibleCars);