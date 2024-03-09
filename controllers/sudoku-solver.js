class SudokuSolver {
  validate(puzzleString) {
    if (puzzleString.length != 81) {
      return {
        valid: false,
        reason: "String does not have a valid length"
      };
    }

    const invalidCharsRegex = /[^1-9.]/;
    if (invalidCharsRegex.test(puzzleString)) {
      return {
        valid: false,
        reason: "String contains invalid characters"
      };
    }

    return {
      valid: true
    };
  }

  checkRowPlacement(puzzleString) {
    const puzzleArray = puzzleString.split("");
    const rowArray = [];

    for (let i = 0; i < puzzleArray.length; i += 9) {
      rowArray.push(puzzleArray.slice(i, i + 9));
    }
    const filterArray = rowArray.map((row) => row.filter((num) => num !== "."));
    const duplicates = filterArray.map((row) =>
      row.filter((num, index) => row.indexOf(num) !== index)
    );
    const result = duplicates.map((x) => {
      if (x.length === 0) {
        return true;
      } else {
        return false;
      }
    });
    if (result.every((x) => x === true)) {
      return true;
    } else {
      return false;
    }
  }

  checkColPlacement(puzzleString) {
    const puzzleArray = puzzleString.split("");
    const columnArray = [[], [], [], [], [], [], [], [], []];

    for (let i = 0; i < puzzleArray.length; i++) {
      const columnIndex = i % 9;
      columnArray[columnIndex].push(puzzleArray[i]);
    }
    const filterArray = columnArray.map((col) =>
      col.filter((num) => num !== ".")
    );
    const duplicates = filterArray.map((col) =>
      col.filter((num, index) => col.indexOf(num) !== index)
    );
    const result = duplicates.map((x) => {
      if (x.length === 0) {
        return true;
      } else {
        return false;
      }
    });
    if (result.every((x) => x === true)) {
      return true;
    } else {
      return false;
    }
  }

  checkRegionPlacement(puzzleString) {
    const puzzleArray = puzzleString.split("");
    const regionColArray = [];
    const columnArray = [[], [], [], [], [], [], [], [], []];
    const operationArray = [];
    
    for (let i = 0; i < puzzleArray.length; i++) {
      const columnIndex = i % 9;
      columnArray[columnIndex].push(puzzleArray[i]);
    }
    for (let i = 0; i < 9; i += 3) {
      columnArray.map(x => operationArray.push(x.slice(i, i + 3)));
    }
    for (let i = 0; i < operationArray.length; i += 3) {
      regionColArray.push(operationArray.slice(i, i + 3));
    }
    
    const regionArray = regionColArray.map(subarray => [].concat(...subarray));
    
    const filterArray = regionArray.map((region) => region.filter((num) => num !== "."));
    const duplicates = filterArray.map((region) => region.filter((num, index) => region.indexOf(num) !== index));
    const result = duplicates.map((x) => {
      if (x.length === 0) {
        return true;
      } else {
        return false;
      }
    });
    if (result.every((x) => x === true)) {
      return true;
    } else {
      return false;
    }
  }
  
  getCandidates(puzzleString, index) {
    const candidates = [];
    
    for (let num = 1; num <= 9; num++) {
      const candidate = num.toString();
      const newPuzzleString = puzzleString.slice(0, index) + candidate + puzzleString.slice(index + 1);
      if (
        this.checkRowPlacement(newPuzzleString) && 
        this.checkColPlacement(newPuzzleString) && 
        this.checkRegionPlacement(newPuzzleString)
      ) {
        candidates.push(candidate)
      }
    }
    
    return candidates;
  }
  

  solve(puzzleString) {
    if (!puzzleString.includes(".")) {
        return puzzleString;
        }
    
    const emptyCellIndex = puzzleString.indexOf(".");
    const candidates = this.getCandidates(puzzleString, emptyCellIndex);
    
    for (const candidate of candidates) {
      const newPuzzleString = puzzleString.substring(0, emptyCellIndex) + candidate + puzzleString.substring(emptyCellIndex + 1);
      
      const solvedPuzzle = this.solve(newPuzzleString);
      if (typeof solvedPuzzle === "string") {
        return solvedPuzzle;
      }
    }
    
    return false;
  }

  validateValue(value) {
    const valueTest = /[^1-9]/
    if (value.length !== 1) {
      return {
        valid: false,
        reason: "Invalid value length"
      }
    }
    if (valueTest.test(value)) {
      return {
        valid: false,
        reason: "Expected number from 1-9"
      }
    }
    return {
      valid: true
    }
  }
  
  validateCoordinate(coordinate) {
    const coordinateArray = coordinate.split("");
    const rowTest = /[^a-i]/i;
    const colTest = /[^1-9]/;
    
    if (coordinateArray.length !== 2) {
      return {
        valid: false,
        reason: "Invalid coordinate length"
      }
    }
    if (rowTest.test(coordinateArray[0])) {
      return {
        valid: false,
        reason: "Invalid row coordinate"
      }
    }
    if (colTest.test(coordinateArray[1])) {
      return {
        valid: false,
        reason: "Invalid column coordinate"
      }
    }
    return {
      valid: true
    };
  }

  coordinateFinder(coordinate) {
    const rowConverter = {
      "A": 0,
      "B": 1,
      "C": 2,
      "D": 3,
      "E": 4,
      "F": 5,
      "G": 6,
      "H": 7,
      "I": 8
    }
    let rowLetter = coordinate.split("")[0];
    let row = rowConverter[rowLetter]
    let col = parseFloat(coordinate.split("")[1]);
    let index = ((row * 9) + col) - 1;
    return index;
  }
}

module.exports = SudokuSolver;

