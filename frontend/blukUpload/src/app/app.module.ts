import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { NgxUiLoaderConfig, NgxUiLoaderModule, PB_DIRECTION, POSITION, SPINNER } from "ngx-ui-loader";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadCsvComponent } from './components/upload-csv/upload-csv.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { Angular2CsvModule } from 'angular2-csv';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsColor: "sky"
};

@NgModule({
  declarations: [
    AppComponent,
    UploadCsvComponent,
    WelcomePageComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    Angular2CsvModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
