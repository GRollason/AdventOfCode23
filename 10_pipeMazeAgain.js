var fs = require('fs');

const input = fs.readFileSync('./inputs/10.txt', {encoding: 'utf-8'});
const pipeGrid = input.split('\r\n').map((line, rowIndex) => line.split('').map((value, columnIndex) => ({value, row: rowIndex, column: columnIndex}))).flat();

function findStartLocation() {
  const startPipe = pipeGrid.find(pipe => pipe.value === 'S');

  return [startPipe.row, startPipe.column];
}

function getConnectedPipeLocations(pipe) {
  // takes a pipe object and returns locations of possibly connected pipes.
  // doesn't validate values of connected pipes to ensure legitimate connections.
  const {row, column} = pipe;

  switch (pipe.value) {
    case '|':
      return [[row - 1, column], [row + 1, column]];
    case '-':
      return [[row, column - 1], [row, column + 1]];
    case 'L':
      return [[row - 1, column], [row, column + 1]];
    case 'J':
      return [[row - 1, column], [row, column - 1]];
    case '7':
      return [[row + 1, column], [row, column - 1]];
    case 'F':
      return [[row + 1, column], [row, column + 1]];
    default:
      return [[row, column]];
  }
}

function findPipes(locationArray) {
  const pipes = [];

  locationArray.forEach(location => {
    const pipe = pipeGrid.find(pipe => pipe.row === location[0] && pipe.column === location[1]);
    pipes.push(pipe);
  })

  return pipes;
}

function findFirstLocationInLoop({row, column}) {
  const northernPipe = findPipes([[row - 1, column]])[0];
  const southernPipe = findPipes([[row + 1, column]])[0];
  const easternPipe = findPipes([[row, column + 1]])[0];
  const westernPipe = findPipes([[row, column - 1]])[0];

  // return co-ordinates of next pipe as well as direction we've 'come from' so we don't backtrack.
  if (northernPipe.value === '|' || northernPipe.value === '7' || northernPipe.value === 'F') {
    return [row - 1, column];
  }

  if (southernPipe.value === '|' || southernPipe.value === 'L' || southernPipe.value === 'J') {
    return [row + 1, column];
  }

  if (easternPipe.value === '-' || easternPipe.value === 'J' || easternPipe.value === '7') {
    return [row + 1, column];
  }

  if (westernPipe.value === '-' || westernPipe.value === 'F' || westernPipe.value === 'L') {
    return [row + 1, column];
  }
}

function getLoop() {
  const loop = [];

  const startLocation = findStartLocation();
  const startPipe = findPipes([startLocation])[0];
  loop.push(startPipe);

  // const firstConnectedPipe = findPipes([findFirstLocationInLoop(startPipe)])[0];
  // loop.push(firstConnectedPipe);
  // console.log(firstConnectedPipe);
  const firstConnectedPipe = pipeGrid.find(pipe => pipe.row === startPipe.row && pipe.column === startPipe.column + 1);
  // hacky solution instead of reimplementing this since it was being annoying in this iteration.

  let lastPipe = startPipe;
  let currentPipe = firstConnectedPipe;

  while (currentPipe.value !== 'S') {
    const connectedPipes = findPipes(getConnectedPipeLocations(currentPipe));
    const nextPipe = connectedPipes.find(pipe => !(pipe.row == lastPipe.row && pipe.column == lastPipe.column));
    loop.push(nextPipe);
    lastPipe = currentPipe;
    currentPipe = nextPipe;
  }

  return loop;
}

const loop = getLoop();
loop.forEach(pipe => {
  if (pipe.value === 'S') {
    pipe.value === '-';
  }
})

function solvePart1() {
  console.log(loop.length/2); // S will be double counted but we would have to +1 anyway so this works out nicely.
}

solvePart1();

// Part 2
// Tiles are either inside or outside of the loop, unless they are a part of the loop.
// It should be sufficient to have passed an odd number of 'edge' pieces in each row/column to be within the loop.

const rowBoundaries = ['|', /*'J', 'L',*/ '7', 'F'];

function findTilesInRow(i) {
  const row = pipeGrid.filter(pipe => pipe.row === i);

  let tilesInRow = 0;
  let coefficient = 0;
  
  row.forEach(pipe => {
    if (loop.includes(pipe)) {
      if (rowBoundaries.includes(pipe.value)) {
        coefficient++;
      }
    } else {
      if (coefficient % 2 === 1) {
        tilesInRow++;
      }
    }
  });

  return tilesInRow;
}

function part2scanline() {
  let tilesWithinLoop = 0;

  for (let i = 0; i < 140; i++) {
    tilesWithinLoop += findTilesInRow(i);
  }

  console.log(tilesWithinLoop);
}

part2scanline();

// 1571 is too high
// 450 is also too high


// can try doing shoelace theorem + pick's theorem, seems cool.

// shoelace theorem states that given a set of vertices forming corners of a polygon, we can find twice the area of the polygon by summing the determinants of consecutive vertices.

function getDeterminant(pipe1, pipe2) {
  return (pipe1.row * pipe2.column) - (pipe1.column * pipe2.row)
}

function shoelaceTheorem(vertices) {
  // assumes first vertex is wrapped at end of array (as ours is)
  let area = 0;
  for (let i = 0; i < vertices.length - 2; i++) {
    area += getDeterminant(loop[i], loop[i+1]);
  }

  return area/2;
}

function picksFormula(area, boundaryPoints) {
  return area + 1 - (boundaryPoints/2);
}

function part2PicksTheorem() {
  const vertices = loop.filter(pipe => !['-','|'].includes(pipe.value));
  const area = shoelaceTheorem(vertices);
  const answer = picksFormula(area, loop.length - 1);
  console.log(answer);
}

part2PicksTheorem();

// 345 too low