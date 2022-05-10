'use strict'

const numbers = '10101011023244546456';
const prova = '3394939sdfdfd02';
const prova1 = '';
const regexp = new RegExp('^[0-9]+$');

console.log(regexp.test(numbers));
console.log(regexp.test(prova));
console.log(regexp.test(prova1));
