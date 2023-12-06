// To get the calibration value from a line, form a two-digit number from the first and last single-digit number found in the line.
// Return the sum of calibration values for the whole document.

var fs = require('fs');

const input = fs.readFileSync('./inputs/01.txt', {encoding: 'utf-8'});

const lines = input.split('\r\n');
const digitStrings = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const valuesByDigitString = {one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9}

function findFirstDigit(string) {
  for (let i = 0; i < string.length; i++) {
    const parsedInt = parseInt(string[i]);
    if (!Number.isNaN(parsedInt)) {
      return {index: i, value: parsedInt};
    }
  }
}

function findLastDigit(string) {
  for (let i = string.length - 1; i > -1; i--) {
    const parsedInt = parseInt(string[i]);
    if (!Number.isNaN(parsedInt)) {
      return {index: i, value: parsedInt};
    }
  }
}

const calibrationValues = lines.map(line => Number(String(findFirstDigit(line)) + String(findLastDigit(line))));

console.log(calibrationValues.reduce((acc, cur) => acc + cur, 0));

// End of part 1. Part 2: process words as strings as well.

function findFirstDigitWithWords(string) {
  const digitCouplet = findFirstDigit(string);

  const desiredCouplet = digitStrings.map((digitString) => string.includes(digitString) ? {index: string.indexOf(digitString), value: valuesByDigitString[digitString]} : null
    ).filter(Boolean).reduce((acc, cur) => {if (cur.index < acc.index) {return cur} return acc}, digitCouplet);

  return desiredCouplet.value;
}

function findLastDigitWithWords(string) {
  const digitCouplet = findLastDigit(string);

  const desiredCouplet = digitStrings.map((digitString) => string.includes(digitString) ? {index: string.lastIndexOf(digitString), value: valuesByDigitString[digitString]} : null
    ).filter(Boolean).reduce((acc, cur) => {if (cur.index > acc.index) {return cur} return acc}, digitCouplet);

  return desiredCouplet.value;
}

const newCalibrationValues = lines.map(line => Number(String(findFirstDigitWithWords(line)) + String(findLastDigitWithWords(line))));
console.log(newCalibrationValues.reduce((acc, cur) => acc + cur, 0))
console.log(newCalibrationValues.filter(value => value === NaN));

console.log(testLines.map(line => Number(String(findFirstDigitWithWords(line)) + String(findLastDigitWithWords(line)))).reduce((acc, cur) => acc + cur, 0));