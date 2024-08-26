import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { GLOBAL } from '../../../services/global';
import Chart from 'chart.js/auto';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  public empresa: any = {};
  public chart: any;
  public cantidad = 0;
  public total_ventas = 0;
  public total_mes = 0;
  public total_mes_anterior = 0;
  public total_mes_sim = 0;
  public total_mes_anterior_sim = 0;
  public count_ventas = 0;
  public load_data = true;
  public id: any;
  public token: any;
  public load_btn = false;
  public isImagePort = false;
  public addImage = true;
  public isImage = false;
  public url: any;
  public load_btn_eliminar = false;
  public file: File | any = undefined;
  public colores = ['rgb(20, 203, 139)', 'rgb(169, 19, 249)', 'rgb(249, 84, 183)', 'rgb(20, 120, 252)', 'rgb(255, 124, 25)'];
  public canchas: Array<any> = [];

  public exist_susc = true;
  public viewButton: boolean = false;
  public activePagos: boolean = false;
  public suscripciones: Array<any> = [];

  imagePreview: string | ArrayBuffer | null = null;

  croppedImageFile: File | null = null;
  
  imageChangedEvent: any = '';
  croppedImage: SafeUrl = '';
  public show_image = false;

  constructor(
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _title: Title,
    private _toastrService: ToastrService,
    private sanitizer: DomSanitizer
  ) {
    this.token = localStorage.getItem('token') || sessionStorage.getItem('token');
    this.id = localStorage.getItem('_id') || sessionStorage.getItem('_id');
    this.url = GLOBAL.url;

    this.init_data();
  }

  init_data() {
    this.imageChangedEvent = null;
    this.croppedImageFile = null;
    this.file = null;
    this.show_image = false;
    this.load_data = true;
    this.isImage = false;
    this._userService
      .obtener_empresa(this.id, this.token)
      .subscribe((response) => {
        if (response.data == undefined) {
          this.empresa = undefined;
          this.load_data = false;
        } else {
          this.empresa = response.data;

          if (this.empresa.portada) {
            if (this.empresa.portada.length >= 1) {
              this.isImagePort = true;
              this.addImage = false;
            } else {
              this.isImagePort = false;
              this.addImage = true;
            }
          } else {
            this.isImagePort = false;
            this.addImage = true;
          }

          this._userService.obtener_suscripciones_empresa(this.empresa._id, this.token).subscribe(
            response => {
              if (response.data == undefined) {
                this.exist_susc = false;
                this.viewButton = true;
                this.activePagos = false;
              } else {
                this.exist_susc = true;
                this.suscripciones = response.data;

                for (let i = 0; i < this.suscripciones.length; i++) {
                  if (this.suscripciones[i].estado == 'Confirmado') {
                    this.activePagos = true;
                    this.viewButton = false;
                    break;
                  } else {
                    this.activePagos = false;
                  }
                }

                if (this.suscripciones.at(0).estado !== 'Confirmado') {
                  this.viewButton = true;
                  this.activePagos = false;
                }
              }
            }
          );

          this.load_data = false;
        }
      });
  }

  fileChangeEventCrop(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageChangedEvent = event;

      const allowedTypes = [
        'image/png', 'image/webp', 'image/jpg', 'image/jpeg',
        'image/PNG', 'image/WEBP', 'image/JPG', 'image/JPEG'
      ];

      if (!allowedTypes.includes(file.type)) {
        this._toastrService.error('Solo se permiten archivos webp, jpeg, jpg, png', 'ERROR');
        return;
      }

      this.show_image = true;

      // Continúa con el procesamiento de la imagen si el tipo es válido
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      // Crear un nuevo archivo a partir del blob
      this.croppedImageFile = new File([event.blob], 'cropped_image.png', { type: 'image/png' });

      // Crear una URL para previsualización
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(event.blob));

      // Asignar el archivo a foto_perfil (asumiendo que foto_perfil es de tipo File)
      this.file = this.croppedImageFile;
    }
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  init_chart() {
    this._userService.obtener_canchas_empresa(this.id, this.token).subscribe(
      canchasResponse => {
        this.canchas = canchasResponse.data;
  
        // Objeto para almacenar datos de todas las canchas
        const datasets: any = [];
  
        // Iterar sobre cada cancha
        this.canchas.forEach((cancha, index) => {
          this._userService.kpi_ganancias_mensuales_grass(cancha._id, this.token).subscribe(
            response => {
              // Obtener color dinámicamente del arreglo de colores
              const color = this.colores[index % this.colores.length];
  
              // Almacenar resultados de cada cancha con el color correspondiente
              const canchaData = {
                label: cancha.nombre,
                data: [response.enero, response.febrero, response.marzo, response.abril, response.mayo, response.junio, response.julio, response.agosto, response.septiembre, response.octubre, response.noviembre, response.diciembre],
                backgroundColor: color,
                borderColor: color,
                tension: 0.4
              };

              this.count_ventas += response.count_ventas;
  
              datasets.push(canchaData);
  
              // Crear el gráfico después de obtener todos los datos
              if (datasets.length === this.canchas.length) {
                this.createChart(datasets);
              }
            }
          );
        });
      }
    );
  }
  
  createChart(datasets: any) {
    // Crear el gráfico con todos los datos de las canchas
    this.chart = new Chart("MyChart", {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        datasets: datasets
      },
      options: {
        aspectRatio: 2
      }
    });
  
    this.load_data = false;
  }
  

  ngOnInit(): void {
    this._title.setTitle('GRASS | Galería de canchas');
    this.init_chart();
  }



  //--------------------------------------------------------------
  fileChangeEvent(event: any): void {
    const file = event.target.files && event.target.files[0];

    if (!file) {
      this.showErrorMessage('No hay imagen en el envío');
      return;
    }

    if (file.size > 20000000) {
      this.showErrorMessage('La imagen no debe ser mayor a 20MB');
      return;
    }

    if (
      ![
        'image/png',
        'image/webp',
        'image/jpg',
        'image/jpeg',
        'image/gif',
      ].includes(file.type)
    ) {
      this.showErrorMessage('El archivo debe ser una imagen');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    this.file = file;
    this.isImage = true;

    if (file) {
      // Convierte el archivo en una URL de datos (data URL)
      this.convertToBase64(file);
    }
  }

  convertToBase64(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      // Asigna la URL de datos a la propiedad imagePreview
      this.imagePreview = e.target.result;
    };

    // Lee el contenido del archivo como una URL de datos
    reader.readAsDataURL(file);
  }

  subir_imagen() {
    this.load_btn = true;
    const uuid = uuidv4();

    if (this.file) {
      const data = {
        imagen: this.file,
        _id: uuid,
      };

      this._userService
        .agregar_imagen_portada(this.id, data, this.token)
        .subscribe((response) => {
          this._toastrService.success(
            'Se subió con éxito',
            'PORTADA ACTUALIZADA!'
          );
          this.init_data();
          this.file = undefined;
          this.load_btn = false;
        });
    } else {
      this.showErrorMessage('Debe seleccionar una imagen');
      this.load_btn = false;
    }
  }

  eliminar(id: any) {
    this.load_btn_eliminar = true;
    this._userService
      .eliminar_imagen_portada(this.id, { _id: id }, this.token)
      .subscribe((response) => {
        this._toastrService.success('Se eliminó con éxito', 'ELIMINADO!');
        this.load_btn_eliminar = false;
        this.init_data();
      });
  }

  private showErrorMessage(message: string) {
    this._toastrService.error(message, 'ERROR!');
  }
}
