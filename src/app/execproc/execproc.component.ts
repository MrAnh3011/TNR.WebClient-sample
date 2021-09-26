import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModuleField } from '../../core/models/ModuleField';
import { Module } from '../../core/modules/module';
import { LoaderService } from '../core/loader/loader.service';
import { CoreTranslate } from '../../core/utils/translate';
import { NavService } from '../../core/services/navService';
import { StateService } from '../../core/services/stateService';
import { ModuleService } from '../../core/services/module.service';
import { ModuleInfo } from '../../common/models/moduleInfo';
import { delay } from 'rxjs/operators';
import { CacheService } from '../../core/services/cache.service';


@Component({
  selector: 'app-execproc',
  templateUrl: './execproc.component.html',
  styleUrls: ['./execproc.component.scss']
})
export class ExecprocComponent
  implements OnInit, OnDestroy {
  moduleInfo: any = {
    FuncName: ""
  };
  fields: ModuleField[] = [];
  module: Module;
  listSources: Array<any> = [];
  height;
  loading: boolean = false;
  pageTitle: string = "";
  warningText = "";
  procData;
  execItems: Array<any> = [];
  resultObject = [];
  resultMessage = [];

  constructor(
    private moduleService: ModuleService,
    private stateService: StateService,
    private navService: NavService,
    private translate: CoreTranslate,
    private spinner: LoaderService,
    private cacheService: CacheService
  ) {

  }

  ngOnInit() {
    let funcSign = this.stateService.navRoute;
    this.spinner.show();
    if (funcSign) {
      console.log('navService', this.navService)
      this.module = new Module(funcSign, this.moduleService, this.stateService, this.translate, this.cacheService);
      this.module.getModule().subscribe((res: any) => {
        let data = res.data;
        this.moduleInfo = data;
        this.pageTitle = this.translate.translateModule(this.moduleInfo.FuncName);
        this.warningText = this.translate.translateText(this.moduleInfo.FuncName, "WarningText");
        this.fields = JSON.parse(data.Fields);
        console.log(this.fields);
        this.bindFormValue();
        this.spinner.hide();
      })
    }
  }

  bindFormValue() {
    this.execItems = this.stateService.navData;
    console.log('execItems', this.execItems);
    let objRes = this.execItems.map((item, i) => {
      let obj = {};
      if (this.fields) {
        this.fields.map((fld, index) => {
          obj[fld.FldName] = item[fld.FldName];
        })
      }
      return obj;
    });
    this.resultObject = objRes;
  }

  onSubmit() {
    let authData: any = localStorage.getItem('auth_data');
    this.loading = true;
    let userName = authData.userName;
    this.resultObject.forEach((item, index) => {
      let modInfo = new ModuleInfo(this.moduleInfo.ModId, this.moduleInfo.SubMod, item);
      this.moduleService.executeModule(modInfo).subscribe((res: any) => {
        console.log(res);
        if (res.status == 1) {
          item.status = "success";
          item.message = "Thực hiện thành công."
        }
        else {
          item.status = "danger";
          item.message = res.message
        }
      }, (err) => {
        item.status = "danger";
        item.message = err.toString()
      })
      delay(300);
      // if (index = this.resultObject.length - 1) {
      //   this.loading = false;
      // }
    });
  }

  ngOnDestroy() {

  }
}