import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { InicioComponent } from './inicio/inicio.component';
import { NavComponent } from './nav/nav.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactoComponent } from './contacto/contacto.component';
import { DatosComponent } from './perfil/datos/datos.component';
import { ReservasComponent } from './perfil/reservas/reservas.component';
import { ActualizarComponent } from './perfil/actualizar/actualizar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { UpdatePasswordComponent } from './perfil/update-password/update-password.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FootUserComponent } from './foot-user/foot-user.component';
import { VerGrassComponent } from './ver-grass/ver-grass.component';
import { VerMovilComponent } from './ver-movil/ver-movil.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PoliticaPrivComponent } from './politica-priv/politica-priv.component';
import { TermCondicionesComponent } from './term-condiciones/term-condiciones.component';
import { DeleteAccountComponent } from './perfil/delete-account/delete-account.component';
import { DirectorioComponent } from './directorio/directorio.component';


@NgModule({
  declarations: [
    InicioComponent,
    NavComponent,
    NosotrosComponent,
    ContactoComponent,
    DatosComponent,
    ReservasComponent,
    ActualizarComponent,
    SidebarComponent,
    UpdatePasswordComponent,
    FootUserComponent,
    VerGrassComponent,
    VerMovilComponent,
    PoliticaPrivComponent,
    TermCondicionesComponent,
    DeleteAccountComponent,
    DirectorioComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    QRCodeModule,
    NgxPaginationModule
  ]
})
export class UserModule { }
