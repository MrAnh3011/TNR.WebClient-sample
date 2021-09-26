import {NestedTreeControl} from '@angular/cdk/tree';
import {Component} from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {OnChanges, OnInit, Input, Output, EventEmitter} from '@angular/core';

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */

interface TreeView {
  MenuId: number,
  ParentId: number,
  MenuCode: string,
  MenuName: string,
  MenuIcon: string,
  FuncId: number,
  MenuGroup: number,
  MenuPosition: number,
  Visible: true,
  AppRoute: string,
  checked: boolean,
  children: TreeView[],
}

/**
 * @title Tree with nested nodes
 */
@Component({
  selector: 'app-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss'],
})
export class MenuComponent implements OnInit, OnChanges {

  @Input() dataTreeView;
  @Output() changeCheckBox = new EventEmitter<object>();

  treeControl = new NestedTreeControl<TreeView>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeView>();
  
  ngOnInit() {

  }

  ngOnChanges() {
    this.dataTreeView.forEach(origin => {
      origin.children.forEach(item => item.checked = false);
    });
    this.dataSource.data = this.dataTreeView;
  }

  onChecked = (data) => {
    console.log("test");
    this.dataTreeView.forEach(origin => {
      origin.children.forEach(item => {
        if(item.MenuId === data.MenuId) {
          item.checked = !item.checked
        }
      })
    })
    this.changeCheckBox.emit(data);
  }

  onTest = (data) => {
    console.log("test");
  }

  constructor() {
    // this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: TreeView) => !!node.children && node.children.length > 0;
}