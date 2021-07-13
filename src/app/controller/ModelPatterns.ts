
import { patterns } from "./../interfaces/Models"



export default class ModelPatterns {

  private left_rigth_up: patterns
  private rigth_left_up: patterns
  private left_rigth_down: patterns
  private rigth_left_down: patterns

  private up_down_left: patterns
  private down_up_left: patterns
  private up_down_rigth: patterns
  private down_up_rigth: patterns
  private searchMaxPositions: patterns
  private permutePositions: patterns


  public manyPatterns: Array<patterns> = [];

  constructor() {

    this.loadPatters();

  }


  loadPatters() {

    this.left_rigth_up =
    {
      name: "Left to Rigth and Up to Down Movement",
      iterative: {
        row: { reverse: false, priority: false },
        column: { reverse: false, priority: true },
      },
      dataRows: {
        valueRow: 6,
        valueColumm: 0,
        cntColumm: 3
      },
      cntMaxRows: 15,
      cntMaxColumm: 15,
    }

    this.rigth_left_up =
    {
      name: "Rigth to Left and Up to Down Movement",
      iterative: {
        row: { reverse: false, priority: false },
        column: { reverse: true, priority: true },
      },
      dataRows: {
        valueRow: 6,
        valueColumm: 0,
        cntColumm: 3
      },
      cntMaxRows: 15,
      cntMaxColumm: 15,
    }

    this.left_rigth_down = {
      name: "Left to Right and Down to Up Movement",
      iterative: {
        row: { reverse: true, priority: false },
        column: { reverse: false, priority: true },
      },
      dataRows: {
        valueRow: 6,
        valueColumm: 0,
        cntColumm: 3
      }
      ,
      cntMaxRows: 15,
      cntMaxColumm: 15,
    }

    this.rigth_left_down = {
      name: "Right to Left  and Down to Up Movement",
      iterative: {
        row: { reverse: true, priority: false },
        column: { reverse: true, priority: true },
      },
      dataRows: {
        valueRow: 6,
        valueColumm: 0,
        cntColumm: 3
      }
      ,
      cntMaxRows: 15,
      cntMaxColumm: 15,
    }

    //////////////////////////////////////////////////////////

    this.up_down_left = {
      name: "Up to Down and Left to Rigth Movement",
      iterative: {
        row: { reverse: false, priority: true },
        column: { reverse: false, priority: false },
      },
      dataRows: {
        valueColumm: 6,
        valueRow: 0,
        cntColumm: 3
      },
      cntMaxRows: 15,
      cntMaxColumm: 15,
    };

    this.down_up_left = {
      name: "Down to Up  and Left to Rigth Movement",
      iterative: {
        row: { reverse: true, priority: true },
        column: { reverse: false, priority: false },
      },
      dataRows: {
        valueColumm: 6,
        valueRow: 0,
        cntColumm: 3
      },
      cntMaxRows: 15,
      cntMaxColumm: 15,
    };


    this.up_down_rigth = {
      name: "Up to Down and Rigth to Left Movement",
      iterative: {
        row: { reverse: false, priority: true },
        column: { reverse: true, priority: false },
      },
      dataRows: {
        valueColumm: 6,
        valueRow: 0,
        cntColumm: 3
      },
      cntMaxRows: 15,
      cntMaxColumm: 15,
    };

    this.down_up_rigth = {
      name: "Down to Up and Rigth to Left Movement",
      iterative: {
        row: { reverse: true, priority: true },
        column: { reverse: true, priority: false },
      },
      dataRows: {
        valueColumm: 6,
        valueRow: 0,
        cntColumm: 3
      },
      cntMaxRows: 15,
      cntMaxColumm: 15,
    };

    this.searchMaxPositions = {
      name: "Max to Min",
      id: 1,
      particular: true,
      cntMaxRows: 15,
      cntMaxColumm: 15,
    };

    this.permutePositions = {
      name: "Permute",
      id: 2,
      particular: true,
      cntMaxRows: 15,
      cntMaxColumm: 15,
    };


    this.manyPatterns.push(this.left_rigth_up);
    this.manyPatterns.push(this.rigth_left_up);
    this.manyPatterns.push(this.left_rigth_down);
    this.manyPatterns.push(this.rigth_left_down);
    this.manyPatterns.push(this.up_down_left);
    this.manyPatterns.push(this.down_up_left);
    this.manyPatterns.push(this.up_down_rigth);
    this.manyPatterns.push(this.searchMaxPositions);
    this.manyPatterns.push(this.permutePositions);
    this.manyPatterns.push({
      name: "First Boat & Max to Min",
      id: 3,
      particular: true,
      cntMaxRows: 15,
      cntMaxColumm: 15,
    });
  }




}
