var fs = require('fs');

const input = fs.readFileSync('./inputs/12.txt', {encoding: 'utf-8'});
const lineObjects = input.split('\r\n').map(line => line.split(' ')).map(([characters, lengths]) => ({
  characters: [...characters.split('')],
  lengths: [...lengths.split(',')]
}));

const first10 = lineObjects.slice(0, 10);

function trimLine(line) {
  let trimming = true;

  while (trimming === true) {
    const length = line.characters.length;

    if (line.characters[0] === '.') {
      line.characters.splice(0, 1);
    }

    if (line.characters.length === length) {
      trimming = false;
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

first10.forEach(line => trimLine(line));
console.log(first10);