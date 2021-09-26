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
  FormGroup
} from "@angular/forms";
import { Subscription } from "rxjs";
import { ModuleField } from "../../models/ModuleField";

@Component({
  selector: "control-combobox",
  templateUrl: "./combobox.html",
  styleUrls: ["./combobox.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ComboboxControlComponent),
      multi: true
    }
  ]
})
export class ComboboxControlComponent
  implements OnInit, ControlValueAccessor, OnDestroy {
  public formChanged = new EventEmitter<any>();
  public ccbValue: FormGroup;
  public formSubscription$: Subscription;
  @Input() field: ModuleField;
  @Input() listSources: any[];
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.ccbValue = this.createForm();
    // console.log(this.ccbValue);
    this.formSubscription$ = this.onFormChange();
    console.log(this.listSources);
    if (this.listSources) {
      const toSelect = this.listSources.find(
        c => c.Value == this.field.DefaultValue
      );
      if (toSelect) {
        this.ccbValue.get(this.field.FldName).setValue(toSelect);
      }
    }
  }

  hasError(controlName: string, errorName: string) {
    return this.ccbValue.controls[controlName].hasError(errorName);
  }

  ngOnChange(e){
    console.log(e);
  }

  createForm(): FormGroup {
    const formControls: FormGroup | any = {};
    formControls[this.field.FldName] = this.formBuilder.control(null);
    return this.formBuilder.group(formControls);
  }

  onSubmit() {}

  onFormChange() {
    return this.ccbValue.valueChanges.subscribe(val => {
      // console.log(val);
      if (val[this.field.FldName])
        this.formChanged.emit(val[this.field.FldName].Value);
    });
  }

  registerOnChange(fn: any): void {
    this.formChanged.subscribe(fn);
  }

  writeValue(controls): void {}

  setDisabledState(isDisabled: boolean): void {}

  registerOnTouched(fn: any): void {}

  ngOnDestroy() {
    this.formSubscription$ && this.formSubscription$.unsubscribe();
  }
}
