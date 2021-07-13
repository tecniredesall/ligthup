import { matrix, positions } from "./../interfaces/Models"
import ModelPositions from './ModelPositions';
import Common from "./Common";
import { newArray } from "@angular/compiler/src/util";
export default class ModelMatrix implements matrix {

  public positions: Array<ModelPositions> = new Array();
  public positionsWithOutLigth: Array<ModelPositions> = new Array();
  public cntRow: number = 0;
  public cntColumn: number = 0;
  public dataOrigin: Array<Array<boolean | 0 | 1>> = new Array();
  public id: number = 0;
  cntBulbs: number = 0;

  constructor(dataOrigin: Array<Array<boolean | 0 | 1>>, id: number) {
    this.id = id;
    this.dataOrigin = dataOrigin;
    this.cntRow = this.dataOrigin.length;
    this.cntColumn = this.dataOrigin[this.cntRow - 1].length;
    this.fillDataInMatrix();
    this.positionsWithOutLigth = [...this.positions];
    this.fillSibblingsInMatrix()
    this.findPatternFigures();
  }


  fillDataInMatrix(): void {
    this.dataOrigin.forEach((valueRow, idxRow) => {
      valueRow.forEach((valueColumn, idxColumn) => {
        this.positions.push(new ModelPositions(this, idxColumn, idxRow));
      });
    })
  }

  fillSibblingsInMatrix() {

    this.positions.forEach((pos: ModelPositions) => {
      pos.findSibblingsPosition();
    });
  }


  findPosition(idxColum: number, idxRow: number): ModelPositions {
    let pos: ModelPositions = this.positions.find((pos: positions) => {
      return (pos.idxColumm == idxColum && pos.idxRow == idxRow)
    })
    return pos;
  }


  findFreePositions() {
    this.positions.forEach((pos: ModelPositions) => {
      pos.findFreePositions();
    })

    let freePositions: Array<any> = [...this.positions];
    freePositions = freePositions.filter((pos: positions) => !!!pos.wall)
    freePositions = Common.sort(freePositions, ['freeCantPositions']).reverse();

    let datapos9: Array<ModelPositions> = freePositions.filter((pos: positions) => { return pos.freeCantPositions == 9 })
    let datapos8: Array<ModelPositions> = freePositions.filter((pos: positions) => { return pos.freeCantPositions == 8 })
    let datapos7: Array<ModelPositions> = freePositions.filter((pos: positions) => { return pos.freeCantPositions == 7 })
    let datapos6: Array<ModelPositions> = freePositions.filter((pos: positions) => { return pos.freeCantPositions == 6 })
    let datapos5: Array<ModelPositions> = freePositions.filter((pos: positions) => { return pos.freeCantPositions == 5 })
    let datapos4: Array<ModelPositions> = freePositions.filter((pos: positions) => { return pos.freeCantPositions == 4 })
    let datapos3: Array<ModelPositions> = freePositions.filter((pos: positions) => { return pos.freeCantPositions == 3 })
    let datapos2: Array<ModelPositions> = freePositions.filter((pos: positions) => { return pos.freeCantPositions == 2 })
    let datapos1: Array<ModelPositions> = freePositions.filter((pos: positions) => { return pos.freeCantPositions == 1 })
    let dataFilter: Array<{ cnt: number, data: Array<ModelPositions> }> = new Array();
    dataFilter.push({ cnt: 9, data: datapos9 })
    dataFilter.push({ cnt: 8, data: datapos8 })
    dataFilter.push({ cnt: 7, data: datapos7 })
    dataFilter.push({ cnt: 6, data: datapos6 })
    dataFilter.push({ cnt: 5, data: datapos5 })
    dataFilter.push({ cnt: 4, data: datapos4 })
    dataFilter.push({ cnt: 3, data: datapos3 })
    dataFilter.push({ cnt: 2, data: datapos2 })
    dataFilter.push({ cnt: 1, data: datapos1 })

    dataFilter = dataFilter.filter(i => { return !!i && !!i.data.length })
    dataFilter = Common.sort(dataFilter, ["cnt"]).reverse();
    return dataFilter;

  }

  findLastFreePositions() {

    let lastfreePos = new Array();
    this.positionsWithOutLigth.forEach((pos: ModelPositions) => {
      if (!pos.withLight && !pos.wall) {
        lastfreePos.push(pos);
      }
    })
    this.positionsWithOutLigth = [...lastfreePos];
    //console.log(this.positionsWithOutLigth.length);
    return this.positionsWithOutLigth;
  }

  findPatternFigures() {
    this.findLastFreePositions().forEach((pos: ModelPositions) => {
      pos.findPatternFigure();
    })
  }


}
