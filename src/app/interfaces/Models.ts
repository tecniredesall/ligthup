export interface patterns {
  name: string,
  iterative?: typeSecuential
  dataRows?: Array<patternRow> | patternRow
  cntMaxRows: number
  cntMaxColumm: number
  id?: number,
  particular?: boolean,
}

export interface patternRow {
  valueColumm?: number,
  valueRow?: number,


  cntColumm: number,
  cntRow?: number,

  numberRow?: number,
  numberColumn?: number,

  sequential?: typeSecuential
}

export interface typeSecuential {
  column?: direction,
  row?: direction
}

export interface direction {
  reverse: boolean
  priority: boolean
}


export interface matrix {
  positions: Array<positions>
  cntRow: number
  cntColumn: number
  dataOrigin: Array<Array<any>>
  cntBulbs: number;
}

export interface positions {

  idxColumm: number
  idxRow: number
  valueColumn: number
  valueRow: number
  wall: boolean | 0 | 1
  bulb: boolean
  withLight: boolean
  adjacentPos: nexPositionsMatrix
  freePositions: nextFreePositionsMatrix;
  patternsFig: patterFigure;
  freeCantPositions: number;
}

export interface showDataPositions {
  wall: boolean | 0 | 1
  bulb: boolean
  withLight: boolean
}

export interface showAllData {
  data: Array<Array<showDataPositions>>
}




export interface nexPositionsMatrix {
  up: Array<positions>
  down: Array<positions>
  rigth: Array<positions>
  left: Array<positions>
  freePos: number;
  withBulb: number;
  withLigth: number;
}


export interface nextFreePositionsMatrix {
  up: Array<positions>
  down: Array<positions>
  rigth: Array<positions>
  left: Array<positions>
  cntUp: number;
  cntDow: number;
  cntRigth: number;
  cntLeft: number;
  cntTotal: number;
}

export interface patterFigure {


  boat1xManyRight?: boolean
  boat1xManyLeft?: boolean

  boat2xManyRight?: boolean
  boat2xManyLeft?: boolean

  cruise?: boolean
  cruiseL1?: boolean
  cruiseL2?: boolean
  cruiseL3?: boolean

  cruiseS3X?: boolean
  cruiseS3UpL2X?: boolean

  cruiseS3Up1L1RX?: boolean
  cruiseS3Up1LXR1?: boolean

  corners?: boolean
  cornersL1?: boolean
  cornersL2?: boolean
  cornersL3?: boolean
}


export interface combinationOfFigure {
  min: number
  max: number
  nextSides?: { left: number | boolean, rigth: number | boolean }
  side?: number;
}

export const UP = 1;
export const RIGTH = 2;
export const DOWN = 3;
export const LEFT = 4;



