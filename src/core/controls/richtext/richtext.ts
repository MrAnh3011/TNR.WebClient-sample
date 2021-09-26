import { Component, OnInit, forwardRef, EventEmitter, OnDestroy, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { StateService } from '../../services/stateService';
import { SearchComponent } from '../../../app/search/search.component';
import { ModuleField } from '../../models/ModuleField';
import { CommonUtils } from '../../utils/common';
import { ModuleInfo } from '../../../common/models/moduleInfo';
import { ModuleService } from '../../services/module.service';
import Quill from 'quill';

@Component({
    selector: 'control-rich-text',
    templateUrl: './richtext.html',
    styleUrls: ['./richtext.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ControlRichText),
            multi: true,
        }]
})
export class ControlRichText implements OnInit, ControlValueAccessor, OnDestroy {
    public formChanged = new EventEmitter<any>();
    public reportTextModel: FormGroup;
    private lookupData: any[];
    private formValue;
    public removable = true;
    public quill: Quill;
    private tempFields: any[];
    public formSubscription$: Subscription;
    @Input() field: ModuleField;
    @Input() listSources: any[];
    constructor(private formBuilder: FormBuilder,
        private stateService: StateService,
        private utils: CommonUtils,
        private moduleService: ModuleService,
        private dialog: MatDialog) { }

    ngOnInit() {
        this.reportTextModel = this.createForm();
        this.formSubscription$ = this.onFormChange();
        this.getListSource();
    }

    createForm(): FormGroup {
        const formControls: FormGroup | any = {};
        console.log(this.field.DefaultValue);
        formControls[this.field.FldName] = this.formBuilder.control(this.field.DefaultValue, this.field.Required == 'T' ? Validators.required : Validators.pattern(this.field.Validator));
        return this.formBuilder.group(formControls);
    }
    created(editorInstance) {
        this.quill = editorInstance;
    }

    getListSource() {
        let module = new ModuleInfo("RPTLIST", "MMN", {
            TableName: this.field.ListSource
        });
        this.moduleService.executeModule(module).subscribe((res: any) => {
            if (res.status == 1) {
                this.tempFields = res.data;
            }
        })
    }

    onSelectText(value) {
        var selection = this.quill.getSelection(true);
        this.quill.insertText(selection.index, '{{' + value + '}}');
    }

    onFormChange() {
        return this.reportTextModel.valueChanges
            .subscribe(val => {
                console.log('onFormChange', val[this.field.FldName])
                // this.formChanged.emit(val);
                this.formChanged.emit(val[this.field.FldName]);
            })
    }

    registerOnChange(fn: any): void {
        this.formChanged.subscribe(fn);
    }

    writeValue(controls): void {
        console.log(controls);
    }

    setDisabledState(isDisabled: boolean): void { }

    registerOnTouched(fn: any): void { }

    ngOnDestroy() {
        this.formSubscription$ && this.formSubscription$.unsubscribe();
    }
}