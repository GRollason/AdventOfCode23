var fs = require('fs');

const input = fs.readFileSync('./inputs/12.txt', {encoding: 'utf-8'});
const lineObjects = input.split('\r\n').map(line => line.split(' ')).map(([characters, lengths]) => ({
  characters: [...characters.split('')],
  lengths: [...lengths.split(',').map(length => parseInt(length))]
}));

const first10 = lineObjects.slice(0, 10);

function trimLine(line) {
  if (line.characters[0] === '.') {
    line.characters.splice(0, 1);
  }

  if (line.characters[line.characters.length - 1] === '.') {
    line.characters.splice(line.characters.length - 1, 1);
  }

  if (line.characters[0] === '#') {
    const inputLength = line.lengths[0];
    line.characters.splice(0, inputLength + 1);
    line.lengths.splice(0, 1);
  }

  if (line.characters[line.characters.length - 1] === '#') {
    const inputLength = line.lengths[line.lengths.length - 1];
    line.characters.splice(line.characters.length - inputLength - 1, inputLength + 1);
    line.lengths.splice(line.lengths.length - 1, 1);
  }
}

function fillEndBlocks(line) {
  const firstDamaged = line.characters.findIndexOf('#');
  const lastDamaged = line.characters.findLastIndexOf('#');

  const firstUndamaged = line.characters.findIndexOf('.');
  const lastUndamaged = line.characters.findLastIndexOf('.');
  
  const firstLength = line.lengths[0];
  const lastLength = line.lengths[line.lengths.length - 1];

  if (firstDamaged < firstUndamaged) {

    line.characters.splice()
  }
}

function processLine(line) {
  let processing = true;

  while (processing === true) {
    const length = line.characters.length,
      unknowns = line.characters.filter(char => char === '?').length;

    // remove obvious blanks and inputs from each end
    trimLine(line);

    // fill in blocks from either side and simplify lengths array
    fillEndBlocks(line);

    const lineFullySimplified = !line.characters.some(char => char === '#');
    const newUnknowns = line.characters.filter(char => char === '?').length;
    if (lineFullySimplified || (line.characters.length === length && unknowns === newUnknowns)) {
      processing = false;
    }
  }
}

function chunkLine(line) {
  return [line];
}

function solveChunk(chunk) {
  return 0;// some sort of n choose x
} 

function solveChunks(chunks) {
  return chunks.reduce((acc, cur) => acc + solveChunks(cur), 0);
}

function solveLine(line) {
  trimLine(line);

  const chunks = chunkLine(line);

  return solveChunks(chunks);
}

function solvePart1() {
  let solutions = 0;

  for (line in lineObjects) {
    solutions += solveLine(line);
  }

  return solutions;
}

first10.forEach(line => processLine(line));
console.log(first10);