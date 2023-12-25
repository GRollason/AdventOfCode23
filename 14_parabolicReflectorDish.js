var fs = require('fs');

const input = fs.readFileSync('./inputs/14.txt', {encoding: 'utf-8'});
const grid = input.split('\r\n').map((row, rowIndex) => row.split('').map((column, columnIndex) => ({value: column, row: rowIndex, column: columnIndex}))).flat();
// 100 by 100 grid.

function calculateColumnLoad(rocks) {
  let load = 0, lastBlocker = 0, count = 0;

  for (let i = 0; i < rocks.length; i++) {
    const rock = rocks[i];
    if (rock.value === '#') {
      lastBlocker = rock.row + 1;
      count = 0;
    } else {
      load += (100 - (lastBlocker + count));
      count++;
    }
  }

  return load;
}

function solvePart1(grid) {
  let load = 0;

  for (let i = 0; i < 100; i++) {
    const column = grid.filter(entry => entry.column === i);
    const rocks = column.filter(entry => entry.value !== '.');

    load += calculateColumnLoad(rocks);
  }

  console.log(load);
}

solvePart1(grid); // 105208

// What has been written suffices to calculate the load on the northern support beams for any given grid of the appropriate format.
// Need to find some way to model the position of the rocks after 1 billion cycles.
// Seems likely that the positions will repeat after a while, as there could be stationary rocks forming cyclic patterns to be followed by the mobile rocks.

const stationaryRocks = grid.filter(entry => entry.value === '#');
const mobileRocks = grid.filter(entry => entry.value === 'O');

function tiltNorth(grid) {
  let count = 0, lastStationary = -1;

  for (let i = 0; i < 100; i++) {
    stationaryInColumn = stationaryRocks.filter(rock => rock.column === i);
    mobileInColumn = mobileRocks.filter(rock => rock.column === i);

    mobileRocks.forEach(rock => {
      const nearestStationaryRock = stationaryInColumn.reverse().find(stationary => stationary.row < rock.row);
      if (nearestStationaryRock && nearestStationaryRock.row !== lastStationary) {
        lastStationary = nearestStationaryRock.row;
        count = 0;
      }
      rock.row = lastStationary + 1 + count;
      count++;
    })
  }
}

function tiltSouth(grid) {
  let count = 0, lastStationary = 100;

  for (let i = 0; i < 100; i++) {
    stationaryInColumn = stationaryRocks.filter(rock => rock.column === i);

    mobileRocks.forEach(rock => {
      if (rock.column === i) {
        const nearestStationaryRock = stationaryInColumn.reverse().find(stationary => stationary.row > rock.row);
        if (nearestStationaryRock && nearestStationaryRock.row !== lastStationary) {
          lastStationary = nearestStationaryRock.row;
          count = 0;
        }
        rock.row = lastStationary - 1 - count;
        count++
      }
    })
  }
}

// Need to refactor load calculation to consider rocks only.

function calculateNorthernLoad() {
  let load = 0;

  for (let i = 0; i < 100; i++) {
    const stationary = stationaryRocks.filter(rock => rock.column === i);
    const mobile = mobileRocks.filter(rock => rock.column === i);
    const rocks = [...stationary, ...mobile].sort((a,b) => a.row - b.row);
    console.log(rocks);
  }
}
tiltNorth(grid);
// tiltSouth(grid);

// tilt functions are duplicating rocks atm.
calculateNorthernLoad();