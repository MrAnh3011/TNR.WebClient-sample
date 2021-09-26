import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  FormArray
} from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import { Module } from "../../core/modules/module";
import { ModuleService } from "../../core/services/module.service";
import { ActivatedRoute } from "@angular/router";
import { DefFunction } from "../../core/models/Function";
import { ModuleField } from "../../core/models/ModuleField";
import { ModuleInfo } from "../../common/models/moduleInfo";
import { Location } from "@angular/common";
import { StateService } from "../../core/services/stateService";
import { CoreTranslate } from "../../core/utils/translate";
import { NavService } from "../../core/services/navService";
import { ObservableMedia, MediaChange } from "@angular/flex-layout";
import { LoaderService } from "../core/loader/loader.service";
import { AuthService } from "../../core/services/auth.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { LoginComponent } from "../login/login.component";
import { CacheService } from "../../core/services/cache.service";
import { utils } from "../../common/utils";
import { CommonUtils } from "../../core/utils/common";

@Component({
  selector: "app-maintain",
  templateUrl: "./maintain.component.html",
  styleUrls: ["./maintain.component.scss"]
})
export class MaintainComponent implements OnInit, OnDestroy {
  public descriptor = [];
  public simpleFormGroup: FormGroup = new FormGroup({});
  public formSubscription$: Subscription;
  public result = {};
  public resultVM;
  moduleInfo: any = {
    FuncName: ""
  };
  fields: ModuleField[] = [];
  module: Module;
  listSources: Array<any> = [];
  height;
  loading: boolean = false;
  pageTitle: string = "";
  private formSubmitAttempt: boolean;
  fieldProperties: any = {};
  ready: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private location: Location,
    private stateService: StateService,
    private cacheService: CacheService,
    private translate: CoreTranslate,
    private media: ObservableMedia,
    private spinner: LoaderService,
    private common: CommonUtils,
    private dialogRef: MatDialogRef<MaintainComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {}

  ngOnInit() {
    let funcSign = this.stateService.navRoute;
    this.spinner.show();
    if (funcSign) {
      // console.log('navService', this.navService)
      this.module = new Module(
        funcSign,
        this.moduleService,
        this.stateService,
        this.translate,
        this.cacheService
      );
      this.module.getModule().subscribe((res: any) => {
        let data = res.data;
        this.moduleInfo = data;
        this.pageTitle = this.translate.translateModule(
          this.moduleInfo.FuncName
        );
        // console.log(this.moduleInfo)
        if (data.Fields) {
          this.fields = JSON.parse(data.Fields);
        }
        this.bindFormValue();
        this.getListSource().then((lst: any) => {
          console.log(lst);
          this.listSources = lst;
          this.simpleFormGroup = this.createForm(this.fields);
          this.formSubscription$ = this.onFormChange();
          this.updateHieght();
          this.media.subscribe((mediaChange: MediaChange) => {
            this.updateHieght();
          });
          this.spinner.hide();
          this.ready = true;
        });
      });
    }
  }

  bindFormValue() {
    let newData = this.stateService.navData;
    console.log("newData", newData);
    if (newData) {
      let dt = Object.keys(newData);
      if (dt.length > 0) {
        dt.forEach(key => {
          let fld = this.fields.filter(o => o.FldName == key);
          if (fld.length > 0) {
            // console.log("fld", fld);
            if (newData[key] != null) {
              fld[0].DefaultValue = newData[key];
            } else {
              fld[0].DefaultValue = "";
            }
          }
        });
      }
    }
  }

  updateHieght() {
    let body = document.body,
      html = document.documentElement;
    let h =
      Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      ) - 66;
    this.height = h + "px";
  }

  onFormChange() {
    return this.simpleFormGroup.valueChanges.subscribe(val => {
      // console.log("onFormChange", val);
      this.result = Object.assign(this.result, {}, val);
    });
  }

  callBack(field: ModuleField) {
    let callBackInfo = this.common.getCallBackInfo(field.CallBack);
    let moduleData = {};
    for (let f of callBackInfo.params) {
      let value = this.simpleFormGroup.get(f).value;
      moduleData[f] = value;
    }

    let callBackModule = new ModuleInfo(
      callBackInfo.modId,
      callBackInfo.subMod,
      moduleData
    );
    this.moduleService.executeModule(callBackModule).subscribe((rs: any) => {
      if (rs.status == 1) {
        let res = rs.data;
        // console.log(res);
        Object.keys(res).forEach(key => {
          if (this.simpleFormGroup.get(key)) {
            // console.log(res[key])
            this.simpleFormGroup.get(key).setValue(res[key]);
          } else {
            this.fieldProperties[key] = res[key];
          }
        });
      } else {
        alert(rs.message);
      }
    });
  }

  hasError(controlName: string, errorName: string) {
    return this.simpleFormGroup.controls[controlName].hasError(errorName);
  }

  // better to store on a service for future reuse
  createForm(fields: Array<ModuleField>): FormGroup {
    const _simpleFormGroup: FormGroup | any = {};
    for (const _control of fields) {
      let control: FormControl;
      if (_control) {
        control = this.formBuilder.control(
          _control.DefaultValue,
          _control.Required == "T" ? Validators.required : null
        );
        control.valueChanges.subscribe(val => {
          // console.log(field.FldName + " change", val);
          if (_control.CallBack) {
            this.callBack(_control);
          }
        });
        this.result[_control.FldName] = _control.DefaultValue || "";
      }
      _simpleFormGroup[_control.FldName] = control;
    }
    return this.formBuilder.group(_simpleFormGroup);
  }

  async getListSource() {
    let listSources = {};
    for (let field of this.fields) {
      if (field.ListSource) {
        let lstSource = await this.module.getListSource(field.ListSource);
        if (lstSource) {
          listSources[field.FldName] = lstSource;
        }
      }
    }
    return listSources;
  }

  onSubmit() {
    if (this.simpleFormGroup.valid) {
      console.log("submit");
      this.loading = true;
      this.executeModule();
    } else {
      this.validateAllFormFields(this.simpleFormGroup); //{7}
    }
  }

  validateAllFormFields(formGroup: FormGroup) {
    //{1}
    Object.keys(formGroup.controls).forEach(field => {
      //{2}
      const control = formGroup.get(field); //{3}
      if (control instanceof FormControl) {
        //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        //{5}
        this.validateAllFormFields(control); //{6}
      }
    });
  }

  executeModule() {
    this.resultVM = this.result;
    let authData: any = localStorage.getItem("auth_data");
    this.resultVM.SessionUsername = authData.userName;
    let module = new ModuleInfo(
      this.moduleInfo.ModId,
      this.moduleInfo.SubMod,
      this.resultVM
    );
    this.moduleService.executeModule(module).subscribe((res: any) => {
      // console.log(res);
      if (res.status == 1) {
        this.goBack();
      } else {
        this.loading = false;
        alert(res.message);
      }
    });
  }

  goBack() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.formSubscription$ && this.formSubscription$.unsubscribe();
  }
}
