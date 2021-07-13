import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'quadrant',
  templateUrl: './quadrant.component.html',
  styleUrls: ['./quadrant.component.scss']
})
export class QuadrantComponent implements OnInit {
  @Input() withLight_ : boolean = false;
  @Input() bulb_ : boolean = false;

  attr : string='';


  ngOnInit(): void {
     this.attr = this.createAttribute(this.withLight_,this.bulb_);
  }

  createAttribute(_withLight:boolean,_bulb:boolean) {

    if(_withLight && _bulb){
        return 'bulb'
    }else if (_withLight && !_bulb){
        return 'light'
    }
    return 'dark';

  }

}
