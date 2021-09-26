import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LazyLoadModule } from './lazy-load/lazy-load.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StateService } from '../core/services/stateService';
import { LoaderService } from './core/loader/loader.service';
import { LoaderComponent } from './core/loader/loader.component';
import { CoreTranslate } from '../core/utils/translate';
import { NavService } from '../core/services/navService';

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    LazyLoadModule,
    CoreModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    StateService,
    LoaderService,
    CoreTranslate,
    NavService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
