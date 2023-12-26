var fs = require('fs');

const input = fs.readFileSync('./inputs/15.txt', {encoding: 'utf-8'});
const steps = input.split(',');

function algorithmCycle(startValue, charCode) {
  const first = startValue + charCode;
  const second = first * 17;
  return second % 256;
}

function algorithmOnStep(step) {
  const charCodes = [];

  for (let i = 0; i < step.length; i++) {
    charCodes.push(step.charCodeAt(i));
  }

  return charCodes.reduce((acc, cur) => algorithmCycle(acc, cur), 0);
}

const algorithmValues = steps.map(step => algorithmOnStep(step));
console.log(algorithmValues.reduce((acc, cur) => acc + cur, 0)); // 517015 - solves part 1.

const stepObjects = steps.map(step => ({step}));

// get focalLengths and categorise steps (by having or not having a focal length);
stepObjects.forEach(step => {
  if (step.step.includes('=')) {
    // we have an equals operation.
    step.focalLength = parseInt(step.step[step.step.length - 1]);
    step.step = step.step.slice(0, step.step.length - 2);
  } else {
    step.step = step.step.slice(0, step.step.length - 1);
  }

  step.value = algorithmOnStep(step.step);
});

// build map for our boxes.
const boxByIndex = new Map();
for (let i = 0; i < 256; i++) {
  boxByIndex.set(i, []);
}

function processStepObject(stepObject) {
  const boxIndex = stepObject.value;
  const box = boxByIndex.get(boxIndex);
  if (stepObject.focalLength !== undefined) {
    const newBox = box.find(s => s.step == stepObject.step) ? [...box.map(s => s.step == stepObject.step ? stepObject : s)] : [...box, stepObject];
    boxByIndex.set(boxIndex, newBox);
  } else {
    const newBox = [...box.filter(s => s.step != stepObject.step)];
    boxByIndex.set(boxIndex, newBox);
  }
}

stepObjects.forEach(stepObject => processStepObject(stepObject));

function calculateBoxPower(box, boxIndex) {
  if (box.length === 0) {
    return 0;
  }

  return box.reduce((acc, cur, index) => acc + (boxIndex * (index + 1) * cur.focalLength), 0)
}

function solvePart2() {
  let focusingPower = 0;

  for (let i = 0; i < 256; i++) {
    const box = boxByIndex.get(i);
    focusingPower += calculateBoxPower(box, i + 1);
  }

  console.log(focusingPower);
}

solvePart2();

// not sure why the above is broken, but we can try doing it case by case.

function constructBox(index) {
  const stepsForBox = stepObjects.filter(step => step.value === index);

  let box = [];
  let has = [];

  stepsForBox.forEach(step => {
    if (step.focalLength) {
      if (has.includes(step.step)) {
        const matchingIndex = box.findIndex(s => s.step === step.step);
        box.splice(matchingIndex, 1, step);
      } else { 
        box.push(step);
        has.push(step.step);
      }
    } else {
      if (has.includes(step.step)) {
        const matchingIndex = box.findIndex(s => s.step === step.step);
        box.splice(matchingIndex, 1);
        has = [...has.filter(v => v !== step.step)];
      }
    }
  });

  return box;
}

function processBox(boxIndex, box) {
  return box.reduce((acc, cur, index) => acc + (boxIndex * cur.focalLength * (index + 1)), 0);
}

function solve2Again() {
  let focalPower = 0;

  for (let i = 0; i < 256; i++) {
    const box = constructBox(i);
    focalPower += processBox(i + 1, box);
  }

  console.log(focalPower);
}

solve2Again(); // 286104

// Noticed what I did wrong - values from first part don't apply, so boxes are all screwy. Need to run first algorithm on 'label' only (e.g. excluding [0-9-=])
// Sorted.