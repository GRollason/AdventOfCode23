var fs = require('fs');

const input = fs.readFileSync('./inputs/09.txt', {encoding: 'utf-8'});
const lines = input.split('\r\n').filter(line => line !== '');
const histories = lines.map(line => line.split(' ')).map(numArray => numArray.map(num => Number(num)));

// Start by analysing successive differences.
function getDifferenceBetweenTerms(array) {
  const differences = [];
  for (let i = 1; i < array.length; i++) {
    differences.push(array[i] - array[i-1]);
  }
  return differences;
}

function calculateAllDifferences(array) {
  const obj = {0: array};
  let i = 0;

  while (!obj[i].every(el => el === 0)) {
    obj[i + 1] = getDifferenceBetweenTerms(obj[i]);
    i++;
  }

  return obj;
}

const historiesWithDifferences = histories.map(history => calculateAllDifferences(history));

function extrapolateNextValue(historyObject) {
  // Objects sort numerical keys in ascending order, i.e. we can reliably iterate through Object.keys() in reverse.
  const keys = Object.keys(historyObject);

  for (let i = keys.length - 1; i >= 0; i--) {
    const differenceArray = historyObject[keys[i]];
    if (differenceArray.every(el => el === 0)) {
      differenceArray.push(0);
    } else {
      const lastArray = historyObject[keys[i+1]];
      const currentArray = historyObject[keys[i]];
      differenceArray.push(lastArray[lastArray.length - 1] + currentArray[currentArray.length - 1]);
    }
  }
  
  const history = historyObject[0];
  return history[history.length - 1];
}

const extrapolatedNextValues = historiesWithDifferences.map(historyObject => extrapolateNextValue(historyObject));
console.log(extrapolatedNextValues.reduce((acc, value) => acc + value, 0));

function extrapolatePreviousValue(historyObject) {
  const keys = Object.keys(historyObject);

  for (let i = keys.length - 1; i >= 0; i--) {
    const differenceArray = historyObject[keys[i]];
    if (differenceArray.every(el => el === 0)) {
      differenceArray.push(0); // adding 0 to start or end is functionally equivalent, no concerns here.
    } else {
      const lastArray = historyObject[keys[i+1]];
      const currentArray = historyObject[keys[i]];
      const firstCurrent = currentArray[0], firstLast = lastArray[0], newValue = firstCurrent - firstLast;

      historyObject[i] = [newValue, ...currentArray]
    }
  }
  
  return historyObject[0][0];
}

const extrapolatedPreviousValues = historiesWithDifferences.map(historyObject => extrapolatePreviousValue(historyObject));
console.log(extrapolatedPreviousValues.reduce((acc, value) => acc + value, 0));