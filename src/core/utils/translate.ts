import { StateService } from '../services/stateService';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CoreTranslate {
    constructor(private stateService: StateService) {

    }
    translateText(modname: string, text: string): string {
        let modLang = this.stateService.LANGS.filter(o => o.LangName === `${modname}$${text}.Text` && o.LangId === this.stateService.language);
        if (modLang.length > 0) {
            return modLang[0].LangValue;
        }
        else {
            let globalLang = this.stateService.LANGS.filter(o => o.LangName === `GLOBAL$${text}.Text` && o.LangId === this.stateService.language);
            if (globalLang.length > 0) {
                return globalLang[0].LangValue;
            }
            else {
                return text;
            }
        }
    }

    translateField(modname: string, fldName: string): string {
        let modLang = this.stateService.LANGS.filter(o => o.LangName === `${modname}$${fldName}.Label` && o.LangId === this.stateService.language);
        if (modLang.length > 0) {
            return modLang[0].LangValue;
        }
        else {
            let globalLang = this.stateService.LANGS.filter(o => o.LangName === `GLOBAL$${fldName}.Label` && o.LangId === this.stateService.language);
            if (globalLang.length > 0) {
                return globalLang[0].LangValue;
            }
            else {
                return fldName;
            }
        }
    }

    translateModule(modname: string): string {
        let langname: string = modname + ".Title";
        console.log(modname);
        if(modname == "NOTI_SEARCH"){
            return "Tra cứu thông báo"
        }
        let modLang = this.stateService.LANGS.filter(o => o.LangName === langname && o.LangId == this.stateService.language);
        // console.log(this.stateService.language, modname, modLang, langname);
        if (modLang.length > 0) {
            return modLang[0].LangValue;
        }
        else {
            return modname;
        }
    }

    translateCode(cdType: string, cdName: string, cdValueName: string): string {
        let modLang = this.stateService.LANGS.filter(o => o.LangName === `CODE$${cdType}.${cdName}.${cdValueName}` && o.LangId === this.stateService.language);
        if (modLang.length > 0) {
            return modLang[0].LangValue;
        }
        else {
            return cdValueName;
        }
    }
}