var fs = require('fs');

const input = fs.readFileSync('./inputs/11.txt', {encoding: 'utf-8'});
const cosmicGrid = input.split('\r\n').map((row, rowIndex) => row.split('').map((column, columnIndex) => ({value: column, row: rowIndex, column: columnIndex}))).flat();

const galaxies = cosmicGrid.filter(entry => entry.value === '#');
galaxies.forEach((galaxy, index) => galaxy.Id = index);

function findEmptyRows() {
  let emptyRows = [];

  for (let i = 0; i <= 139; i++) {
    const entriesInRow = cosmicGrid.filter(entry => entry.row === i);
    if (entriesInRow.some(entry => entry.value === '#')) {
      continue;
    }
    emptyRows.push(i);
  }

  return emptyRows;
}

function findEmptyColumns() {
  let emptyColumns = [];

  for (let i = 0; i <= 139; i++) {
    const entriesInColumn = cosmicGrid.filter(entry => entry.column === i);
    if (entriesInColumn.some(entry => entry.value === '#')) {
      continue;
    }
    emptyColumns.push(i);
  }
  return emptyColumns;
}

const emptyRows = findEmptyRows();
const emptyColumns = findEmptyColumns();

function expandGrid() {
  let rowExpansions = 0;

  emptyRows.forEach(row => {
    cosmicGrid.forEach(cell => {
      if (cell.row > row + rowExpansions) {
        cell.row++;
      }
    });
    for (let i = 0; i <= 139; i++) {
      cosmicGrid.push({value: '.', row, column: i});
    }
    rowExpansions++;
  })

  let columnExpansions = 0;
  emptyColumns.forEach(column => {
    cosmicGrid.forEach(cell => {
      if (cell.column > column + columnExpansions) {
        cell.column++;
      }
    });
    for (let i = 0; i <= 139 + rowExpansions; i++) {
      cosmicGrid.push({value: '.', row: i, column});
    }
    columnExpansions++;
  })
}

// expandGrid();

function getDistance(galaxy1, galaxy2) {
  return Math.abs(galaxy2.column - galaxy1.column) + Math.abs(galaxy2.row - galaxy1.row);
}

function solvePart1() {
  let distances = 0;

  galaxies.forEach(galaxy => {
    const galaxyId =  galaxy.Id;
    galaxiesNotSummed = galaxies.filter(summee => summee.Id > galaxyId);
    distances += galaxiesNotSummed.reduce((total, summee) => total + getDistance(galaxy, summee), 0);
  })

  return distances;
}

// console.log(solvePart1()); // 9947476

function expandGridNTimes(n) {
  let rowExpansions = 0;

  emptyRows.forEach(row => {
    cosmicGrid.forEach(cell => {
      if (cell.row > row + rowExpansions) {
        cell.row += n;
      }
    });
    rowExpansions += n;
  })

  let columnExpansions = 0;
  emptyColumns.forEach(column => {
    cosmicGrid.forEach(cell => {
      if (cell.column > column + columnExpansions) {
        cell.column += n;
      }
    });
    columnExpansions += n;
  })
}

expandGridNTimes(999999);
console.log(solvePart1()); // 9947476 with n = 1
// 10467407 when n = 2
// 10987338 when n = 3

// increases by 519931 each time, it's a linear transformation.

// console.log(9947476 + (519931 * 999999));

// not sure why I had to go 1 lower on this :think: