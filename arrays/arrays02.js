// Scrivere una funzione che stampa a console tutti
// e solo gli array contenuti all'interno di un oggetto qualunque

const esempio = {
    name: 'pippo',
    surname: 'chuck',
    nickname: 'elvis',
    married: false,
    age: 16,
    bestfriend: {
        name: 'pluto',
        age: 26
    },
    num: [1, 2, 5],
    foo: [ 100, 514 ]
}

function stampaArrayInOggetto(obj) {
    for (const value of Object.values(obj)) {
        if (Array.isArray(value)) console.log(value);
        if (typeof value == 'object') stampaArrayInOggetto(Object.values(value));
    }
}

stampaArrayInOggetto(esempio);