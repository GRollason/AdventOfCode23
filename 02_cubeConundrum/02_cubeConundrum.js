var fs = require('fs');

const input = fs.readFileSync('./input.txt', {encoding: 'utf-8'});
const lines = input.split('\r\n');

function findLargestValueInPairsArray(array, classifier) {
  const relevantPairs = array.filter((pair) => pair[1] === classifier);
  const numbers = relevantPairs.map(([number]) => parseInt(number));
  const max = numbers.reduce((acc, cur) => {if (cur > acc) { return cur } return acc }, 0);
  return max;
}

const lineObjects = lines.map((line, index) => {
  const [, cubeInfo] = line.split(': ');
  const sets = cubeInfo.split('; ');
  const pairs = sets.flatMap(set => set.split(', ').map(statement => statement.split(' '))); 

  return {Id: index+1, blue: findLargestValueInPairsArray(pairs, 'blue'), red: findLargestValueInPairsArray(pairs, 'red'), green:  findLargestValueInPairsArray(pairs, 'green')}
});

const possibleGames = lineObjects.filter(game => game.blue < 15 && game.red < 13 && game.green < 14);

console.log(possibleGames.map(({Id}) => Id).reduce((acc, cur) => acc + cur, 0));

console.log(lineObjects.map(({green, red, blue}) => green * red * blue).reduce((acc, cur) => acc + cur, 0))