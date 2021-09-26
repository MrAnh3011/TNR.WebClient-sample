import {  Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModuleField } from '../../models/ModuleField';
import { Module } from '../../modules/module';
import { ModuleService } from '../../services/module.service';
import { StateService } from '../../services/stateService';
import { CoreTranslate } from '../../utils/translate';
import { CacheService } from '../../services/cache.service';

@Component({
    selector: 'form-field',
    templateUrl: `./formfield.html`,
    styleUrls: ['./formfield.scss']
})
export class FormFieldComponent implements OnInit {
    @Input() funcSign: any;
    @Input() field: ModuleField;
    @Input() name: string;
    @Output() valueChange = new EventEmitter<any>();

    public FieldSource: any[];
    fieldValue;

    constructor(public moduleService: ModuleService, public stateService: StateService, public translateService: CoreTranslate, public cacheService: CacheService) { }
    ngOnInit(): void {
        this.getListSource();
    }

    getListSource() {
        console.log(this.field)
        if (this.field.ListSource) {
            let modulle = new Module(this.funcSign, this.moduleService, this.stateService, this.translateService, this.cacheService)
            modulle.getListSource(this.field.ListSource)
                .then((res: any) => {
                    console.log(this.field.FldLabel, res)
                    this.FieldSource = res;
                    if(this.FieldSource && this.FieldSource.length > 0)
                        this.valueChange.emit(this.FieldSource[0].Value);
                })
                .catch(err=>{
                    console.log(err);
                })
        }
    }

    ngOnChanges(changes: any) {
        if(changes.name){
            console.log(changes);
            this.getListSource();
        }
    }

    

    valueChanged(value) {
        console.log('f', value);
        this.valueChange.emit(value);
    }
}
