import { isFunction } from "util";
import { positions, nexPositionsMatrix, nextFreePositionsMatrix, patterFigure, combinationOfFigure, UP, } from "./../interfaces/Models"
import ModelMatrix from './ModelMatrix';


export default class ModelPositions implements positions {

  idxColumm: number = 0;
  idxRow: number = 0;
  wall: boolean | 0 | 1 = false;
  bulb: boolean = false;
  withLight: boolean = false;
  adjacentPos: nexPositionsMatrix;
  freePositions: nextFreePositionsMatrix;
  patternsFig: patterFigure = {};
  freeCantPositions: number = 0;
  valueColumn: number = 1;
  valueRow: number = 1;
  matrix: ModelMatrix

  constructor(data: ModelMatrix, idxColumm: number, idxRow: number) {
    this.matrix = data;
    this.idxRow = idxRow;
    this.idxColumm = idxColumm;
    this.wall = this.matrix.dataOrigin[idxRow][idxColumm];
    this.calculateValueColumn()
    this.calculateValueRow();

  }


  calculateValueColumn() {

    if (!this.idxColumm) {
      this.valueColumn = 1;
    } else {
      if (this.idxColumm == 1) {
        let pos: positions = this.matrix.findPosition(this.idxColumm - 1, this.idxRow)
        if (!!pos) {
          this.valueColumn = pos.valueColumn + 1
        }

      } else {

        let back1Pos: positions = this.matrix.findPosition(this.idxColumm - 1, this.idxRow)
        let back2Pos: positions = this.matrix.findPosition(this.idxColumm - 2, this.idxRow)
        if (!!back1Pos && !!back2Pos)
          this.valueColumn = back1Pos.valueColumn + back2Pos.valueColumn;
      }
    }
  }

  calculateValueRow() {
    if (!this.idxRow) {
      this.valueRow = 1;
    } else {
      if (this.idxRow == 1) {
        let pos: positions = this.matrix.findPosition(this.idxColumm, this.idxRow - 1);
        if (!!pos) {
          this.valueRow = pos.valueRow + 1;
        }
      } else {
        let back1Pos: positions = this.matrix.findPosition(this.idxColumm, this.idxRow - 1)
        let back2Pos: positions = this.matrix.findPosition(this.idxColumm, this.idxRow - 2)
        if (!!back1Pos && !!back2Pos)
          this.valueRow = back1Pos.valueRow + back2Pos.valueRow;
      }
    }
  }


  findSibblingsPosition(levels: number = 3) {
    this.adjacentPos =
    {
      left: new Array(),
      rigth: new Array(),
      up: new Array(),
      down: new Array(),
      freePos: 0,
      withBulb: 0,
      withLigth: 0
    }
    let leftWall: boolean = false
    let rigthWall: boolean = false
    let upWall: boolean = false
    let downWall: boolean = false

    let findPosition = (adjacentPos: Array<positions>, idxCol: number, idRow: number, continueFind: boolean): boolean => {
      continueFind = !continueFind;
      let pos = this.matrix.findPosition(idxCol, idRow)
      if (!!pos && !!continueFind) {
        !!pos.wall ? continueFind = false : adjacentPos.push(pos);
      } else {
        continueFind = false;
      }
      return !continueFind;
    };


    for (let i = 1; i <= levels; i++) {
      leftWall = findPosition(this.adjacentPos.left, this.idxColumm - i, this.idxRow, leftWall);
      rigthWall = findPosition(this.adjacentPos.rigth, this.idxColumm + i, this.idxRow, rigthWall);
      upWall = findPosition(this.adjacentPos.up, this.idxColumm, this.idxRow - i, upWall);
      downWall = findPosition(this.adjacentPos.down, this.idxColumm, this.idxRow + i, downWall);
    }
  }



