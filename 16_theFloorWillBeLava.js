var fs = require('fs');

const input = fs.readFileSync('./inputs/16.txt', {encoding: 'utf-8'}).split('\r\n').map((row, rowIndex) => row.split('').map((value, columnIndex) => ({value, row: rowIndex, column: columnIndex}))).flat();
// input is a 110 x 110 grid

function getBeamNextLocation(beam) {
  const {row, column, direction} = beam;

  switch (direction) {
    case 'north':
      return [row, column - 1];
    case 'south':
      return [row, column + 1];
    case 'east':
      return [row + 1, column];
    case 'west':
      return [row - 1, column];
  }
}

function getBeamDirections(cell, direction) {
  if (cell.value === '.') {
    return [direction];
  }

  if (cell.value === '/') {
    switch (direction) {
      case 'north':
        return ['east'];
      case 'south':
        return ['west'];
      case 'west':
        return ['south'];
      case 'east':
        return ['north'];
    }
  }

  if (cell.value === "\\") {
    switch (direction) {
      case 'north':
        return ['west'];
      case 'south':
        return ['east'];
      case 'west':
        return ['north'];
      case 'east':
        return ['south'];
    }
  }

  if (cell.value === '|') {
    if (direction === 'north' || direction === 'south') {
      return [direction]
    }
    return ['east', 'west'];
  }

  if (cell.value === '-') {
    if (direction === 'east' || direction === 'west') {
      return [direction];
    }
    return ['north', 'south'];
  }
}

function resolveBeamMovement(beam) {
  const newLocation = getBeamNextLocation(beam);
  const [newRow, newColumn] = newLocation;
  const currentSquare = input.find(cell => cell.row === newRow && cell.column === newColumn);

  if (currentSquare) {
    const newDirections = getBeamDirections(currentSquare, beam.direction);

    const newBeams = newDirections.map(direction => ({direction, row: newRow, column: newColumn}));
    return newBeams;
  }

  // if no currentSquare is found, the beam has left the grid
  return null;
}

const part1StartingBeams = [{row: 0, column: 0, direction: 'east'}];

function getBeamLocationString(beam) {
  return 'row' + beam.row.toString() + 'column' + beam.column.toString();
}

function getBeamDirectionString(beam) {
  return 'row' + beam.row.toString() + 'column' + beam.column.toString() + 'direction' + beam.direction;
}

function solvePart1(startBeams) {
  const energizedSquares = new Set(), directions = new Set();
  let newSquaresEnergized = true;
  let beams = startBeams;
  energizedSquares.add(...startBeams.map(beam => getBeamLocationString(beam)));

  while (newSquaresEnergized === true) {
    const energizedSquaresStartIteration = energizedSquares.size;
    directions.add(beams.map(beam => getBeamDirectionString(beam)));

    //get new beam locations
    const newBeams = beams.flatMap(beam => resolveBeamMovement(beam)).filter(Boolean);
    newBeams.forEach(beam => {
      energizedSquares.add(getBeamLocationString(beam));
    });

    const energizedSquaresEndIteration = energizedSquares.size;

    if (energizedSquaresStartIteration === energizedSquaresEndIteration) {
      newSquaresEnergized = false;
    }

    // beams = [...newBeams.filter(beam => !directions.has(getBeamDirectionString(beam)))];
    beams = [...newBeams];
  }

  return energizedSquares;
}

const energizedSquaresPart1 = solvePart1(part1StartingBeams);
console.log(energizedSquaresPart1.size); // gives 171 -- too low
console.log(energizedSquaresPart1); // is dying at first splitter