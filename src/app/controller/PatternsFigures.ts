import { matrix, positions } from "../interfaces/Models";
import Common from "./Common";
import ModelMatrix from "./ModelMatrix";
import ModelPositions from "./ModelPositions";
import TestMatrixWithPatterns from "./TestMatrixWithPatterns";

export default class PatternsFigures {

  fnFigures: Array<{ id: number, fn: Function }> = [];
  classTest: TestMatrixWithPatterns;
  static matrixSolution: matrix;
  static createPermuts: Array<any> = [];
  matrixCombinations: Array<ModelMatrix> = [];


  constructor(classTest: TestMatrixWithPatterns, matrixOrigin: matrix, id: number, start: number = 0, limit: number = 1000) {

    this.classTest = classTest;
    this.fnFigures.push({ id: 1, fn: this.boat1 });
    this.fnFigures.push({ id: 2, fn: this.cruise });
    this.fnFigures.push({ id: 3, fn: this.cruiseS3_1 });
    this.fnFigures.push({ id: 4, fn: this.cruiseS3_UP2X });
    this.fnFigures.push({ id: 5, fn: this.BoatLong });
    this.fnFigures.push({ id: 6, fn: this.BoatShort_2T });
    this.fnFigures.push({ id: 7, fn: this.corners });


    if (!PatternsFigures.createPermuts.length) {
      let rangeCombinations = this.fnFigures.map(el => el.fn);
      PatternsFigures.createPermuts = this.permutes(rangeCombinations);
    }

    let combinations = PatternsFigures.createPermuts;

    console.log(combinations.length);
    if (combinations.length > start) {

      if (limit > combinations.length) {
        limit = combinations.length;
      }
    } else {
      start = combinations.length - 1000;
      limit = combinations.length;
    }
    combinations = combinations.slice(start, limit);
    this.execCombination(combinations, matrixOrigin, id);
    this.matrixCombinations = Common.sort(this.matrixCombinations, ["cntBulbs"]);


  }



  execCombination(data: Array<any>, mtx: matrix, id: number) {
    let matrix = new ModelMatrix([...mtx.dataOrigin], id);
    matrix.findFreePositions();

    if (!data.length) return;
    data.forEach((el, idx) => {
      this.matrixCombinations[idx] = new ModelMatrix([...mtx.dataOrigin], idx);
      let matrix = this.matrixCombinations[idx];

      el.forEach((fn:Function) => {
        fn(matrix)
      })
      let pr: Array<any> = matrix.findFreePositions();
      while (pr.length > 0) {
        let p1 = pr[0].data[0] as ModelPositions;
        this.putLightBulb(p1, matrix);
        pr = matrix.findFreePositions();
      }
      matrix.findLastFreePositions().forEach((pos: positions) => {
        this.putLightBulb(pos, matrix);
      })
    });

  }




   boat1 = (matrix: ModelMatrix) => {
    for (let index = 0; index < 2; index++) {
      matrix.findLastFreePositions().forEach((pos1: ModelPositions) => {
        pos1.findPatternFigure(true, true, false);
        if (!!pos1.patternsFig.boat1xManyLeft || !!pos1.patternsFig.boat1xManyRight) {
          this.putLightBulb(pos1, matrix);
        }
      })
    }
  }




  cruise = (matrix: ModelMatrix) => {
    matrix.findLastFreePositions().forEach((pos1: ModelPositions) => {
      pos1.findPatternFigure(true, true);
      if (!!pos1.patternsFig.cruise) {
        this.putLightBulb(pos1, matrix);
      }
    })
  }


  cruiseS3_1 = (matrix: ModelMatrix) => {
    matrix.findLastFreePositions().forEach((pos1: ModelPositions) => {
      pos1.findPatternFigure(true, true);
      if (!!pos1.patternsFig.cruiseS3Up1L1RX || !!pos1.patternsFig.cruiseS3Up1LXR1) {

        this.putLightBulb(pos1, matrix);
      }
    })
  }

  cruiseS3_UP2X = (matrix: ModelMatrix) => {
    matrix.positions.forEach((pos1: ModelPositions) => {
      pos1.findPatternFigure(true, true);
      if (!!pos1.patternsFig.cruiseS3UpL2X) {

        this.putLightBulb(pos1, matrix);
      }
    })
  }

  BoatLong = (matrix: ModelMatrix) => {
    matrix.findLastFreePositions().forEach((pos1: ModelPositions) => {
      pos1.findPatternFigure(true, true);
      if (!!pos1.patternsFig.boat2xManyRight || !!pos1.patternsFig.boat2xManyLeft) {

        this.putLightBulb(pos1, matrix);
      }
    })
  }

  BoatShort_2T = (matrix: ModelMatrix) => {
    matrix.findLastFreePositions().forEach((pos1: ModelPositions) => {
      //if (pos1.idxColumm == 5 && pos1.idxRow == 9)
      pos1.findPatternFigure(true, true);
      if (!!pos1.patternsFig.boat1xManyRight || !!pos1.patternsFig.boat1xManyLeft) {
        this.putLightBulb(pos1, matrix);
      }
    })
  }

  corners = (matrix: ModelMatrix) => {
    matrix.findLastFreePositions().forEach((pos1: ModelPositions) => {
      pos1.findPatternFigure(true, true, true);
      if (!!pos1.patternsFig.corners) {
        this.putLightBulb(pos1, matrix);
      }
    })
  }





  putLightBulb(pos: positions, mtx: matrix) {
    this.classTest.putLightBulb(pos, mtx);
  }


  permutes(permutation: Array<Function>) {
    let length = permutation.length,
      result = [permutation.slice()],
      c = new Array(length).fill(0),
      i = 1, k, p;

    while (i < length) {
      if (c[i] < i) {
        k = i % 2 && c[i];
        p = permutation[i];
        permutation[i] = permutation[k];
        permutation[k] = p;
        ++c[i];
        i = 1;
        result.push(permutation.slice());
      } else {
        c[i] = 0;
        ++i;
      }
    }
    return result;
  }



  getSolution(): matrix {
    if (!PatternsFigures.matrixSolution) {
      PatternsFigures.matrixSolution = this.matrixCombinations[0];
    } else {
      if (this.matrixCombinations[0].cntBulbs < PatternsFigures.matrixSolution.cntBulbs) {
        PatternsFigures.matrixSolution = this.matrixCombinations[0];
      }

    }
    return PatternsFigures.matrixSolution;
  }

}
