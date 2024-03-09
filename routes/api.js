'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;

      if (!puzzleString || !coordinate || !value) {
        res.json({ error: "Required field(s) missing" });
      }
      
      if (!solver.validate(puzzleString).valid) {
        if (solver.validate(puzzleString).reason === "String does not have a valid length") {
          res.json({ error: "Expected puzzle to be 81 characters long"  });
        } else if (solver.validate(puzzleString).reason === "String contains invalid characters") {
          res.json({ error: "Invalid characters in puzzle" })
        }
      }

      if (!solver.validateCoordinate(coordinate).valid) {
        res.json({ error: "Invalid coordinate" });
      }

      if (!solver.validateValue(value).valid) {
        res.json({ error: "Invalid value" });
      }

      const index = solver.coordinateFinder(coordinate);
      const puzzleArray = puzzleString.split("")
      puzzleArray.splice(index, 1, String(value));
      const testPuzzleString = puzzleArray.join("");


      if (
        solver.checkRowPlacement(testPuzzleString) && 
        solver.checkColPlacement(testPuzzleString) && 
        solver.checkRegionPlacement(testPuzzleString)
      ) {      
        res.json({ valid: true, string: testPuzzleString })
      } else {
        const response = { valid: false, conflict: [] };
        if (!solver.checkRowPlacement(testPuzzleString)) {
          response.conflict.push("row");
        }
        if (!solver.checkColPlacement(testPuzzleString)) {
          response.conflict.push("column");
        }
        if (!solver.checkRegionPlacement(testPuzzleString)) {
          response.conflict.push("region");
        }
        res.json(response);
      }
      
      

      
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;

      if (!puzzleString) {
        res.json({ error: "Required field missing" });
      }

      if (!solver.validate(puzzleString).valid) {
        if (solver.validate(puzzleString).reason === "String does not have a valid length") {
          res.json({ error: "Expected puzzle to be 81 characters long"  });
        } else if (solver.validate(puzzleString).reason === "String contains invalid characters") {
          res.json({ error: "Invalid characters in puzzle" })
        }
      }

      const solution = solver.solve(puzzleString);
      
      if (!solution) {
        res.json({ error: "Puzzle cannot be solved" });
        return;
      }

      res.json({ solution: solution })
    });
};
