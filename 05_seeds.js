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
    console.log(seed);
    const relevantRange = mapRanges.find(range => value >= range.source && value <= range.source + range.range - 1)
    console.log(relevantRange);
    const destination = relevantRange ? relevantRange.destination + (value - relevantRange.source) : value;
    seed[map.to] = destination;
  })
})

console.log(seeds);
console.log(Math.min(...seeds.map(seed => seed.location))); //174137457

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

// This has heap size errors lmao.

const seedPairs = [];
for (let i = 0; i < (seeds.length / 2); i++) {
  seedPairs.push({ ...seeds[(2*i)], length: seeds[(2*i+1)].seed})
}

const locationMapper = maps.find(map => map.to === 'location');
console.log(seedPairs);

const leastLocation = locationMapper.ranges.reduce((acc, cur) => { if (cur.destination < acc.destination) { return cur }  return acc },
  { destination: Infinity });
console.log(leastLocation);