  findFreePositions() {

    this.freePositions =
    {
      left: new Array(),
      cntLeft: 0,
      rigth: new Array(),
      cntRigth: 0,
      up: new Array(),
      cntUp: 0,
      down: new Array(),
      cntDow: 0,
      cntTotal: 0
    }
    this.freeCantPositions = 0;

    let findFrePos: Function = (data: Array<positions>): { cnt: number, positions: Array<positions> } => {
      let rt: Array<any> = new Array();
      let cnt: number = 0;
      data.forEach((pos: positions) => {

        let fre: boolean = (!pos.bulb && !pos.withLight)
        if (!!fre) {
          cnt++;
          rt.push({ ...pos })
        }

      })
      return { cnt: cnt, positions: rt }
    }

    if (!this.wall && !this.withLight) {
      let left: { cnt: number, positions: Array<positions> } = findFrePos(this.adjacentPos.left);
      let rigth: { cnt: number, positions: Array<positions> } = findFrePos(this.adjacentPos.rigth);
      let up: { cnt: number, positions: Array<positions> } = findFrePos(this.adjacentPos.up);
      let down: { cnt: number, positions: Array<positions> } = findFrePos(this.adjacentPos.down);

      this.freePositions.left = left.positions;
      this.freePositions.cntLeft = left.cnt;

      this.freePositions.rigth = rigth.positions;
      this.freePositions.cntRigth = rigth.cnt;

      this.freePositions.up = up.positions;
      this.freePositions.cntUp = up.cnt;

      this.freePositions.down = down.positions;
      this.freePositions.cntDow = down.cnt;

      this.freePositions.cntTotal = left.cnt + rigth.cnt + up.cnt + down.cnt
      this.freeCantPositions = this.freePositions.cntTotal;
    }


  }



