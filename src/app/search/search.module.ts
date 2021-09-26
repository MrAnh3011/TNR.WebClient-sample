import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatTabsModule, MatStepperModule, MatListModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatExpansionModule, MatNativeDateModule, MatDatepickerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatTooltipModule, MatChipsModule, MatButtonToggleModule, MatGridListModule, MatRadioModule, MatDialogModule, MatSpinner, MatSnackBarModule, MatDialogRef } from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import * as hljs from 'highlight.js';
import { HighlightJsModule, HIGHLIGHT_JS } from 'angular-highlight-js';
import * as hljsTypescript from 'highlight.js/lib/languages/typescript';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './search.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { AgGridModule } from 'ag-grid-angular';
import { ExportService } from '../../core/services/export.service';
import 'ag-grid-enterprise'
import { FormFieldComponent } from '../../core/controls/formfield/formfield';

import {MatTreeModule} from '@angular/material/tree';
import { MenuComponent } from '../menu/menu.component';

export const appRoutes: Routes = [
  { path: '', component: SearchComponent },
];

export function highlightJsFactory(): any {
  hljs.registerLanguage('typescript', hljsTypescript);
  return hljs;
}

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatListModule,
    MatStepperModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatChipsModule,
    MatButtonToggleModule,
    HttpClientModule,
    MatGridListModule,
    MatRadioModule,
    MatDialogModule,
    OverlayModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    HighlightJsModule.forRoot({
      provide: HIGHLIGHT_JS,
      useFactory: highlightJsFactory
    }),
    RouterModule.forChild(appRoutes),
    AgGridModule.withComponents([])
  ],
  declarations: [
    SearchComponent,
    FormFieldComponent,
    MenuComponent
  ],
  exports: [
  ],
  entryComponents: [],
  providers:[
    ExportService
  ]
})
export class SearchModule { }
