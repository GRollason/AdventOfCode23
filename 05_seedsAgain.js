var fs = require('fs');

const input = fs.readFileSync('./inputs/05.txt', {encoding: 'utf-8'});
const lines = input.split('\r\n');

const seeds = lines[0].split(': ')[1].split(' ').map(num => Number(num));
const ranges = [];
for (let i = 0; i < seeds.length / 2; i++) {
  ranges.push([seeds[2*i], seeds[2*i] + seeds[2*i + 1] - 1]);
}

const maps = [];
lines.slice(1).filter(str => str != '').forEach((line) => {
  if (line.endsWith(' map:')) {
    const [from, to] = line.replace(' map:', '').split('-').filter(str => str != 'to');
    maps.push({ from, to });
  } else {
    const [destination, source, range] = line.split(' ').map(el => Number(el));
    if (maps[maps.length - 1].ranges) {
      maps[maps.length - 1].ranges.push({ add: destination - source, start: source, end: source + range - 1 });
    } else {
      maps[maps.length - 1].ranges = [{ add: destination - source, start: source, end: source + range - 1 }];
    }
  }
});

maps.forEach(map => map.ranges.sort((a,b) => a.start - b.start));
// Idea: consider range but just loop through ranges in map isntead of using icnrementer?

console.log(ranges);
console.log(maps[0].ranges);

function mapRange(rangeObject, map) {
  const range = rangeObject[map.from];
  const sourceRanges = [];
  const destinationRanges = [];

  let incrementer = range[0];
  const end = range[1];

  if (map.ranges.every(range => range.start > end)) {
    sourceRanges.push([incrementer, end]);
    destinationRanges.push([incrementer, end]);
    incrementer = end + 1;
  }

  if (map.ranges.every(range => range.end < incrementer)) {
    sourceRanges.push([incrementer, end]);
    destinationRanges.push([incrementer, end]);
    incrementer = end + 1;
  }

  while (incrementer <= end) {
    const containingRange = map.ranges.find(range => range.start <= incrementer && range.end >= incrementer);
    if (containingRange) {
      const sourceEnd = containingRange.end <= end ? containingRange.end : end;

      sourceRanges.push([incrementer, sourceEnd]);
      destinationRanges.push([incrementer + containingRange.add, sourceEnd + containingRange.add]);
      incrementer = sourceEnd + 1;
      continue;
    }

    const nextRange = map.ranges.find(range => range.start >= incrementer);
    if (nextRange) {
      const sourceEnd = nextRange.start <= end ? nextRange.start - 1 : end;

      sourceRanges.push([incrementer, sourceEnd]);
      destinationRanges.push([incrementer, sourceEnd]);
      incrementer = sourceEnd + 1;
      continue;
    }
  }

  return sourceRanges.map((sourceRange, index) => {return {...rangeObject, [map.from]: sourceRange, [map.to]: destinationRanges[index]}});
}

// console.log(ranges.flatMap(range => mapRange({seed: range}, maps[0])));

function findRangeMappings() {
  let outputs = ranges.map(range => {return {seed: range}});

  for (let i = 0; i < maps.length; i++) {
    const newOutput = outputs.flatMap(output => mapRange(output, maps[i]));
    outputs = newOutput;
  }

  return outputs;
}

const rangeMappings = findRangeMappings();

const leastLocation = rangeMappings.reduce((returned, current) => current.location[0] < returned.location[0] ? current : returned, {location: [Infinity]});
console.log(leastLocation); // least possible location seems to be 1493866

function findInitialNumber(locationValue) {
  // don't need this function, didn't read question properly lmao
  let value = locationValue;

  for (let i = maps.length - 1; i >= 0; i--) {
    const map = maps[i];
    const ranges = map.ranges;
    const relevantRange = ranges.find(range => range.start + range.add <= value && range.end + range.add >= value);
    if (relevantRange) {
      value -= relevantRange.add;
    }
    // else value stays the same so we gucci
  }

  return value;
}
