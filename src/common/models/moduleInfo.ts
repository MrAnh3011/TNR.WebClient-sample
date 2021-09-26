export class ModuleInfo{
    ModId: string;
    SubMod: string;
    ModuleData: any;
    Conditions?: any[];

    constructor(modid, submod, moduleData){
        this.ModId = modid;
        this.SubMod = submod;
        this.ModuleData = moduleData;
    }
}