import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Inject
} from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  MatDialog,
  MatSnackBar,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { SelectionModel } from "@angular/cdk/collections";
import { fromEvent as observableFromEvent, Observable } from "rxjs";
import { distinctUntilChanged, debounceTime } from "rxjs/operators";
import { ModuleService } from "../../core/services/module.service";
import { ModuleInfo } from "../../common/models/moduleInfo";
import { Router, ActivatedRoute } from "@angular/router";
import { StateService } from "../../core/services/stateService";
import * as moment from "moment";
import { LoaderService } from "../core/loader/loader.service";
import { ModuleField } from "../../core/models/ModuleField";
import { formatNumber } from "@angular/common";
import { CoreTranslate } from "../../core/utils/translate";
import { MaintainComponent } from "../maintain/maintain.component";
import { MediaChange, ObservableMedia } from "@angular/flex-layout";
import { ExecprocComponent } from "../execproc/execproc.component";
import { ExportService } from "../../core/services/export.service";
import { Module } from "../../core/modules/module";
import { config } from "../../common/config";
import { utils } from "../../common/utils";
import { CacheService } from "../../core/services/cache.service";
import { Utils } from "ag-grid-community";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public moduleService: ModuleService,
    private route: ActivatedRoute,
    private router: Router,
    private stateService: StateService,
    private loaderService: LoaderService,
    private translate: CoreTranslate,
    private snackbar: MatSnackBar,
    private media: ObservableMedia,
    public dialog: MatDialog,
    private exportService: ExportService,
    private cacheService: CacheService
  ) {}
  showNavListCode;
  displayedColumns: string[];
  valueColumns: string[];
  pageTitle: string;
  buttons: any[];
  fields: ModuleField[] = [];
  isBusy: boolean = false;
  loaded: boolean = false;
  isLookup: boolean = false;

  private gridApi;
  private gridColumnApi;

  layout = {};
  dataTreeView = [];
  selectedRow = [];

  moduleInfo: any;
  funcSign: string = "";
  columnDefs: any[] = [];
  rowData = [];
  selectedData = [];
  defaultColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    enableRowGroup: true,
    enablePivot: true
  };
  rowSelection = "multiple";
  rowGroupPanelShow = "always";
  pivotPanelShow = "always";
  paginationPageSize = 50;
  height: string = "500px";

  conditionFields: ModuleField[];

  overlayLoadingTemplate =
    '<span class="ag-overlay-loading-center">Đang tải...</span>';

  paginationNumberFormatter = function(params) {
    return "[" + params.value.toLocaleString() + "]";
  };

  onBtShowLoading() {
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }
  }

  onBtHide() {
    this.gridApi.hideOverlay();
  }

  onPageSizeChanged(newPageSize) {
    var value = document.getElementById("page-size").nodeValue;
    console.log(value);
    this.gridApi.paginationSetPageSize(Number(value));
  }
  updateHieght() {
    let body = document.body,
      html = document.documentElement;
    let h =
      Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      ) - 66;
    this.height = h + "px";
  }

  ngOnInit() {
    this.loaded = false;
    // console.log(this.stateService.LANGS)
    console.log(this.stateService.navData);
    this.getModule();
    this.updateHieght();
    this.media.subscribe((mediaChange: MediaChange) => {
      this.updateHieght();
    });
  }

  getModule() {
    this.loaderService.show();
    this.route.params.subscribe(params => {
      let sign = "";
      if (!params["funcSign"]) {
        sign = this.stateService.lookupParams;
        this.isLookup = true;
      } else {
        sign = params["funcSign"];
      }
      this.funcSign = sign;
      let module = new Module(
        this.funcSign,
        this.moduleService,
        this.stateService,
        this.translate,
        this.cacheService
      );
      // console.log(params)
      module.getModule().subscribe((res: any) => {
        console.log({res});
        this.loaderService.hide();
        if (res.status === 1) {
          this.moduleInfo = res.data;
          // console.log(JSON.parse(this.moduleInfo.Fields));
          if (this.moduleInfo.Buttons) {
            this.buttons = JSON.parse(this.moduleInfo.Buttons);
          }
          if (this.moduleInfo.Fields) {
            this.fields = JSON.parse(this.moduleInfo.Fields);
          }
          if (this.moduleInfo.Conditions) {
            this.conditionFields = JSON.parse(this.moduleInfo.Conditions);
          } else {
            this.conditionFields = [];
          }
          // console.log("ressssss", this.moduleInfo);
          
          if (this.moduleInfo.Layout) {
            this.layout = JSON.parse(this.moduleInfo.Layout);
          } else {
            this.layout = {};
          }
          this.pageTitle =
            this.moduleInfo.FuncName &&
            this.translate.translateModule(this.moduleInfo.FuncName);
          this.mapListSource().then(_ => {
            this.mapField();
          });
          this.getData();
        }
      });
    });
  }

  listSources: any = {};
  async mapListSource() {
    for (let index = 0; index < this.fields.length; index++) {
      const item = this.fields[index];
      if (item.ListSource) {
        let module: Module = new Module(
          this.funcSign,
          this.moduleService,
          this.stateService,
          this.translate,
          this.cacheService
        );
        this.listSources[item.FldName] = await module.getListSource(
          item.ListSource
        );
      }
    }
  }

  async mapField() {
    console.log(this.listSources);
    var columns = this.fields.map((item, index) => {
      return {
        headerName: this.translate.translateField(
          this.moduleInfo.FuncName,
          item.FldLabel
        ),
        field: item.FldName,
        checkboxSelection: index == 0 ? true : false,
        // cellRenderer: "agAnimateShowChangeCellRenderer",
        cellRenderer: params => {
          if (item.ListSource) {
            if (this.listSources[item.FldName]) {
              // console.log(params.value, this.listSources[item.FldName]);
              var dt = this.listSources[item.FldName];
              let rs = dt.filter(o => o.Value == params.value);
              // console.log(rs);
              if (rs.length > 0) {
                return rs[0].Text;
              } else {
                return params.value;
              }
            } else {
              return params.value;
            }
          } else {
            return this.parserValue(item, params.value);
          }
        },
        filter: this.filter(item),
        filterParams:
          item.CtrlType == "CDT"
            ? {
                comparator: function(filterLocalDateAtMidnight, cellValue) {
                  var cellDate = cellValue;
                  // alert(filterLocalDateAtMidnight + ";" + cellDate)
                  if (
                    moment(filterLocalDateAtMidnight).format("DD/MM/YYYY") ==
                    moment(cellDate).format("DD/MM/YYYY")
                  ) {
                    return 0;
                  }

                  if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                  }

                  if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                  }
                }
              }
            : null,
        cellStyle: function(params) {
          if (item.Color) {
            //mark police cells as red
            return { color: "COLOR$" + item.FldName + "." + params.value };
          } else {
            return null;
          }
        },
        rowGroup: item.GroupOnLoad === "Y",
        pinned:
          item.PinOnLoad == "L" ? "left" : item.PinOnLoad == "R" ? "right" : ""
      };
    });
    this.columnDefs = columns;
  }

  filter(field: ModuleField) {
    switch (field.CtrlType) {
      case "CTI":
        return "agTextColumnFilter";
      case "CNI":
        return "agNumberColumnFilter";
      case "CDT":
        return "agDateColumnFilter";
      case "CCB":
        return true;
      default:
        break;
    }
  }

  numberValueParser(params) {
    return Number(params.newValue);
  }

  textValueParser(params) {
    return params.newValue;
  }
  dateTimeValueParser(params) {
    return moment(params.newValue).format("DD/MM/YYYY");
  }

  parserValue(fld: ModuleField, value) {
    switch (fld.CtrlType) {
      case "CTI":
        return value;
      case "CDT":
        if (value) return moment(value).format("DD/MM/YYYY");
        else return value;
      case "CNI":
        return formatNumber(value, "en");
      case "IMG":
        if (value) return utils.renderImage(value.split(";"));
        return "";
      default:
        return value;
    }
  }

  getData() {
    console.log(this.conditions)
    this.onBtShowLoading();
    this.isBusy = true;
    let moduleInfo = new ModuleInfo(
      this.moduleInfo.ModId,
      this.moduleInfo.SubMod,
      {}
    );
    moduleInfo.Conditions = this.conditions;
    this.moduleService.executeModule(moduleInfo).subscribe((res: any) => {
      // console.log(res);
      if (res.status === 1) {
        this.isBusy = false;
        this.rowData = res.data;
        // console.log("rowDataaaaaaaaaaaaaaaaa", this.rowData);
        this.dataTreeView = utils.convertDataToTreeView(this.rowData);
        // console.log("data tree view", this.dataTreeView )
        this.onBtHide();
      }
    });
  }

  handleClick(event) {}

  onSelectionChanged(e) {
    if(this.gridApi.getSelectedRows().length > 0) {
      this.selectedData = this.gridApi.getSelectedRows();
    }
  }
  onSelectEnd() {
    this.stateService.lookupData = this.selectedData;
  }
  onButtonClick(btn: any) {
    let url = "/admin/" + btn.FuncType + "/" + btn.FuncSign;
    if(this.gridApi.getSelectedRows().length > 0) {
      this.selectedRow = this.gridApi.getSelectedRows();
    }
    switch (btn.ExecType) {
      case "A":
        if(this.selectedRow.length >0){
          this.stateService.navData = this.selectedRow[this.selectedRow.length -1];
        }
        else{
          this.stateService.navData = null;
        }
        break;
      case "S":
        if (this.selectedRow.length == 0) {
          this.snackbar.open("Bạn phải chọn dòng thao tác", "Đóng");
          return;
        } else {
          if (this.selectedRow.length > 1) {
            this.snackbar.open(
              "Chức năng này chỉ được phép thao tác trên 1 dòng",
              "Đóng"
            );
            return;
          } else this.stateService.navData = this.selectedRow[0];
        }
        break;
      case "M":
        if (this.selectedRow.length == 0) {
          this.snackbar.open("Bạn phải chọn dòng thao tác", "Đóng");
          return;
        } else this.stateService.navData = this.selectedRow;
      default:
        break;
    }
    this.stateService.navRoute = btn.FuncSign;
    this.openDialog(btn.FuncType);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  openDialog(type): void {
    switch (type) {
      case "maintain":
        this.dialog.open(MaintainComponent, {
          disableClose: true,
          minWidth: "1024px"
        });
        break;
      case "exec":
        this.dialog.open(ExecprocComponent, {
          disableClose: true,
          minWidth: "500px"
        });
        break;
      default:
        break;
    }

    this.dialog.afterAllClosed.subscribe(result => {
      console.log("The dialog was closed", result);
      this.getData();
      this.selectedRow = [];
    });
  }

  export() {
    this.exportService.exportAsExcelFile(this.rowData, this.pageTitle);
  }
  conditions: any[] = [];
  ope = [
    {
      Text: "Có chứa",
      Value: "LIKE"
    },
    {
      Text: "Không chứa",
      Value: "NOT LIKE"
    },
    {
      Text: "Bằng",
      Value: "="
    },
    {
      Text: "Khác",
      Value: "<>"
    },
    {
      Text: "Lớn hơn",
      Value: ">"
    },
    {
      Text: "Bé hơn",
      Value: "<"
    },
    {
      Text: "Bé hơn hoặc bằng",
      Value: "<="
    },
    {
      Text: "Lớn hơn hoặc bằng",
      Value: ">="
    }
  ];
  addCondition() {
    if (this.conditionFields.length == 0) return;
    var cond = {
      FldName: this.conditionFields[0].FldName,
      CtrlType: this.conditionFields[0].CtrlType,
      FldType: this.conditionFields[0].FldType,
      ListSource: this.conditionFields[0].ListSource,
      Operator: this.ope[0].Value,
      FldValue: this.conditionFields[0].DefaultValue
    };
    this.conditions.push(cond);
  }

  conditionFieldChange(e: any, con: any) {
    console.log(e.target.value);
    var fldname = e.target.value;
    var condition = this.conditionFields.filter(
      o => o.FldName == fldname
    )[0];
    con.FldName = fldname;
    con.FldType = condition.FldType;
    con.CtrlType = condition.CtrlType;
    con.ListSource = condition.ListSource;
    con.Operator = this.ope[0].Value;
    con.FldValue = condition.DefaultValue;
  }
  removeCondition(con) {
    var index = this.conditions.indexOf(con);
    this.conditions.splice(index, 1);
  }

  conditionValueChange(e: any, con) {
    con.FldValue = e;
  }

  changeCheckBox(event) {
    console.log("aaaaaaaaaaaaaaaaaaaaaaaa", event);
    if(event.checked) {
      this.selectedRow = [...this.selectedRow].concat(event);
    } else {
      this.selectedRow = [...this.selectedRow].filter(item => item.MenuId !== event.MenuId);
    }
  }
}
