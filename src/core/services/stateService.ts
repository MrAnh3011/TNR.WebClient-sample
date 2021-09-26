import { DefCode } from "../models/DefCode";
import { DefLang } from "../models/DefLang";
import { Injectable } from "@angular/core";
@Injectable({
  providedIn: 'root',
})
export class StateService {
  public navRoute: string;
  public navData: any;
  public lookupParams: any;
  public lookupData: any;
  public language: string = "vn";
  public CODES: Array<DefCode>;
  public LANGS: Array<DefLang>;
  public APPKEY: String;

  getCode(cdtype: string, cdname: string) {
    let codes = this.CODES.filter(o => o.CdType === cdtype && o.CdName === cdname);
    return codes;
  }
}