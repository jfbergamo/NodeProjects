// Scrivere un frammento di codice per trovare il numero piu' grande di un array.
// L'array puo' contenere qualunque cosa..

let esempio = ['pippo', 'chuck', 'elvis', 'arnold', false, 12.5, {name: "pluto", age: 2642}, [1251, 75, -3], 100, 514];

function findBiggest(arr) {
    let biggest;
    arr.forEach((elem) => {
        if (typeof(elem) == 'number' && !isNaN(elem)) {
            if (biggest === undefined || elem > biggest) {
                biggest = elem;
            }
        } else if (Array.isArray(elem)) {
            let bigg = findBiggest(elem);
            if (biggest === undefined || bigg > biggest) {
                biggest = bigg;
            }
        } else if (typeof(elem) == 'object') {
            let bigg = findBiggest(Object.values(elem));
            if (biggest === undefined || bigg > biggest) {
                biggest = bigg;
            }
        }
    });
    return biggest;
}

console.log(findBiggest(esempio));