import { Injectable } from '@angular/core';
import { ModuleInfo } from '../../common/models/moduleInfo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../common/config';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    apiUri: string = `${config.apiUrl}/api/auth`;
    constructor(
        public http: HttpService
    ) { }
    public authData;
    login(userName: string, password: string) {
        let url = `${this.apiUri}/authorize`;
        return this.http.post(url, { userName, password });
    }

    getAuthData() {
        let dt = localStorage.getItem("auth_data");
        if (dt) {
            return JSON.parse(dt)
        }
        return null;
    }

    setAuthData(authData) {
        if (authData)
            localStorage.setItem('auth_data', JSON.stringify(authData));
    }

    getAppKey(){
        let dt = localStorage.getItem("appkey");
        return dt;
    }
}