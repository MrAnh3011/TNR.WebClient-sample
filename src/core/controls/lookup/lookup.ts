import {
  Component,
  OnInit,
  forwardRef,
  EventEmitter,
  OnDestroy,
  Input
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { Subscription } from "rxjs";
import { MatDialog } from "@angular/material";
import { StateService } from "../../services/stateService";
import { SearchComponent } from "../../../app/search/search.component";
import { ModuleField } from "../../models/ModuleField";
import { CommonUtils } from "../../utils/common";
import { ModuleInfo } from "../../../common/models/moduleInfo";
import { ModuleService } from "../../services/module.service";

@Component({
  selector: "control-lookup",
  templateUrl: "./lookup.html",
  styleUrls: ["./lookup.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ControlLookup),
      multi: true
    }
  ]
})
export class ControlLookup implements OnInit, ControlValueAccessor, OnDestroy {
  @Input() field: ModuleField;
  public formChanged = new EventEmitter<any>();
  public modelLookup: FormGroup;
  public lookupData: any[];
  private formValue;
  public removable = true;
  public formSubscription$: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private stateService: StateService,
    private utils: CommonUtils,
    private moduleService: ModuleService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.modelLookup = this.createForm();
    this.formSubscription$ = this.onFormChange();
    // console.log("modelLookup", this.field.DefaultValue);
    if (this.field.DefaultValue) {
      let moduleInfo = new ModuleInfo("COR07", "MMN", {
        FuncSign: this.field.ListSource
      });
      this.moduleService.executeModule(moduleInfo).subscribe((res1: any) => {
        // console.log("res1", res1);
        if (res1.status == 1) {
          let moduleInfo = res1.data;
          let mod = new ModuleInfo(moduleInfo.ModId, moduleInfo.SubMod, {});
          this.moduleService.executeModule(mod).subscribe((res: any) => {
            console.log(res);
            if (res.status == 1) {
              let dest = this.utils.splitString(this.field.DefaultValue);
              this.lookupData = this.utils.filterInArray(
                res.data,
                dest,
                "Value"
              );
            } else {
              alert(res.message);
            }
          });
        } else {
          alert(res1.message);
        }
      });
    }
  }

  createForm(): FormGroup {
    const formControls: FormGroup | any = {};
    formControls[this.field.FldName] = this.formBuilder.control(
      this.field.DefaultValue
    );
    return this.formBuilder.group(formControls);
  }

  onSubmit() {}

  onSelectItems() {
    this.stateService.lookupParams = this.field.ListSource;
    this.openDialog();
  }

  openDialog(): void {
    let self = this;
    this.stateService.lookupParams = this.field.ListSource;
    let dialogRef = this.dialog.open(SearchComponent, {
      width: "1024px",
      data: { selectedData: this.lookupData }
    });

    dialogRef.afterClosed().subscribe((result: any[]) => {
      if (result && result.length > 0) {
        let obj = {};
        this.formValue = result.map((item, index) => {
          return item.Value;
        });
        obj[this.field.FldName] = this.utils.joinString(this.formValue);
        this.modelLookup.setValue(obj);
        self.lookupData = result;
      }
    });
  }

  onFormChange() {
    return this.modelLookup.valueChanges.subscribe(val => {
      console.log("onFormChange", val);
      // this.formChanged.emit(val);
      this.formChanged.emit(val[this.field.FldName]);
    });
  }

  registerOnChange(fn: any): void {
    this.formChanged.subscribe(fn);
  }

  writeValue(controls): void {
    console.log(controls);
  }

  clear() {
    this.lookupData = [];
    let obj = {};
    obj[this.field.FldName] = "";
    this.modelLookup.setValue(obj);
  }

  remove(item: any): void {
    const index = this.lookupData.indexOf(item);
    if (index >= 0) {
      this.lookupData.splice(index, 1);
      this.formValue.splice(index, 1);
      let obj = {};
      obj[this.field.FldName] = this.utils.joinString(this.formValue);
      this.modelLookup.setValue(obj);
    }
  }

  setDisabledState(isDisabled: boolean): void {}

  registerOnTouched(fn: any): void {}

  ngOnDestroy() {
    this.formSubscription$ && this.formSubscription$.unsubscribe();
  }
}
