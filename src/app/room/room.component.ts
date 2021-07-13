import { Component, OnInit } from '@angular/core';
import { matrix, positions, showAllData, showDataPositions } from "./../interfaces/Models"
import ModelMatrix from './../controller/ModelMatrix';
import TestMatrixWithPatterns from '../controller/TestMatrixWithPatterns';
import { isArray } from 'util';
import PatternsFigures from '../controller/PatternsFigures';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../modal/modal.component';
import Common from '../controller/Common';

//var item = items[Math.floor(Math.random()*items.length)];

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  public loading = false;
  public tempMatrixs: Array<matrix> = new Array();
  public testMatrix: TestMatrixWithPatterns;
  public showMatrix: showAllData = { data: [] };
  public readyUpload: boolean = true;
  start: number = 0
  limit: number = 1000;



  private selectedFile;
  public isSolProceced: boolean = false;

  constructor(private modalService: NgbModal) {
    this.testMatrix = new TestMatrixWithPatterns();
  }

  public list: Array<Array<showDataPositions>> = [
    [
      { withLight: false, bulb: false, wall: false },
      { withLight: true, bulb: false, wall: false }
    ],
    [
      { withLight: false, bulb: false, wall: true },
      { withLight: true, bulb: true, wall: false },
      { withLight: false, bulb: false, wall: true }
    ]
  ]



  ngOnInit(): void {
    this.loading = true;
    sessionStorage.removeItem("reload");
    this.loadRandonMatrix();
    this.loading = false;
    //this.showSolutions();
  }



  loadTxt(data: Array<Array<0 | 1>>) {
    this.loadMatrix(data);

    this.testMatrix.testPatterns(this.tempMatrixs);
    this.showOriginalMatrix()
  }

  showOriginalMatrix(): void {
    let showMatrix = { ...this.tempMatrixs[this.testMatrix.modelPatterns.manyPatterns.length + 2] };
    this.processDataToView(showMatrix, this.showMatrix);
  }


  refinedSolution() {
    this.loading = true;
    setTimeout(() => {
      if (this.start < PatternsFigures.createPermuts.length) {
        this.start = this.limit;
        this.limit = this.start + 1000;
        console.log("PAG", this.start, this.limit);
        this.testMatrix.testPatterns(this.tempMatrixs, this.start, this.limit);
      } else {
        this.open("No hay mas Soluciones Posibles");
      }
      let showMatrix = { ...this.tempMatrixs[0] };
      this.loading = false;
      this.processDataToView(showMatrix, this.showMatrix);
    }, 100);
  }

  showSolutions(): void {
    if (!this.isSolProceced) {
      this.loading = true;
      setTimeout(() => {
        this.testMatrix.testPatterns(this.tempMatrixs, this.start, this.limit);
        this.isSolProceced = !this.isSolProceced;
        let showMatrix = { ...this.tempMatrixs[0] };
        this.loading = false;
        this.processDataToView(showMatrix, this.showMatrix);
      }, 100);
    } else {
      let showMatrix = { ...this.tempMatrixs[0] };
      this.loading = false;
      this.processDataToView(showMatrix, this.showMatrix);
    }

  }

  open(message: string) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.name = message;
  }


  newMatrix() {
    window.location.reload();
  }



  loadRandonMatrix(): void {
    let data: Array<Array<0 | 1>> = [...this.generateInitialMatrix(true)];
    this.tempMatrixs = new Array();
    this.loadMatrix(data);
    //this.testMatrix.testPatterns(this.tempMatrixs);
    this.showOriginalMatrix()
  }



  private loadMatrix(data: Array<Array<0 | 1>>) {

    console.log(data);
    this.tempMatrixs = new Array();
    this.tempMatrixs.push(new ModelMatrix([...data], 0));
    let cntMatrix: number = this.testMatrix.modelPatterns.manyPatterns.length + 1;
    for (let index = 0; index < cntMatrix; index++) {
      this.tempMatrixs.push(new ModelMatrix([...data], index + 1));
    }
    let showMatrix = { ...(new ModelMatrix([...data], cntMatrix + 1)) };
    this.tempMatrixs.push(showMatrix);
  }

  private generateInitialMatrix(typeStatic: boolean = true, rows: number = 4, column: number = 6): Array<Array<0 | 1>> {

    let getRandomInt = (min: number = 0, max: number = 2): number => {
      let rnd: number = Math.floor(Math.random() * (max - min)) + min;
      rnd >= 2 ? rnd = 1 : rnd = rnd;
      return rnd;
    }
    let fn: any = getRandomInt;
    let mtx: Array<Array<0 | 1>> = new Array();
    if (!!typeStatic) {
      mtx.push([0, 0, 0, 1, 0, 1, fn(), 1])
      mtx.push([0, 1, 0, 0, 0, 0, 0, 0])
      mtx.push([fn(), 1, 0, 0, 0, fn(), 1, fn()])
      mtx.push([0, 1, 1, 1, 1, 0, 0, 0]);
      mtx.push([0, fn(), 0, 0, 1, 0, 0, 0]);
      mtx.push([0, 1, 0, fn(), 1, 0, fn(), 0])
      mtx.push([0, 1, 0, fn(), 1, 0, 1, 0])
      mtx.push([0, 0, 0, 0, 1, 0, fn(), 0])
      mtx.push([0, fn(), 1, 0, 1, 1, 0, 1])
      mtx.push([0, 0, 0, 0, 1, 0, 0, 0])
      mtx.push([1, 0, 0, fn(), 0, 0, 1, fn()])
      mtx.push([0, fn(), fn(), 0, 0, 0, 0, 0])
    } else {

      for (let index = 0; index < rows; index++) {

        let dataColumns: Array<0 | 1> = new Array();
        let cntRd = 0
        for (let index1 = 0; index1 < column; index1++) {
          cntRd++
          let rd: 0 | 1 = 0;
          if (cntRd + 1 < column) {
            rd = (getRandomInt() as 0 | 1);
          }

          dataColumns.push(getRandomInt() as 0 | 1);
        }
        mtx.push([...dataColumns])

      }
    }
    return mtx;
  }


  processDataToView(matrix: matrix, showMatrix: showAllData) {

    showMatrix = { data: new Array() };

    for (let idxRow = 0; idxRow < matrix.cntRow; idxRow++) {

      let row = matrix.positions.filter((pos: positions) => {
        return pos.idxRow == idxRow;
      });
      row = Common.sort(row, ["valueRow", "valueColumn"]);
      let newrow: Array<showDataPositions> = row.map((pos: positions) => {

        let newshowPos: showDataPositions =
        {
          wall: pos.wall,
          bulb: pos.bulb,
          withLight: pos.withLight
        }
        return newshowPos;
      })
      showMatrix.data.push(newrow);
    }
    this.list = [...showMatrix.data];
    console.log(this.list);

  }



  ///////////////////////////////////


  onFileChanged(event) {

    let get = sessionStorage.getItem("reload");
    if (!!get) {
      this.newMatrix()
    } else {

      let flag = false;
      this.selectedFile = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.readAsText(this.selectedFile, "UTF-8");
      fileReader.onload = () => {
        try {
          let data: Array<Array<0 | 1>> = (JSON.parse(fileReader.result as string)) as Array<Array<any>>
          if (!!data && isArray(data) && !!data.length) {

            data.forEach(col => {
              console.log(col)
              if (!!col && isArray(col) && !!col.length) {
              } else {
                flag = true;
              }
            })

          } else {
            flag = true;
          }

          if (!flag) {
            this.open("Archivo Cargado Correctamente");
            this.loadTxt(data);
          } else {
            this.open("Archivo o Formato Incorrecto");
          }

          console.log(data);
        } catch (error) {
          this.open("Archivo o Formato Incorrecto");
        }
      }
    }
    sessionStorage.setItem("reload", "true");
    this.readyUpload = false;
  }




}
