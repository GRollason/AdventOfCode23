// Didn't bother making input file for 4 couplets, easier to just manually enter values.

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

function solveQuadratic(a, b, c) {
	const discriminant = Math.sqrt(Math.pow(b, 2) - (4*a*c)),
		divisor = 2*a,
		lead = -1*b;

	return [(lead - discriminant)/divisor, (lead + discriminant)/divisor];
}

function solveIntelligently() {
	// Solve with less brute force for updated input.
	// Time has 8 characters and distance has 15 characters
	// Will have to do something smarter.
	const { time, distance } = newInput;

	// timeHeld * (totalTime - timeHeld) > distance;
	// solve for timeHeld = x
	const zeroes = solveQuadratic(1, -time, distance);

	// ax - x^2 - distance > 0;
	// x^2 - ax + distance < 0;
	// original quadratic has negative coefficient for power of 2
	// space between the zeroes is positive.

	return [Math.ceil(zeroes[0]), Math.floor(zeroes[1])];
}

const zeroes = solveIntelligently();

function checkResult(result) {
	const { time, distance } = newInput;
	return result * (time - result) - distance;
}
console.log(zeroes);

console.log(checkResult(zeroes[0]), checkResult(zeroes[0]+1), checkResult(zeroes[0]-1));
// zeroes[0] is first real value

console.log(checkResult(zeroes[0]), checkResult(zeroes[0]+1), checkResult(zeroes[0]-1));
// zeroes[1] is last real value

console.log(zeroes[1] - zeroes[0] + 1); // Have to add 1 because subtraction omits start number of range.