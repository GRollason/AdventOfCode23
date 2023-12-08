var fs = require('fs');

const input = fs.readFileSync('./inputs/05.txt', {encoding: 'utf-8'});
const lines = input.split('\r\n');

const seeds = lines[0].split(': ')[1].split(' ').map(numStr => ({ seed: Number(numStr) }));

const maps = [];
lines.slice(1).filter(str => str != '').forEach((line) => {
  if (line.endsWith(' map:')) {
    const [from, to] = line.replace(' map:', '').split('-').filter(str => str != 'to');
    maps.push({ from, to });
  } else {
    const [destination, source, range] = line.split(' ').map(el => Number(el));
    if (maps[maps.length - 1].ranges) {
      maps[maps.length - 1].ranges.push({ destination, source, range });
    } else {
      maps[maps.length - 1].ranges = [{ destination, source, range }];
    }
  }
});

maps.forEach(map => {
  const mapRanges = map.ranges.map(range => ({...range}));

  seeds.forEach(seed => {
    const value = seed[map.from];
    const relevantRange = mapRanges.find(range => value >= range.source && value <= range.source + range.range - 1)
    const destination = relevantRange ? relevantRange.destination + (value - relevantRange.source) : value;
    seed[map.to] = destination;
  })
})

// console.log(Math.min(...seeds.map(seed => seed.location))); //174137457

// Part 2 wants us to treat the seed values as couplets which are in the format [start, rangeLength].
// And find the same minimum location.

// const newSeeds = [];

// for (let i = 0; i < (seeds.length / 2); i++) {
//   const numSeeds = seeds[2*i + 1].seed;
//   const startValue = seeds[2*i].seed;

//   for (let j = 0; j < numSeeds; j++) {
//     newSeeds.push({seed: Number(startValue + j)});
//   }
// 


// console.log(seeds.length);
// console.log(newSeeds.length);

// The above has obvious heap size errors lmao.


// Want fresh copies so we have original number only, first array was mutated into a bunch of objects.
const newSeeds = lines[0].split(': ')[1].split(' ').map(numStr => ({ seed: Number(numStr) }));

const ranges = [];
for (let i = 0; i < (seeds.length / 2); i++) {
  ranges.push({ seed: [newSeeds[(2*i)].seed, newSeeds[(2*i)].seed + newSeeds[(2*i+1)].seed]});
}
ranges.sort((a,b) => a.seed[0] - b.seed[0]);

// Best way to do this is by considering intervals. For simplicity and efficiency, want to sort ranges on maps.
// It is apparent from inspecting the maps after sorting that their ranges border and don't intersect, they are now sorted 'lowest first'.

maps.forEach(map => map.ranges.sort((a,b) => a.source - b.source));

// Want to rename something without breaking previous code.
const newMaps = maps.map(map => {
  const { from, to, ranges: oldRanges } = map;

  const ranges = [...oldRanges].map(({source, destination, range}) => {
    return {
      start: source,
      end: source + range - 1,
      destination
    }
  }).sort((a,b) => a.start < b.start);

  return { from, to, ranges };
});

// isn't working, successfully maps one range from initial bunch but rest just die off.
// function mapRange(seedObject, map) {
//   const rangeObject = seedObject[map.from];
//   const newSeedObjects = [];
//   const newKey = map.to;

//   let incrementer = rangeObject.start;
//   while (incrementer <= rangeObject.end) {
//     if (map.ranges.every(range => range.end < rangeObject.start)) {
//       // whole range is out of mapping region, range maps to itself.
//       newSeedObjects.push({...seedObject, [newKey]: { start: rangeObject.start, end: rangeObject.end }});
//       incrementer = rangeObject.end + 1;
//     } else if (map.ranges.every(range => range.start > rangeObject.end)) {
//       // Whole range is below mapping region, range maps to iself.
//       newSeedObjects.push({...seedObject, [newKey]: { start: rangeObject.start, end: rangeObject.end }});
//       incrementer = rangeObject.end + 1;
//     }
//     relevantRange = map.ranges.find(range => range.start <= incrementer && range.end >= incrementer);
//     if (relevantRange.end >= rangeObject.end) {
//       // From incrementer to range.end is contained in range.
//       const rangeOffset = incrementer - relevantRange.start; 
//       newSeedObjects.push({...seedObject, [newKey]: { start: relevantRange.destination + rangeOffset, end: relevantRange.destination + relevantRange.range} });
//       incrementer = relevantRange.end + 1;
//     } else {
//       // Subset of remaining range is contained in range.
//       const rangeOffsetBottom = incrementer - relevantRange.start;
//       const rangeOffsetTop = relevantRange.end - rangeObject.end;
//       newSeedObjects.push({...seedObject, [newKey]: { start: relevantRange.destination + rangeOffsetBottom, end: relevantRange.destination + relevantRange.range - rangeOffsetTop}});
//       incrementer = relevantRange.end + 1; 
//     }
//   }

