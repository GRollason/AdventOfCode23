var fs = require('fs');

const input = fs.readFileSync('./inputs/03.txt', {encoding: 'utf-8'});
const lines = input.split('\r\n');

// Find set of symbols.
function getSymbolsFromInput(lines) {
  const symbols = [];

  for (i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (j = 0; j < line.length; j++) {
      const character = line[j], parsedInt = parseInt(character);
      if (line[j] !== '.' && Number.isNaN(parsedInt)) {
        symbols.push({value: character, row: i, column: j })
      }
    }
  }

  return symbols;
}

const allSymbols = getSymbolsFromInput(lines);
const symbolSet = new Set(allSymbols.map(({value}) => value).concat('.'));


// Get numbers (and locations) from lines.
function condenseNumbers(numberArray) {
  const condensedNumbers = [];
  numberArray.reduce((lastIndex, currentEntry) => {
    const currentIndex = currentEntry.column;
    if (currentIndex === lastIndex + 1) {
      condensedNumbers[condensedNumbers.length - 1] = {...condensedNumbers[condensedNumbers.length - 1], value: condensedNumbers[condensedNumbers.length - 1].value + currentEntry.value}
    } else {
      condensedNumbers.push(currentEntry);
    }
    return currentIndex;
  }, -2)

  return condensedNumbers;
}

function getNumbersFromLine(line) {
  const characters = line.split('');
  const rawNumbers = [];

  for (let i = 0; i < characters.length; i++) {
    const character = characters[i];
    if (symbolSet.has(character)) {
      continue;
    }

    rawNumbers.push({column: i, value: character})
  }

  const numbers = condenseNumbers(rawNumbers);

  return numbers;
}

function getAllNumbers(lineArray) {
  return lineArray.map((line, index) => getNumbersFromLine(line).map(entry => ({row: index, ...entry}))).flat();
}

const allNumbers = getAllNumbers(lines);

// Check numbers for symbol adjacency.
function symbolBordersNumber(symbol, number) {
  const minRow = number.row - 1;
  const maxRow = number.row + 1;
  const minColumn = number.column - 1;
  const maxColumn = number.column + number.value.length;

  return symbol.row >= minRow && symbol.row <= maxRow && symbol.column >= minColumn && symbol.column <= maxColumn;
}

const partNumbers = allNumbers.filter((number) => allSymbols.some(symbol => symbolBordersNumber(symbol, number)));

// console.log(symbolSet);
// console.log(getNumbersFromLine(lines[0]));
// console.log(allSymbols.slice(0, 50));
// console.log(partNumbers.reduce((acc, cur) => acc + parseInt(cur.value), 0));


// Part 2: A 'GEAR' is any * symbol adjacent to EXACTLY two part numbers. It's gear ratio is the result of multiplying those numbers.

function numberBordersSymbol(number, symbol) {
  const {row: numRow, column: numCol, value: numValue} = number, {row: symRow, column: symCol} = symbol;
  const minRow = symRow - 1;
  const maxRow = symRow + 1;
  const minCol = symCol - 1;
  const maxCol = symCol + 1;

  const numLength = numValue.length;
  const numPositions = [{row: numRow, col: numCol}];
  for (let i = 1; i < numLength; i++) {
    numPositions.push({row: numRow, col: numCol + i})
  }
  // console.log(numPositions)
  return numPositions.some(({row, col}) => row >= minRow && row <= maxRow && col >= minCol && col <= maxCol )
}

const possibleGears = allSymbols.filter(symbol => symbol.value === '*');
const gears = possibleGears.map(gear => {
  const borderingPartNumbers = partNumbers.filter(number => numberBordersSymbol(number, gear));
  if (borderingPartNumbers.length === 2) {
    return {...gear, ratio: parseInt(borderingPartNumbers[0].value) * parseInt(borderingPartNumbers[1].value)}
  } return null;
}).filter(Boolean);

const gearsWithRatios = gears.map(gear => {
  const borderingPartNumbers = partNumbers.filter(number => symbolBordersNumber(number, gear));
  const gearRatio = borderingPartNumbers.reduce((acc, cur) => acc * parseInt(cur.value), 1);
  return {...gear, numbers: [...borderingPartNumbers], gearRatio};
})

// console.log(possibleGears.slice(0,20));
// console.log(gears.slice(0, 10));
console.log(gears);
console.log(gears.reduce((acc, cur) => acc + parseInt(cur.ratio), 0));
// console.log(allSymbols);

// answer is too low - 20724982
// some gears also have a gear ratio of 1???
// gear at 2, 124 isn't being recognised