var fs = require('fs');

const textFile = fs.readFileSync('./inputs/13.txt', {encoding: 'utf-8'});
const grids = textFile.split('\r\n\r\n');
const patterns = grids.map(grid => grid.split('\r\n'));

function transposeGrid(grid) {
  const newGrid = [];

  const columns = grid[0].length;

  for (let i = 0; i < columns; i++) {
    let transposedEntry = '';
    for (let j = 0; j < grid.length; j++) {
      transposedEntry += grid[j][i];
    }
    newGrid.push(transposedEntry);
  }

  return newGrid;
}

function findHorizontalReflection(pattern) {
  for (let i = 0; i < pattern.length - 1; i++) {
    if (pattern[i] === pattern[i + 1]) {
      const distanceToEdge = Math.min([i, pattern.length - 2 - i]);
      const valuesToCheck = [];

      for (let j = 1; j < distanceToEdge; j++) {
        valuesToCheck.push(j);
      }

      if (valuesToCheck.every(value => pattern[i - value] === pattern[i + 1 + value])) {
        return i + 1;
      }
    }
  }

  return null;
}

function findReflectionValue(pattern) {
  const horizontalValue = findHorizontalReflection(pattern);
  if (horizontalValue) {
    return 100 * horizontalValue;
  } else {
    return findHorizontalReflection(transposeGrid(pattern));
  }
}

console.log(patterns.map(pattern => findReflectionValue(pattern)).reduce((acc, cur) => acc + cur, 0));
console.log(patterns.map(pattern => findReflectionValue(pattern)));