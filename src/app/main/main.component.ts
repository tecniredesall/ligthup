import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(public route: Router) { }

  ngOnInit(): void {
  }

  goToGame() {
    this.route.navigateByUrl("/room");
  }

}
