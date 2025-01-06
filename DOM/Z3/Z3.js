const auta = [
    { rok: 2010, przebieg: 150000, cena_wyjsciowa: 20000, cena_koncowa: 18000 },
    { rok: 2015, przebieg: 80000, cena_wyjsciowa: 30000, cena_koncowa: 27000 },
    { rok: 2020, przebieg: 20000, cena_wyjsciowa: 40000, cena_koncowa: 39000 },
    { rok: 2018, przebieg: 50000, cena_wyjsciowa: 35000, cena_koncowa: 33000 }
];

function createTable(data) {
    const table = document.createElement('table');

    const headers = ['Rok', 'Przebieg (km)', 'Cena Wyjściowa (PLN)', 'Cena Końcowa (PLN)'];
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    data.forEach(auto => {
        const row = document.createElement('tr');
        Object.values(auto).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        table.appendChild(row);
    });

    return table;
}

const tableContainer = document.getElementById('table-container');
const table = createTable(auta);
tableContainer.appendChild(table);
