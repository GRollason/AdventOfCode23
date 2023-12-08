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

// console.log(adjacentNodesByNodeKey);

function processCommand(command, currentNode) {
  indexOfAdjacentNode = command === 'L' ? 0 : 1;
  adjacentNodes = adjacentNodesByNodeKey.get(currentNode);
  return adjacentNodes[indexOfAdjacentNode];
}

function iterateCommands() {
  let steps = 0, node = 'AAA';

  while (node !== 'ZZZ') {
    const commandIndex = steps % commands.length;
    const command = commands[commandIndex];
    node = processCommand(command, node);
    steps++;
  }

  console.log(steps);
}

iterateCommands();

/// PART 2: Start from all nodes ending in 'A' and resolve the commands simultaneously until all current nodes end in Z.
const startingNodes = nodes.filter(node => node.key.endsWith('A')).map(node => node.key);

function solvePart2() {
  let steps = 0;
  let currentNodes = [ 'MJA', 'RGA', 'JMA', 'XHA', 'DQA', 'AAA' ];
  let done = false;

  while (!done) {
    const commandIndex = steps % commands.length;
    const command = commands[commandIndex];
    const nextNodes = currentNodes.map(node => processCommand(command, node));
    const lastLetters = nextNodes.map(node => node.slice(-1));
    const notSatisfied = lastLetters.filter(letter => letter != 'Z').length;
    currentNodes = nextNodes;
    steps++;
    done = notSatisfied === 0;
  }

  console.log(steps);
}



// solvePart2(); runs forever, not sure why, tried a few variations.
const nodesByKey = new Map();

class Node {
  constructor(node) {
    const {key, adjacentNodes} = node;

    this.key = key;
    this.leftNode = adjacentNodes[0];
    this.rightNode = adjacentNodes[1];
  }

  key() {
    return this.key;
  }

  left() {
    return nodesByKey.get(this.leftNode);
  }

  right() {
    return nodesByKey.get(this.rightNode);
  }
}

nodes.forEach(node => nodesByKey.set(node.key, new Node(node)));

const newStartingNodes = startingNodes.map(node => nodesByKey.get(node));
// console.log(newStartingNodes);


function solvePart2() {
  let steps = 0;
  let nodes = newStartingNodes;
  let nodeKeys = newStartingNodes.map(node => node.key);

  while (nodeKeys.some(key => !key.endsWith('Z'))) {
    const command = commands[steps % commands.length];

    nodes = nodes.map(node => command === 'L' ? node.left() : node.right() );
    nodeKeys = nodes.map(node => node.key);
    steps++;
  }

  console.log(steps);
}

// solvePart2();
// console.log(newStartingNodes.map(node => node.left()));

function solveForZs(inputNode) {
  let solutions = [];
  let node = nodesByKey.get(inputNode.key);

  for (let i = 0; i < 100000; i++) {
    const command = commands[i % commands.length];

    node = command === 'L' ? node.left() : node.right();
    if (node.key.endsWith('Z')) {
      solutions.push(i+1);
    }
  }

  return solutions;
}

const Zs = newStartingNodes.map(node => solveForZs(node));

console.log(Zs); // Can observe that the Z solutions are periodic. Cycles will sync up at LCM of periods.

// LCM of 20803, 17873, 23147, 15529, 17287, 19631

function greatestCommonDivisor(a, b) {
  return b === 0 ? a : greatestCommonDivisor(b, a % b);
}

function lowestCommonMultiple(a, b) {
  return Math.abs((a * b) / greatestCommonDivisor(a, b));
}

function lowestCommonMultipleOfArray(array) {
  if (!array || array.length < 2) {
    return null;
  }

  let result = array[0];
  for (let i = 1; i < array.length; i++) {
    result = lowestCommonMultiple(result, array[i]);
  }

  return result;
}

const firstZs = Zs.map(Zs => Zs[0]);
console.log(firstZs);

console.log(lowestCommonMultipleOfArray(firstZs));