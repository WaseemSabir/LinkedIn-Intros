import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { LoginFormComponent } from './login-form/login-form.component';
import { HomePageComponent} from './home-page/home-page.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { AddListModalComponent, ModalView } from './add-list-modal/add-list-modal.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ListViewComponent } from './list-view/list-view.component';
import {MatCardModule} from '@angular/material/card';
import { CardComponent } from './small-components/card/card.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { SettingViewComponent } from './setting-view/setting-view.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { PendingListComponent } from './pending-list/pending-list.component';
import { NzListModule } from 'ng-zorro-antd/list';

registerLocaleData(en); 

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    HomePageComponent,
    RegisterFormComponent,
    AddListModalComponent,
    ListViewComponent,
    ModalView,
    CardComponent,
    SettingViewComponent,
    PendingListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    HttpClientModule,
    NgxSpinnerModule,
    MatCheckboxModule,
    MatDialogModule,
    NzModalModule,
    NzButtonModule,
    NzDropDownModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    NzGridModule,
    MatCardModule,
    NzInputModule,
    NzSliderModule,
    NzInputNumberModule,
    NzSelectModule,
    NzListModule
  ],
  providers: [CookieService, { provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
