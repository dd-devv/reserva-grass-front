import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { GuestService } from 'src/app/services/guest.service';
import { environment } from '../../../../assets/environments/environment';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register-empresa',
  templateUrl: './register-empresa.component.html',
  styleUrls: ['./register-empresa.component.css']
})

export class RegisterEmpresaComponent implements OnInit {

  public empresa: any = {
    region: '',
    provincia: '',
    distrito: ''
  };

  public user: any = {};

  public password: any;
  public password1 = '';
  public show = false;
  public showAlertLink = false;
  public alert_pass = false;

  public regiones: Array<any> = [];
  public namereg ='';
  public provincias: Array<any> = [];
  public nameprov ='';
  public distritos: Array<any> = [];

  public provincias_arr: Array<any> = [];
  public distritos_arr: Array<any> = [];
  public vacio = true;

  public valid = false;
  public validLink = false;

  public recordar = true;

  public usuario: any = {};
  public token: any;
  public id: any;
  public user_lc: any;

  public load_btn_crear = false;
  public load_register = false;
  public car : any = { };

  isDisabledProvincia = true;
  isDisabledDistrito = true;

  center: google.maps.LatLngLiteral = { lat: -13.1588, lng: -74.2232 };
  zoom = 13;
  map: google.maps.Map | undefined;
  marker: google.maps.Marker | undefined;
  selectedLocation: google.maps.LatLngLiteral | null = null;
  latitude: number | null = null;
  longitude: number | null = null;
  googleMapsLink: string = '';

