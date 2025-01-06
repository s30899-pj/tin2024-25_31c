class Grade {
    constructor(subject, value) {
        this.subject = subject;
        this.value = value;
    }
}

class Student {
    constructor(name, surname) {
        this.name = name;
        this.surname = surname;
        this.gradeTable = [];
        this.average = 0;
    }

    hello() {
        return `Witaj ${this.name} ${this.surname}, Twoja średnia ocen to: ${this.average}.`;
    }

    set grade(grade) {
        if (grade instanceof Grade) {
            this.gradeTable.push(grade);
            this.calculateAverage();
        } else {
            console.error("Błąd: Podano wartość, która nie jest obiektem klasy Grade.");
        }
    }

    get grades() {
        if (this.gradeTable.length === 0) {
            return "Brak ocen.";
        }
        return this.gradeTable
            .map(grade => `Przedmiot: ${grade.subject} - ocena ${grade.value}.`)
            .join(" ");
    }

    calculateAverage() {
        if (this.gradeTable.length === 0) {
            this.average = 0;
        } else {
            const suma = this.gradeTable.reduce((acc, grade) => acc + grade.value, 0);
            this.average = (suma / this.gradeTable.length).toFixed(2);
        }
    }
}

let s = new Student('Jan', 'Kowalski');
console.log(s.hello());

s.grade = new Grade('WPR', 4);
s.grade = new Grade('TIN', 3);
s.grade = new Grade('POJ', 2);

console.log(s.hello());
console.log(s.grades);