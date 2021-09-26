import { Injectable } from '@angular/core';
import { ModuleInfo } from '../../common/models/moduleInfo';
import { config } from '../../common/config';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class CacheService {
    apiUri: string = `${config.apiUrl}/api/cache`;
    constructor(
        public http: HttpService
    ) { }
    getLang() {
        let url = `${this.apiUri}/get-lang`;
        return this.http.get(url);
    }

    getCode() {
        let url = `${this.apiUri}/get-codes`;
        return this.http.get(url);
    }
    getHtml(url) {
        return ``;
    }
    getFunc(funcSign) {
        let url = `${this.apiUri}/get-func?funcSign=${funcSign}`;
        return this.http.get(url);
    }

    refreshCache() {
        let url = `${this.apiUri}/refresh-cache`;
        return this.http.post(url, {});
    }
}