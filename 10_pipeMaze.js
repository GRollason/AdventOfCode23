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
    return [row - 1, column, 'south'];
  }

  if (southernPipe === '|' || southernPipe === 'L' || southernPipe === 'J') {
    return [row + 1, column, 'north'];
  }

  if (easternPipe === '-' || easternPipe === 'J' || easternPipe === '7') {
    return [row + 1, column, 'west'];
  }

  if (westernPipe === '-' || westernPipe === 'F' || westernPipe === 'L') {
    return [row + 1, column, 'east'];
  }
}

function getNextPipeLocation(location, nextDirection) {
  const [row, column] = location;

  if (nextDirection === 'south') {
    return [row + 1, column, nextDirection];
  }

  if (nextDirection === 'north') {
    return [row - 1, column, nextDirection];
  }

  if (nextDirection === 'east') {
    return [row, column + 1, nextDirection];
  }

  if (nextDirection === 'west') {
    return [row, column - 1, nextDirection];
  }
}

function followPipe(pipe, direction, location) {
  console.log('pipe', pipe);
  const nextDirection = directionsByPipe[pipe].filter(newDirection => newDirection !== direction);
  return getNextPipeLocation(location, nextDirection[0]);
}

function traceLoopFromStart() {
  const loop = [];
  const startPipeRow = pipeGrid.findIndex(pipeRow => pipeRow.includes('S'));
  const startPipeColumn = pipeGrid[startPipeRow].findIndex(pipe => pipe === 'S');

  loop.push([startPipeRow, startPipeColumn]);

  // Find something connecting to start.
  const [row, column, direction] = findStartOfLoop(startPipeRow, startPipeColumn);
  loop.push([row, column]);
  let currentPipe = pipeGrid[row][column];
  let lastMove = direction;

  while (currentPipe !== 'S') {
    // follow loop around.
    const [nextRow, nextColumn, nextDirection] = followPipe(currentPipe, lastMove, loop[loop.length - 1]);
    loop.push([nextRow, nextColumn]);
    currentPipe = pipeGrid[nextRow][nextColumn];
    lastMove = nextDirection;
  }

  return loop.length;
}

traceLoopFromStart();