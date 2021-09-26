import { Injectable } from '@angular/core';
import { ModuleInfo } from '../../common/models/moduleInfo';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../common/config';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    apiUri: string = `${config.apiUrl}/api/admin`;
    constructor(
        public http: HttpService
    ) { }
    public authData;
    getMenus() {
        let url = `${this.apiUri}/menus`;
        return this.http.get(url);
    }

    addMenu(menu) {
        let url = `${this.apiUri}/add-menu`;
        return this.http.post(url, menu);
    }

    editMenu(menu) {
        let url = `${this.apiUri}/edit-menu`;
        return this.http.post(url, menu);
    }
    deleteMenu(menu) {
        let url = `${this.apiUri}/delete-menu`;
        return this.http.post(url, menu);
    }
}