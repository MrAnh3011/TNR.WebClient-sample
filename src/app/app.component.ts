import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
} from '@angular/animations'
import { StateService } from '../core/services/stateService';
import { CacheService } from '../core/services/cache.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],


})
export class AppComponent implements OnInit {
  constructor(private stateService: StateService, private cacheService: CacheService) {

  }
  ngOnInit() {
    this.cacheService.getCode().subscribe((res: any) => {
      if (res.status == 1) {
        console.log('code:', res);
        this.stateService.CODES = res.data;
      }
    })
    this.cacheService.getLang().subscribe((res: any) => {
      if (res.status == 1) {
        console.log('lang:', res);
        this.stateService.LANGS = res.data;
      }
    })
  }
  title = 'app';

  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation
  }
}
