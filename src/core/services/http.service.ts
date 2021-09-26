import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from '../../common/config';

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    constructor(
        public http: HttpClient
    ) {}
    
    post(url: string, data: any){
        let token = localStorage.getItem("auth_token");
        return this.http.post(url, data, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
    }

    get(url: string){
        let token = localStorage.getItem("auth_token");
        return this.http.get(url, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
    }

    fetchUrl(url){
        return this.http.get(url);
    }

}