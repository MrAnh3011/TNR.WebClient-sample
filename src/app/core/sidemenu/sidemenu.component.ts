import { Component, OnInit, Input } from "@angular/core";
import { menus } from "./menu-element";
import { AdminService } from "../../../core/services/admin.service";
import { ModuleService } from "../../../core/services/module.service";
import { ModuleInfo } from "../../../common/models/moduleInfo";

@Component({
  selector: "cdk-sidemenu",
  templateUrl: "./sidemenu.component.html",
  styleUrls: ["./sidemenu.component.scss"]
})
export class SidemenuComponent implements OnInit {
  @Input() iconOnly: boolean = false;
  public menus = menus;
  prefix = "/admin/search/";

  constructor(public moduleService: ModuleService) {}

  menuList: Array<any>;

  ngOnInit() {
    var menuModule = new ModuleInfo("D03801", "MMN", {});
    this.moduleService.executeModule(menuModule).subscribe((res: any) => {
      console.log("menu", res);
      this.menus = this.BindMenu(res.data);
      console.log("menuList", this.menus);
    });
  }

  BindMenu(list: Array<any>) {
    var menuList = [];
    list.forEach(element => {
      if (element.ParentId === 0) {
        var childrens = list.filter(o => o.ParentId === element.MenuId);
        var treeItem: any = {
          name: element.MenuName,
          icon: element.MenuIcon,
          link: element.AppRoute ? this.prefix + element.AppRoute : false,
          open: element.AppRoute ? true : false,
          chip: { value: childrens.length, color: "accent" },
          sub: this.BindSubMenu(list, element)
        };
        menuList.push(treeItem);
      }
    });
    return menuList;
  }

  BindSubMenu(list: Array<any>, item: any) {
    var self = this;
    var navList = [];
    list.forEach(element => {
      if (item.MenuId == element.ParentId) {
        var childrens = list.filter(o => o.ParentId === element.MenuId);
        var menu: any = {
          name: element.MenuName,
          icon: element.MenuIcon,
          link: element.AppRoute ? this.prefix + element.AppRoute : false,
          open: element.AppRoute ? true : false,
          chip: { value: childrens.length, color: "accent" },
          sub: self.BindSubMenu(list, element)
        };
        navList.push(menu);
      }
    });
    return navList;
  }
}
