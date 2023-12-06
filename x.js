/**
 * @copyright 2023 Certinia Inc. All rights reserved.
 */

const input = [
		{ time: 47, distance: 282 },
		{ time: 70, distance: 1079 },
		{ time: 75, distance: 1147 },
		{ time: 66, distance: 1062 }
	],
	newInput = { time: 47707566, distance: 282107911471062 };

function solveForMin({ time, distance }) {
	let solved = false,
		incrementer = 0;
	while (!solved) {
		incrementer++;
		const travelled = incrementer * (time - incrementer);
		if (travelled > distance) {
			solved = true;
		}
	}
	return incrementer;
}

function solveForMax({ time, distance }) {
	let solved = false,
		incrementer = time;
	while (!solved) {
		incrementer--;
		const travelled = incrementer * (time - incrementer);
		if (travelled > distance) {
			solved = true;
		}
	}
	return incrementer;
}

function solveForInput(input) {
	return { min: solveForMin(input), max: solveForMax(input) };
}

input.forEach((input) => {
	Object.assign(input, solveForInput(input));
	input.solutions = input.max - input.min + 1;
});

console.log(input.reduce((acc, cur) => acc * cur.solutions, 1));

function solveIntelligently(input) {
	// Solve with less brute force for updated input.
	// Time has 8 characters and distance has 15 characters
	// Will have to do something smarter.

	timeHeld * (totalTime - timeHeld) > distance;
	// solve for timeHeld = x

	ax - x^2 - distance > 0;
	x^2 - ax + distance < 0;
}

how do we solve a quadratic
x = -b +- Math.sqrt(b^2 - 4ac) / 2a