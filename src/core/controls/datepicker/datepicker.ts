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
import { ModuleField } from "../../models/ModuleField";

@Component({
  selector: "control-datepicker",
  templateUrl: "./datepicker.html",
  styleUrls: ["./datepicker.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerControlComponent),
      multi: true
    }
  ]
})
export class DatepickerControlComponent
  implements OnInit, ControlValueAccessor, OnDestroy {
  public formChanged = new EventEmitter<any>();
  public modelYear: FormGroup;
  public formSubscription$: Subscription;
  @Input() field: ModuleField;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.modelYear = this.createForm();
    this.formSubscription$ = this.onFormChange();
  }

  createForm(): FormGroup {
    const formControls: FormGroup | any = {};
    formControls[this.field.FldName] = this.formBuilder.control(
      this.field.DefaultValue,
      this.field.Required == "required"
        ? Validators.required
        : Validators.pattern(this.field.Validator)
    );
    return this.formBuilder.group(formControls);
  }

  onFormChange() {
    return this.modelYear.valueChanges.subscribe(val => {
      // alert(val[this.field.FldName]);
      this.formChanged.emit(val[this.field.FldName]);
    });
  }

  registerOnChange(fn: any): void {
    this.formChanged.subscribe(fn);
  }

  writeValue(controls): void {
    console.log(controls);
  }
  onSubmit() {}

  setDisabledState(isDisabled: boolean): void {}

  registerOnTouched(fn: any): void {}

  ngOnDestroy() {
    this.formSubscription$ && this.formSubscription$.unsubscribe();
  }
}
