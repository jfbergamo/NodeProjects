// Scrivere un frammento di codice per trovare il numero piu' grande di un array.
// L'array puo' contenere qualunque cosa..

let esempio = ['pippo', 'chuck', 'elvis', 'arnold', false, 12.5, {name: "pluto", age: 2642}, [1251, 75, -3], 100, 514];

function findBiggest(arr, max = -Infinity) {
    if (typeof arr == 'number') return Math.max(arr, max);
    if (typeof arr == 'object') Object.values(arr).forEach((elem) => max = findBiggest(elem, max));
    return max;
}

console.log(findBiggest(esempio));