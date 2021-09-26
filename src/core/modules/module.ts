import { ModuleInfo } from "../../common/models/moduleInfo";
import { ModuleService } from "../services/module.service";
import { ModuleField } from "../models/ModuleField";
import { DefFunction } from "../models/Function";
import 'rxjs/add/operator/map'
import * as moment from 'moment';
import { StateService } from "../services/stateService";
import { DefCode } from "../models/DefCode";
import { CoreTranslate } from "../utils/translate";
import { CacheService } from "../services/cache.service";

export class Module {
    constructor(funcSign: string, 
        private moduleService: ModuleService, 
        private stateService: StateService,
        private translate: CoreTranslate,
        private cacheService: CacheService
        ) {
        this.funcSign = funcSign;

    }
    private funcSign: string;

    public getModule() {
        return this.cacheService.getFunc(this.funcSign);
    }

    formatValue(fldType, fldValue) {
        switch (fldType) {
            case 'string':
                return fldValue;
            case 'number':
                return Number(fldValue).toLocaleString('en')
            case 'date':
                return moment(fldValue).format('DD/MM/YYYY')
            default:
                break;
        }
    }

    async getListSource(listSource: string) {
        if (!listSource)
            return [];
        if (listSource.startsWith(':')) {
            let code = listSource.replace(':', '').split(".");
            if (code.length > 1) {
                let cdType = code[0];
                let cdName = code[1];
                return this.stateService.getCode(cdType, cdName).map((item: DefCode)=>{
                    return {
                        Value: item.CdValue,
                        Text: this.translate.translateCode(item.CdType, item.CdName, item.CdValueName)
                    }
                });
            }
            return [];
        }
        else {
            let mod = listSource.split(".");
            if (mod.length > 1) {
                let moduleInfo = new ModuleInfo(mod[0], mod[1], {});
                let res: any = await this.moduleService.executeModule(moduleInfo, mod[2]).toPromise();
                if(res && res.status == 1){
                    console.log('moduleInfo', res);
                    return res.data;
                }
                return [];
            }
            return [];
        }
    }

    mapListSourceField() {

    }
} 