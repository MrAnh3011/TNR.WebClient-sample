import { Injectable } from '@angular/core';
import { ModuleInfo } from '../../common/models/moduleInfo';
import { config } from '../../common/config';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class ModuleService {
    apiUri: string = `${config.apiUrl}/api/module`;
    
    constructor(
        public http: HttpService
    ) { }
    executeModule(moduleInfo: ModuleInfo, appKey? : string) {
        // let key = appKey;
        // if(appKey){
        //     key = localStorage.getItem("appkey");
        // }
        let url = `${this.apiUri}/execute-module`;
        return this.http.post(url, moduleInfo);
    }

    executeAnonymous(moduleInfo: ModuleInfo) {
        let url = `${this.apiUri}/execute-module`;
        this.http.post(url, moduleInfo).subscribe(res => {
            console.log(res);
        })
    }
}