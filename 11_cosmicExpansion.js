var fs = require('fs');

const input = fs.readFileSync('./inputs/11.txt', {encoding: 'utf-8'});
const cosmicGrid = input.split('\r\n').map((row, rowIndex) => row.split('').map((column, columnIndex) => ({value: column, row: rowIndex, column: columnIndex}))).flat();

const galaxies = cosmicGrid.filter(entry => entry.value === '#');
// console.log(galaxies.length) 448 galaxies

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

function updatePosition(galaxy, index) {
  // const {row, column} = galaxy;

  // const emptyRowsAboveGalaxy = emptyRows.filter(rowIndex => rowIndex < row).length;
  // const emptyColumnsLeftOfGalaxy = emptyColumns.filter(columnIndex => columnIndex < column).length;

  // galaxy.row = row + emptyRowsAboveGalaxy;
  // galaxy.column = column + emptyRowsAboveGalaxy;
  galaxy.Id = index;
}

galaxies.forEach((galaxy, index) => updatePosition(galaxy, index));
console.log(galaxies);

function emptyBetweenGalaxies(galaxy1, galaxy2, index, key) {
  return (galaxy1[key] < index && index < galaxy2[key]) || (galaxy2[key] < index && galaxy1[key] < index);
}

function getDistance(galaxy1, galaxy2) {
  const emptyRowsBetweenGalaxies = emptyRows.filter(rowIndex => emptyBetweenGalaxies(galaxy1, galaxy2, rowIndex, 'row')).length;
  const emptyColumnsBetweenGalaxies = emptyColumns.filter(columnIndex => emptyBetweenGalaxies(galaxy1, galaxy2, columnIndex, 'column')).length;

  return Math.abs(galaxy2.column - galaxy1.column) + Math.abs(galaxy2.row - galaxy1.row) + emptyRowsBetweenGalaxies + emptyColumnsBetweenGalaxies;
}

function getGalaxyDistance(galaxy) {
  const {Id} = galaxy;
  const galaxiesNotSummed = galaxies.filter(galaxy => galaxy.Id > Id);

  return galaxiesNotSummed.reduce((acc, cur) => acc + getDistance(galaxy, cur), 0);
}

function sumGalaxyDistances() {
  return galaxies.reduce((acc, current) => acc + getGalaxyDistance(current), 0);
}

// console.log(sumGalaxyDistances());

// first answer 9617289
// second answer 10190247