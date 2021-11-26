import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// routing not used in app instead custome routing servuce is used for state management
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
