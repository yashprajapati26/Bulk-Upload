import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadCsvComponent } from './components/upload-csv/upload-csv.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomePageComponent
  },
  {
    path: 'upload-csv',
    component: UploadCsvComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

//test
