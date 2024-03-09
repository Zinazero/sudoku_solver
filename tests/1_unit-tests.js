const chai = require('chai');
const assert = chai.assert;

const SudokuSolver = require('../controllers/sudoku-solver.js');

let solver = new SudokuSolver();

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', function (done) {
    var puzzleString = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
    assert.equal(solver.validate(puzzleString).valid, true);
    done();
  });
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function (done) {
    var puzzleString = '1F5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.validate(puzzleString).valid, false);
    assert.equal(solver.validate(puzzleString).reason, "String contains invalid characters");
    done();
  });
  test('Logic handles a puzzle string that is not 81 characters in length', function (done) {
    var puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....';
    assert.equal(solver.validate(puzzleString).valid, false);
    assert.equal(solver.validate(puzzleString).reason, "String does not have a valid length");
    done();
  });
  test('Logic handles a valid row placement', function (done) {
    var puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkRowPlacement(puzzleString));
    done();
  });
  test('Logic handles an invalid row placement', function (done) {
    var puzzleString = '1555.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkRowPlacement(puzzleString));
    done();
  });
  test('Logic handles a valid column placement', function (done) {
    var puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkColPlacement(puzzleString));
    done();
  });
  test('Logic handles an invalid column placement', function (done) {
    var puzzleString = '1.5..2.841.63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkColPlacement(puzzleString));
    done();
  });
  test('Logic handles a valid region (3x3 grid) placement', function (done) {
    var puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isTrue(solver.checkRegionPlacement(puzzleString));
    done();
  });
  test('Logic handles an invalid region (3x3 grid) placement', function (done) {
    var puzzleString = '1555.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.checkRegionPlacement(puzzleString));
    done();
  });
  test('Valid puzzle strings pass the solver', function (done) {
    var puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(typeof solver.solve(puzzleString), "string");
    done();
  });
  test('Invalid puzzle strings fail the solver', function (done) {
    var puzzleString = '1555.2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isFalse(solver.solve(puzzleString));
    done();
  });
  test('Solver returns the expected solution for an incomplete puzzle', function (done) {
    var puzzleString = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    var expectedSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
    assert.equal(solver.solve(puzzleString), expectedSolution);
    done();
  });
});
