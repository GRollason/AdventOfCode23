var fs = require('fs');

const input = fs.readFileSync('./inputs/07.txt', {encoding: 'utf-8'});
const lines = input.split('\r\n');

const cardValueByName = { A: 13, K: 12, Q: 11, J: 10, T: 9, 9: 8, 8: 7, 7: 6, 6: 5, 5: 4, 4: 3, 3: 2, 2: 1};
// This is kinda disgusting tbh, but working with numbers makes more sense for comparisons.

function getStrengthFromCards(cards) {
  // Returning simple 7 - 1.
  const uniqueCards = new Set(cards).size;
  if (uniqueCards === 1) {
    // only one unique card, i.e. 5 of a kind
    return 7;
  } else if (uniqueCards === 2) {
    const badName = cards.filter(card => card != cards[0]).length;
    if (badName === 1 || badName === 4) {
      // 4 of a kind.
      return 6;
    }
    // else full house
    return 5;
  } else if (uniqueCards === 3) {
    // either three of a kind or two pair
    if (cards.some(card => cards.filter(nestedCard => nestedCard !== card).length === 2)) {
      // three of a kind
      return 4;
    }
    // two pair
    return 3;
  } else if (uniqueCards === 4) {
    return 2;
  }
  return 1;
}

const hands = lines.map(line => {
  const [hand, bid] = line.split(' '),
    rawCards = hand.split(''),
    cards = rawCards.map(card => cardValueByName[card]),
    strength = getStrengthFromCards(cards);

  return {
    cards,
    bid,
    strength
  }
});

// Sort hands by strength.
hands.sort((a, b) => a.strength - b.strength);
console.log(hands.slice(-10));

// Now need to sort hands by value
function sortByCards(first, second) {
  if (first.strength !== second.strength) {
    return 1;
  }

  for (let i = 0; i < 5; i++) {
    if (first.cards[i] === second.cards[i]) {
      continue;
    }
    if (first.cards[i] < second.cards[i]) {
      return -1;
    }
    return 1;
  }

  return 0;
}

hands.sort((a, b) => sortByCards(a, b));

console.log(hands.slice(-10));

console.log(hands.reduce((sum, hand, index) => { return sum + ((index+1)*hand.bid)}, 0));

// Part 2: J is no longer 'Jack', but is the 'Joker' wildcard which can match with any other card. For secondary ranking purposes, J is considered the lowest now.

const newCardValueByName = { A: 13, K: 12, Q: 11, T: 10, 9: 9, 8: 8, 7: 7, 6: 6, 5: 5, 4: 4, 3: 3, 2: 2, J: 1};

function newStrengthGetter(cards) {
  const nonWildcards = cards.filter(card => card !== 1);
  const nonWildcardAmount = nonWildcards.length;
  const uniqueNonWildcards = new Set(nonWildcards).size;

  if (uniqueNonWildcards === 1) {
    // 5 of a kind. nonWildcardAmount = 1 is captured here. nonWildcardAmount = 0 is not a real consideration given our data.
    return 7;
  } else if (nonWildcardAmount === 2) {
    // more than 1 unique card, i.e. 2/2 unique cards -> 4 of a kind
    return 6;
  } else if (nonWildcardAmount === 3) {
    if (uniqueNonWildcards === 2) {
      // 2 wildcards, 1 normal pair, 1 singleton -> 4 of a kind
      return 6;
    }
    // otherwise 2 wildcards and 3 singletonss -> 3 of a kind
    return 4;
  } else if (nonWildcardAmount === 4) {
    // 1 wildcard and 4 other cards.
    if (uniqueNonWildcards === 2) {
      // either J + pair + pair -> full house, or J + triplet + singleton -> 4 of a kind.
      if (nonWildcards.some(card => nonWildcards.filter(nestedCard => nestedCard === card).length === 3)) {
        // have some triplet
        return 6;
      }
      // two pairs + wildcard -> full house
      return 5;
    }

    if (uniqueNonWildcards === 3) {
      // J, pair, two singletons -> 3 of a kind
      return 4;
    }

    // otherwise just 4 singletones + wildcard = pair;
    return 2;
  } else {
    // no wildcards
    return getStrengthFromCards(cards);
  }
}

const newHands = lines.map(line => {
  const [hand, bid] = line.split(' '),
    rawCards = hand.split(''),
    cards = rawCards.map(card => newCardValueByName[card]),
    strength = newStrengthGetter(cards);

  return {
    cards,
    bid,
    strength
  }
});

newHands.sort((a, b) => a.strength - b.strength);
newHands.sort((a,b) => sortByCards(a, b));
console.log(newHands.reduce((sum, hand, index) => { return sum + ((index+1)*hand.bid)}, 0));