  findPatternFigure(withLigth?: boolean, withLigthSibblings?: boolean, validateAcrossLigth?: boolean): boolean {

    let up: Array<any> = [];
    let rigth: Array<any> = [];
    let down: Array<any> = [];
    let left: Array<any> = [];

    if (!!this.wall)
      return

    let initPatterns = () => {
      this.patternsFig.boat1xManyRight = false;
      this.patternsFig.boat1xManyLeft = false;


      this.patternsFig.boat2xManyRight = false;
      this.patternsFig.boat2xManyLeft = false;

      this.patternsFig.corners = false;
      this.patternsFig.cornersL1 = false;
      this.patternsFig.cornersL2 = false;
      this.patternsFig.cornersL3 = false;

      this.patternsFig.cruise = false;
      this.patternsFig.cruiseL1 = false;
      this.patternsFig.cruiseL2 = false;
      this.patternsFig.cruiseL3 = false;

      this.patternsFig.cruiseS3X = false;
    }

    // let findSiblingWithligth = (data: Array<any>): number => {

    //   let fl: Boolean = false;
    //   let cnt: number = 0;
    //   data.forEach((pos: positions, idx) => {
    //     if (!fl) {
    //       if (!pos.withLight) {
    //         cnt++;
    //       } else {
    //         fl = true;
    //       }
    //     }
    //   });
    //   return cnt;
    // }

    let findSiblingWithligth2 = (data: Array<any>, withAcrossLigth?: boolean): Array<positions> => {

      let fl: Boolean = false;
      let cnt: number = 0;
      let rs: Array<any> = new Array();
      data.forEach((pos: positions, idx) => {
        if (!fl) {
          if (!!withAcrossLigth) {
            rs.push(pos);
            cnt++;
          } else
            if (!pos.withLight) {
              rs.push(pos);
              cnt++;
            } else {
              fl = true;
            }
        }
      });
      return rs;
    }

    if (!!withLigth)
      if (this.withLight) {
        initPatterns();
        return false
      }

    if (!!withLigthSibblings) {
      up = findSiblingWithligth2(this.adjacentPos.up,validateAcrossLigth);
      rigth = findSiblingWithligth2(this.adjacentPos.rigth,validateAcrossLigth)
      down = findSiblingWithligth2(this.adjacentPos.down,validateAcrossLigth)
      left = findSiblingWithligth2(this.adjacentPos.left,validateAcrossLigth)
    } else {
      up = this.adjacentPos.up;
      rigth = this.adjacentPos.rigth
      down = this.adjacentPos.down;
      left = this.adjacentPos.left;

    }
    let movDirections2: Array<any> = [up, rigth, down, left];



    let rotate2 = (data: Array<any>[4], pattern: Array<combinationOfFigure | number>, restriction?: Function) => {

      let movs: Array<Array<any>> = new Array();
      let flags: Array<boolean> = [true, true, true, true];
      movs.push([data[0], data[1], data[2], data[3]]);
      movs.push([data[3], data[0], data[1], data[2]]);
      movs.push([data[2], data[3], data[0], data[1]]);
      movs.push([data[1], data[2], data[3], data[0]]);

      movs.forEach((mov: Array<any>, idxMov: number) => {
        mov.forEach((pos: Array<any>, idxPos: number) => {
          let rs: boolean = false;
          if (pattern[idxPos] == 0 || typeof pattern[idxPos] == "number") {
            if (pos.length == pattern[idxPos]) {
              rs = true;
            }
          } else {
            if (pos.length >= (pattern[idxPos] as combinationOfFigure).min && pos.length <= (pattern[idxPos] as combinationOfFigure).max) {
              rs = true;
            }
          }
          if (!rs) {
            flags[idxMov] = rs;
          }
        })

      })


      let rs = !!flags.find(el => !!el);
      if (!!rs && !!restriction && !!isFunction(restriction)) {
        let idxMov: number = flags.findIndex(el => !!el);
        return restriction(movs[idxMov]);
      }
      return rs;
    }

    let verifyOtherPos = (data: Array<any>, side: number, restriction?: { left: number | boolean, rigth: number | boolean }) => {

      let rs: boolean = true;
      let posUp: Array<positions>;
      let pos: positions;
      if (!!data[0]) {
        if (side == UP) {
          posUp = (data[0] as Array<positions>);
          if (!posUp.length) return;
          pos = posUp[0];
        }

      } else
        return true;

      if (!!restriction) {
        if (!restriction.left) {
          if (!pos.adjacentPos.left.length) {
            rs = rs && true;
          } else {
            rs = false;
          }
        }

        if (!restriction.rigth) {
          if (!pos.adjacentPos.rigth.length) {
            rs = rs && true;
          } else {
            rs = rs && false;
          }
        }
      }

      return rs;
    }

    this.patternsFig.boat1xManyRight = rotate2(movDirections2, [{ min: 2, max: 3 }, 1, 0, 0]);
    this.patternsFig.boat1xManyLeft = rotate2(movDirections2, [{ min: 2, max: 3 }, 0, 0, 1]);


    this.patternsFig.boat2xManyRight = rotate2(movDirections2, [3, 2, 0, 0]);
    this.patternsFig.boat2xManyLeft = rotate2(movDirections2, [3, 0, 0, 2]);

    this.patternsFig.corners = rotate2(movDirections2, [{ min: 1, max: 3 }, { min: 1, max: 3 }, 0, 0]);
    this.patternsFig.cornersL1 = rotate2(movDirections2, [1, 1, 0, 0]);
    this.patternsFig.cornersL2 = rotate2(movDirections2, [2, 2, 0, 0]);
    this.patternsFig.cornersL3 = rotate2(movDirections2, [3, 3, 0, 0]);

    this.patternsFig.cruise = rotate2(movDirections2, [{ min: 1, max: 3 }, { min: 1, max: 3 }, { min: 1, max: 3 }, { min: 1, max: 3 }]);
    this.patternsFig.cruiseL1 = rotate2(movDirections2, [1, 1, 1, 1]);
    this.patternsFig.cruiseL2 = rotate2(movDirections2, [2, 2, 2, 2]);
    this.patternsFig.cruiseL3 = rotate2(movDirections2, [3, 3, 3, 3]);

    this.patternsFig.cruiseS3X = rotate2(movDirections2, [{ min: 1, max: 3 }, { min: 1, max: 2 }, 0, { min: 1, max: 2 }], (data) => { return verifyOtherPos(data, UP, { left: false, rigth: false }) });
    this.patternsFig.cruiseS3UpL2X = rotate2(movDirections2, [2, { min: 1, max: 2 }, 0, { min: 1, max: 2 }], (data) => { return verifyOtherPos(data, UP, { left: false, rigth: false }) });


    this.patternsFig.cruiseS3Up1L1RX = rotate2(movDirections2, [1, { min: 2, max: 3 }, 0, 1]);
    this.patternsFig.cruiseS3Up1LXR1 = rotate2(movDirections2, [1, 1, 0, { min: 2, max: 3 }]);

  }

  findAllSibblings() {
    // conseguir diagonales....posicion mas cercana inmediadata para crear restricciones
  }



  findLigthPositions() {

  }

  findBulbPositions() {

  }



}
