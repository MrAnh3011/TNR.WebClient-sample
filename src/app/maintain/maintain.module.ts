import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatIconModule, MatTabsModule, MatStepperModule, MatListModule, MatToolbarModule, MatFormFieldModule, MatInputModule, MatExpansionModule, MatNativeDateModule, MatDatepickerModule, MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatTooltipModule, MatChipsModule, MatButtonToggleModule, MatGridListModule, MatRadioModule, MatDialogModule, MatSelectModule, MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import * as hljs from 'highlight.js';
import { HighlightJsModule, HIGHLIGHT_JS } from 'angular-highlight-js';
import * as hljsTypescript from 'highlight.js/lib/languages/typescript';
import { HttpClientModule } from '@angular/common/http';
import { MaintainComponent } from './maintain.component';
import { DatepickerControlComponent } from '../../core/controls/datepicker/datepicker';
import { ComboboxControlComponent } from '../../core/controls/combobox/combobox';
import { QuillModule } from 'ngx-quill';
import { ControlLookup } from '../../core/controls/lookup/lookup';
import { ControlChat } from '../../core/controls/chat/chat';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ControlRichText } from '../../core/controls/richtext/richtext';

export const appRoutes: Routes = [
  { path: '', component: MaintainComponent }
];

export function highlightJsFactory(): any {
  hljs.registerLanguage('typescript', hljsTypescript);
  return hljs;
}

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
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
    MatSelectModule,
    QuillModule,
    PerfectScrollbarModule,
    HighlightJsModule.forRoot({
      provide: HIGHLIGHT_JS,
      useFactory: highlightJsFactory
    }),
    RouterModule.forChild(appRoutes)
  ],
  declarations: [
    MaintainComponent,
    DatepickerControlComponent,
    ComboboxControlComponent,
    ControlLookup,
    ControlChat,
    ControlRichText
  ],
  exports: [

  ],
  providers:[
    {provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: {float: 'never'}}
  ],
  entryComponents: [],
})
export class MaintainModule { }