//   return newSeedObjects;
// }

// console.log(seedsWithRange);
// const firstranges = seedsWithRange.map(seed => mapRange(seed, newMaps[0])).flat();
// console.log(firstranges);

// function getPart2Answer() {
//   let input = seedsWithRange;
//   for (map in maps) {
//     const newInput = seedsWithRange.flatMap(seed => mapRange(seed, map))
//     input = newInput;
//   }

//   return input.reduce((acc, cur) => { cur.location.start < acc.location.start ? cur : acc }, { location: { start: Infinity }});
// }

// console.log(getPart2Answer());

console.log(ranges);
console.log(newMaps[0].ranges);

// Take a map and build a function that will map a range to a set of ranges produced via that map and make new objects while dissecting the ranges provided.
function mapRangeWithMapperRanges(range, mapperRanges) {
  // mapper ranges are sorted so we can just scan through from the start of the list.
  let incrementer = range[0];
  const rangesFound = [];

  while (incrementer <= range[1]) {
    // look for a mapper which contains the currently scanned value
    const rangeFromMapper = mapperRanges.find(mapperRange => mapperRange.start <= incrementer && mapperRange.end >= incrementer);

    if (rangeFromMapper === undefined) {
      // not found one -> can't map the current range -> maps to itself.
      rangesFound.push({startFrom: incrementer, endFrom: range[1], startTo: incrementer, endTo: range[1]});
      incrementer = range[1] + 1;
      continue;
    }

    const endFrom = range[1] >= rangeFromMapper.end ? rangeFromMapper.end : range[1];
    const startTo = incrementer === rangeFromMapper.start ? rangeFromMapper.destination : rangeFromMapper.destination + (incrementer - rangeFromMapper.start);
    const endTo = range[1] >= endFrom ? rangeFromMapper.destination + (rangeFromMapper.end - rangeFromMapper.start) : rangeFromMapper.destination + (range[1] - incrementer) - 1;

    rangesFound.push({startFrom: incrementer, endFrom, startTo, endTo})
    incrementer = endFrom + 1;
  }

  return rangesFound;
}

function buildMapperFunction(map) {
  const {from, to, ranges} = map;

  return function mapper(rangeObject) {
    const range = rangeObject[from];

    const rangesMappedTo = mapRangeWithMapperRanges(range, ranges);

    return rangesMappedTo.map(rangeMappedTo => Object.assign({}, {...rangeObject, [from]: [rangeMappedTo.startFrom, rangeMappedTo.endFrom], [to]: [rangeMappedTo.startTo, rangeMappedTo.endTo]}));
  }
}

console.log(ranges.flatMap(range => buildMapperFunction(newMaps[0])(range)));

const mappers = maps.map(map => buildMapperFunction(map));

function mapAllRanges() {
  let input = ranges;

  for (let i = 0; i < mappers.length; i++) {
    const newInput = input.flatMap(range => mappers[i](range));
    input = newInput;
  }

  return input;
}

const mappedRanges = mapAllRanges();
console.log(mappedRanges);

const leastLocation = mappedRanges.reduce((returned, current) => current.location[0] < returned.location[0] ? current : returned, { location: [Infinity]});
console.log(mappedRanges.length);

console.log(ranges.flatMap(range => mappers[0](range)));
console.log(mapRangeWithMapperRanges([2, 5], [{destination: 6, start: 1, end: 6}]));

mappedRanges.sort((a,b) => a.location[0] - b.location[0]);
console.log(mappedRanges);