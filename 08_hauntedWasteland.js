var fs = require('fs');

const input = fs.readFileSync('./inputs/08.txt', {encoding: 'utf-8'});
const lines = input.split('\r\n').filter(line => line !== '');

const commands = lines[0].split('');
const nodes = lines.filter(line => line.includes('=')).map(line => line.replace('(', '').replace(')', '')).map(parsedLine => {
  const [key, leftRight] = parsedLine.split(' = '),
  adjacentNodes = leftRight.split(', ');

  return {key, adjacentNodes};
});

const adjacentNodesByNodeKey = new Map();
for (let i = 0; i < nodes.length; i ++) {
  const node = nodes[i];
  adjacentNodesByNodeKey.set(node.key, node.adjacentNodes);
}

console.log(adjacentNodesByNodeKey);

function processCommand(command, currentNode) {
  indexOfAdjacentNode = command === 'L' ? 0 : 1;
  adjacentNodes = adjacentNodesByNodeKey.get(currentNode);
  return adjacentNodes[indexOfAdjacentNode];
}

function iterateCommands() {
  let steps = 0, node = 'AAA';

  while (node !== 'ZZZ') {
    commandIndex = steps % commands.length;
    command = commands[commandIndex];
    node = processCommand(command, node);
    steps++;
  }

  return steps;
}

console.log(iterateCommands());