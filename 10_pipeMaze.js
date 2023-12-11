var fs = require('fs');
const { start } = require('repl');

const input = fs.readFileSync('./inputs/10.txt', {encoding: 'utf-8'});
const pipeGrid = input.split('\r\n').map((line) => line.split('').map(character => character));
// 140 * 140 grid of pipes.

/*
PIPE RULES:
| is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
. is ground; there is no pipe in this tile.
*/
const directionsByPipe = {
  '|': ['north', 'south'],
  '-': ['east', 'west'],
  'L': ['north', 'east'],
  'J': ['north', 'west'],
  '7': ['south', 'west'],
  'F': ['south', 'east']
}

function findStartOfLoop(row, column) {
  const northernPipe = pipeGrid[row - 1][column];
  const southernPipe = pipeGrid[row + 1][column];
  const easternPipe = pipeGrid[row][column + 1];
  const westernPipe = pipeGrid[row][column - 1];

  // return co-ordinates of next pipe as well as direction we've 'come from' so we don't backtrack.
  if (northernPipe === '|' || northernPipe === '7' || northernPipe === 'F') {
    return [row - 1, column];
  }

  if (southernPipe === '|' || southernPipe === 'L' || southernPipe === 'J') {
    return [row + 1, column];
  }

  if (easternPipe === '-' || easternPipe === 'J' || easternPipe === '7') {
    return [row + 1, column];
  }

  if (westernPipe === '-' || westernPipe === 'F' || westernPipe === 'L') {
    return [row + 1, column];
  }
}

function newLocationFromDirection(location, direction) {
  const [row, column] = location;
  switch (direction) {
    case 'north':
      return [row - 1, column];
    case 'south':
      return [row + 1, column];
    case 'east':
      return [row, column + 1];
    case 'west':
      return [row, column - 1];
  }
}

function getNextPipe(pipe, currentLocation, lastLocation) {
  const directions = directionsByPipe[pipe];
  const connectedPipes = directions.map(direction => newLocationFromDirection(currentLocation, direction));
  // returns location only but not pipe value
  return connectedPipes.find(location => location != lastLocation);
}

function getLoopLength() {
  const loop = [];
  const startPipeRow = pipeGrid.findIndex(pipeRow => pipeRow.includes('S'));
  const startPipeColumn = pipeGrid[startPipeRow].findIndex(pipe => pipe === 'S');

  loop.push([startPipeRow, startPipeColumn]);

  // Find something connecting to start.
  const [row, column] = findStartOfLoop(startPipeRow, startPipeColumn);
  loop.push([row, column]);
  let currentPipe = pipeGrid[row][column];

  while (currentPipe !== 'S') {
    // follow loop around.
    const [nextRow, nextColumn] = getNextPipe(currentPipe, loop[loop.length - 1], loop[loop.length - 2]);
    console.log(currentPipe, nextRow, nextColumn)
    loop.push([nextRow, nextColumn]);
    currentPipe = pipeGrid[nextRow][nextColumn];
  }

  return loop.length;
}

getLoopLength();

// gets first location
// finds 7 to the east
// heads south and finds J
// j doesn't have south in its directions so returns first found == north -> heads back to 7, repeat.
// need to fix directionsByPipe