  // Define tus estilos de mapa light
  lightMapStyles: google.maps.MapTypeStyle[] = [
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e9e9e9"
        },
        {
          "lightness": 17
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        },
        {
          "lightness": 20
        }
      ]
    },
    // Agrega más estilos aquí
  ];

  mapOptions: google.maps.MapOptions = {
    center: this.center,
    zoom: this.zoom
  };

  onMapReady(map: google.maps.Map) {
    this.map = map;
  }

  constructor(
    //private _userService: UserService,
    private _router: Router,
    private _title: Title,
    private _guestService: GuestService,
    private _userService: UserService,
    private _toastrService: ToastrService
  ) {

    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');

    this._guestService.obtener_regiones().subscribe(
      response => {
        response.forEach((element: { id: any; name: any; }) => {
          this.regiones.push({
            id: element.id,
            name: element.name
          });
        });
      }
    );

    if (this.token) {
      _userService.obtener_user(this.id, this.token).subscribe(response => {
        if (response.data == undefined) {
          _userService.obtener_empresa(this.id, this.token).subscribe(empresaResponse => {
            this.user = empresaResponse.data || response.data;
            localStorage.setItem('user_data', JSON.stringify(this.user));
            this.user_lc = JSON.parse(localStorage.getItem('user_data')!) || undefined;
    
            if (this.user_lc) {
              switch (this.user_lc.role) {
                case 'GRASS':
                  this._router.navigate(['/grass']);
                  break;
                case 'ADMIN':
                  this._router.navigate(['/admin']);
                  break;
                case 'USER':
                  this._router.navigate(['/usuario']);
                  break;
                default:
                  this.user_lc = undefined;
              }
            } else {
              this.user_lc = undefined;
            }
          });
        } else {
          this.user = response.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));
          this.user_lc = JSON.parse(localStorage.getItem('user_data')!) || undefined;
    
          if (this.user_lc) {
            switch (this.user_lc.role) {
              case 'ADMIN':
                this._router.navigate(['/admin']);
                break;
              case 'USER':
                this._router.navigate(['/usuario']);
                break;
              default:
                this.user_lc = undefined;
            }
          } else {
            this.user_lc = undefined;
          }
        }
      });
    }

    this.car = {
      techado: false,
      canchas_futsal: 0,
      canchas_voley: 0,
      iluminacion: false,
      garaje: false
    } 
    
  }

  ngOnInit(): void {
    this._title.setTitle('Registro de empresas');
    this.password = 'password';
  }

  async onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      
      this.selectedLocation = { lat, lng };
      this.empresa.ubicacion = `https://www.google.com/maps?q=${lat},${lng}`;
      
      console.log("Enlace de Google Maps:", this.empresa.ubicacion);  
      
      // Aquí puedes hacer lo que necesites con el enlace, por ejemplo:
      // - Mostrarlo en la interfaz de usuario
      // - Enviarlo a un servicio
      // - Almacenarlo para uso posterior
    }
  }

  // validarURL() {
  //   const urlRegex = /^(https:\/\/maps\.app\.goo\.gl\/[a-zA-Z0-9]+)$/;

  //   if (urlRegex.test(this.empresa.ubicacion)) {
  //     this.validLink = true;
  //     this.showAlertLink = false;
  //   } else {
  //     this.validLink = false;
  //     this.showAlertLink = true;
  //   }
  // }

  //Comparar contraseñas
  compare_password() {
    if (this.password1 == this.empresa.password) {
      this.alert_pass = false;
      this.valid = true;

    } else if (this.password1 != this.empresa.password) {
      this.alert_pass = true;
      this.valid = false;
    }
  }

  select_region() {
    this.provincias = [];
    this.distritos = [];
    this.isDisabledProvincia = false;
    this.isDisabledDistrito = true;
    this.empresa.provincia = '';
    this.empresa.distrito = '';
    this._guestService.obtener_provincias().subscribe(
      response => {
        response.forEach((element: { department_id: any; }) => {
          if (element.department_id == this.empresa.region) {
            this.provincias.push(element);
          }
        });
      }
    );
    
    const regencontrado = this.regiones.find(objeto => objeto.id === this.empresa.region);

    this.namereg = regencontrado.name;
  }

  select_provincia() {
    this.distritos = [];
    this.isDisabledDistrito = false;
    this.empresa.distrito = '';
    this._guestService.obtener_distritos().subscribe(
      response => {
        response.forEach((element: { province_id: any; }) => {
          if (element.province_id == this.empresa.provincia) {
            this.distritos.push(element);
          }
        });
      }
    );

    const provencontrado = this.provincias.find(objeto => objeto.id === this.empresa.provincia);

    this.nameprov = provencontrado.name;
    
  }

  registrar(registroForm: any) {
    this.load_register = true;
    if (registroForm.valid) {

      let data = {
        nombre: this.empresa.nombre,
        direccion: this.empresa.direccion,
        email: this.empresa.email,
        telefono: this.empresa.telefono,
        telefono_fijo: this.empresa.telefono_fijo,
        region: this.namereg,
        provincia: this.nameprov,
        distrito: this.empresa.distrito,
        ubicacion: this.empresa.ubicacion,
        referencia: this.empresa.referencia,
        horario_atencion: this.empresa.horario_atencion,
        password: this.empresa.password,
      }

      this._userService.registro_empresa(data).subscribe({
        next: (res) => {
          localStorage.setItem('_id', res.data._id);

            let dataChar = {
              empresa: res.data._id,
              techado: this.car.techado,
              canchas_futsal: this.car.canchas_futsal,
              canchas_voley: this.car.canchas_voley,
              iluminacion: this.car.iluminacion,
              garaje : this.car.garaje
            }
        
            this._userService.crear_caracteristicas_empresa(res.data._id, res.token, dataChar).subscribe(
              response => {
              }
            );
            

            this._toastrService.success('Se registró con éxito', 'REGISTRADO!');
            this.load_register = false;
            this._router.navigate(['/wait']);

            // this._userService.enviar_correo_confirmacion(response.data._id).subscribe(
            //   response => {
            //     if (response.data) {
            //       this._toastrService.success('Se envió el código de verificación', 'ENVIADO!');
            //       this._router.navigate(['/verificar']);
            //     }
            //   }
            // );
        },

        error: (err) => {
          this._toastrService.error(err.error.message, 'ERROR');
          this.load_register = false;
        }
      });

    } else {
      this._toastrService.error('Los datos del formulario no son válidos', 'ERROR');
      this.load_register = false;
    }
  }

  onClickPass() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

}
