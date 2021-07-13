import { matrix, patterns, positions } from "../interfaces/Models";
import Common from "./Common";
import ModelMatrix from "./ModelMatrix";
import ModelPatterns from "./ModelPatterns";
import ModelPositions from "./ModelPositions";
import PatternsFigures from "./PatternsFigures";

export default class TestMatrixWithPatterns {


  modelPatterns: ModelPatterns
  manySolutionsForMatrix: Array<matrix> = new Array()
  constructor() {
    this.modelPatterns = new ModelPatterns();
  }

  testPatterns(tempMatrixs: Array<matrix>, start: number = 0, limit: number = 1000) {


    this.modelPatterns.manyPatterns.forEach((pattern: patterns, idx: number) => {
      let mtx: matrix = tempMatrixs[idx + 1];
      if ((pattern.cntMaxColumm >= mtx.cntColumn) && (pattern.cntMaxRows >= mtx.cntRow)) {
        console.log(pattern.name)
        if (!!pattern.iterative) {
          let solMatrix: matrix = { ...this.reverseData(mtx, { reverse: pattern.iterative.column.reverse, priority: pattern.iterative.column.priority }, { reverse: pattern.iterative.row.reverse, priority: pattern.iterative.row.priority }) };
          solMatrix.positions.forEach((pos: positions) => {
            this.putLightBulb(pos, solMatrix);
          })
          this.manySolutionsForMatrix.push(solMatrix);
        }

        if (pattern.id == 1 && !!pattern.particular) {
          let sol = this.findMaxPositions(mtx, idx + 1);
          console.log("SOL1", sol.cntBulbs)
          this.manySolutionsForMatrix.push(sol)
        }

        if (pattern.id == 2 && !!pattern.particular) {
          let sol = this.createPermute(mtx, idx + 1, start, limit);
          console.log("SOL2", sol.cntBulbs)
          this.manySolutionsForMatrix.push(sol)
        }

        if (pattern.id == 3 && !!pattern.particular) {
          let sol = this.findMaxPositionsFirstBoat(mtx, idx + 1);
          console.log("SOL3", sol.cntBulbs)
          this.manySolutionsForMatrix.push(sol)
        }
      }
    })
    this.selectBestSolucions(this.manySolutionsForMatrix, tempMatrixs[0]);

  }


  createPermute(mtx: matrix, id: number, start, limit): matrix {
    return (new PatternsFigures(this, mtx, id, start, limit)).getSolution();
  }



  findMaxPositions(mtx: matrix, id: number): matrix {
    let matrix = new ModelMatrix([...mtx.dataOrigin], id);

    let pr: Array<any> = matrix.findFreePositions();
    let p1 = pr[0].data[0] as ModelPositions;

    while (pr.length > 0) {
      pr = matrix.findFreePositions();
      p1 = pr[0].data[0] as ModelPositions;
      this.putLightBulb(p1, matrix);
      pr = matrix.findFreePositions();
    }
    matrix.findLastFreePositions().forEach((pos: positions) => {
      this.putLightBulb(pos, matrix);
    })

    return matrix;
  }

  findMaxPositionsFirstBoat(mtx: matrix, id: number): matrix {
    let matrix = new ModelMatrix([...mtx.dataOrigin], id);


    for (let index = 0; index < 2; index++) {
      matrix.findLastFreePositions().forEach((pos1: ModelPositions) => {
        pos1.findPatternFigure(true, true, false);
        if (!!pos1.patternsFig.boat1xManyLeft || !!pos1.patternsFig.boat1xManyRight) {
          this.putLightBulb(pos1, matrix);
        }
      })
    }

    let pr: Array<any> = matrix.findFreePositions();
    while (pr.length > 0) {
      pr = matrix.findFreePositions();
      if (!!pr.length && !!pr[0].data[0]) {
        let p1 = pr[0].data[0] as ModelPositions;
        this.putLightBulb(p1, matrix);
      }
      pr = matrix.findFreePositions();
    }
    matrix.findLastFreePositions().forEach((pos: positions) => {
      this.putLightBulb(pos, matrix);
    })

    return matrix;
  }


  selectBestSolucions(sols: Array<matrix>, matrixOrigin: matrix) {

    let resuls: Array<{ idx: number, cntBulbs: number, mtx: matrix }> = new Array();
    sols.forEach((mtx: matrix, idx: number) => {
      let cntBulbs: number = 0;
      mtx.positions.forEach((pos: positions) => {
        if (!!pos.bulb) {
          cntBulbs++;
        }
      })
      mtx.cntBulbs = cntBulbs;
      resuls.push({ idx: idx, cntBulbs: cntBulbs, mtx: mtx });
    });

    resuls = Common.sort(resuls, ["cntBulbs"]);
    let chosenSol: matrix = resuls[0].mtx;

    matrixOrigin.positions.forEach((pos: positions) => {
      if (!pos.wall) {
        let tmp: positions = chosenSol.positions.find((pos1: positions) => {
          return (pos1.valueColumn == pos.valueColumn && pos1.valueRow == pos.valueRow)
        })
        if (!!tmp.bulb) {
          pos.bulb = tmp.bulb;
          matrixOrigin.cntBulbs++;
        }
        if (!!tmp.withLight) {
          pos.withLight = tmp.withLight;
        }
      }
    })
  }




  putLightBulb(pos: positions, mtx: matrix) {
    if (!!!pos.wall) {
      if (!pos.bulb) {
        if (!pos.withLight) {
          pos.withLight = true;
          pos.bulb = true;
          mtx.cntBulbs++;
          this.TurnOnLigthSibblings(pos.adjacentPos.left);
          this.TurnOnLigthSibblings(pos.adjacentPos.rigth);
          this.TurnOnLigthSibblings(pos.adjacentPos.up);
          this.TurnOnLigthSibblings(pos.adjacentPos.down);
        }
      }
    }
  }

  TurnOnLigthSibblings(adjacentPos: Array<positions>): void {
    adjacentPos.forEach((pos: positions) => {
      if (!pos.wall) {
        pos.withLight = true;
      }
    })
  }

  reverseData(matrix: matrix, column: { reverse: boolean, priority: boolean }, row: { reverse: boolean, priority: boolean }) {

    let reverse = (matrix: matrix, type: boolean) => {
      let newDataOrder: Array<positions> = new Array()
      let cnt = 0;
      if (matrix.cntColumn > matrix.cntRow) {
        cnt = matrix.cntColumn;
      } else {
        cnt = matrix.cntRow;
      }

      for (let index = 0; index < cnt; index++) {
        let data: Array<positions> = matrix.positions.filter((pos: positions) => {
          if (!!type) {
            return pos.idxRow == index;
          } else {

            return pos.idxColumm == index;
          }
        });
        data = data.reverse();
        data.forEach(it => {
          newDataOrder.push(it);
        })
      }

      matrix.positions = newDataOrder;
    }




    if (!!column && !!column.priority) {
      if (!!column.reverse) {
        reverse(matrix, true);
      }
      if (!!row.reverse) {
        reverse(matrix, false);
      }

      return matrix;
    }

    if (!!row && !!row.priority) {

      if (!!row.reverse) {
        reverse(matrix, false);
      }
      if (!!column.reverse) {
        reverse(matrix, true);
      }
      return matrix;
    }
  }






}
