var fs = require('fs');

const input = fs.readFileSync('./inputs/04.txt', {encoding: 'utf-8'});
const lines = input.split('\r\n');

function processNumbers(numberString) {
  return numberString.split('  ').flatMap(spaceSeparated => spaceSeparated.split(' ')).filter(str => str != '').map(str => parseInt(str));
}

const cards = lines.map((line, index) => {
  const withoutIndex = line.split(': ')[1];
  const [rawWinning, rawHas] = withoutIndex.split(' | ');
  const winning = processNumbers(rawWinning), has = processNumbers(rawHas);
  const total = winning.length + has.length;
  const joined = new Set([...winning, ...has]);
  const diff = total - joined.size;
  const cardScore = diff === 0 ? 0 : Math.pow(2, diff - 1);

  return { card: index + 1, winning, has, score: cardScore, winningNumbers: diff, instances: 1 }
});

// Did one check where I made sets for winning/has and compared lengths of sets vs arrays on all cards to verify there were no doubled entries.
// If that wasn't confirmed the solution above would be different.

console.log(cards.slice(-10));
console.log(cards.reduce((acc, cur) => acc + cur.score, 0));

cards.forEach((card, index) => { 
  for (let i = 0; i < card.winningNumbers; i++) {
    const cardToCopy = cards[index + i + 1];
    cardToCopy.instances = cardToCopy.instances + card.instances;
  }
})

console.log(cards.slice(-10));
console.log(cards.reduce((acc, cur) => acc + cur.instances, 0));