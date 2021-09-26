import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'cdk-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  today: number = Date.now();
  // public bufferValue;

    events = [
         
    ];

    todolists = [
          
    ];

    messages = [
      
    ];
}
