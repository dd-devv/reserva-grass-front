import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/main/home/home.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterEmpresaComponent } from './components/auth/register-empresa/register-empresa.component';
import { VerifyMailComponent } from './components/auth/verify-mail/verify-mail.component';
import { WaitComponent } from './components/auth/wait/wait.component';
import { AuthAdminGuard } from './guards/auth-admin.guard';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register_empresa', component: RegisterEmpresaComponent},
  {path: 'registro', component: RegisterComponent},
  {path: 'verificar', component: VerifyMailComponent},
  {path: 'wait', component: WaitComponent},

  //Lazy load de modulo de ADMIN
  {
    path: 'admin',
    loadChildren: () => import('./components/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthAdminGuard]
  },


  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
