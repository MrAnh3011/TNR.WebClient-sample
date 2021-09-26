import { StateService } from '../services/stateService';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CommonUtils {
    constructor(private stateService: StateService) {

    }

    joinString(str: string[]) {
        var result = "";
        for (let index = 0; index < str.length; index++) {
            const element = str[index];
            result += element;
            if (index < str.length - 1) {
                result += ","
            }
        }
        return result;
    }

    splitString(str: String) {
        return str.split(",");
    }

    filterInArray(source: any[], dest: any[], source_field: string) {
        let res = source.filter(f => dest.includes(f[source_field]));
        return res;
    }

    getCallBackInfo(callBack: string){
        let info = callBack.split(".");
        let paramsString = info[2];
        let params = [];
        if(paramsString){
            params =  this.splitString(paramsString);
        }
        let result = {
            modId: info[0],
            subMod: info[1],
            params
        }
        return result;
    }
}