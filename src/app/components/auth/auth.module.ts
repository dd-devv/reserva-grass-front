import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyMailComponent } from './verify-mail/verify-mail.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { RouterModule } from '@angular/router';
import { RegisterEmpresaComponent } from './register-empresa/register-empresa.component';
import { WaitComponent } from './wait/wait.component';
import { SideMenuRegisterComponent } from './side-menu-register/side-menu-register.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyMailComponent,
    RegisterEmpresaComponent,
    WaitComponent,
    SideMenuRegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    GoogleMapsModule,
    AppRoutingModule,
    RouterModule
  ]
})
export class AuthModule { }
