import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-directorio',
  templateUrl: './directorio.component.html',
  styleUrls: ['./directorio.component.css']
})
export class DirectorioComponent implements OnInit {

  public primeras_empresas: Array<any> = [];
  public load_data = false;

  constructor(
    private _title: Title,
    private _userService: UserService
  ) {

  }

  ngOnInit(): void {
    this._title.setTitle('Directorio');
    this.load_data = true;

    this._userService.listar_empresas_publico().subscribe((response) => {
      if (response.data != undefined) {
        this.primeras_empresas = response.data;
        this.load_data = false;
      } else {
        this.primeras_empresas = [];
      }
    });
  }

}
