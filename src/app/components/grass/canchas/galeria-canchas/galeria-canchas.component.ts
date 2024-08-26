import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { v4 as uuidv4 } from 'uuid';
import { GLOBAL } from '../../../../services/global';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';

@Component({
  selector: 'app-galeria-canchas',
  templateUrl: './galeria-canchas.component.html',
  styleUrls: ['./galeria-canchas.component.css'],
})
export class GaleriaCanchasComponent implements OnInit {
  public cancha: any = {};
  public id: any;
  public token: any;
  public load_data = true;
  public load_btn = false;
  public field_upload = true;
  public isImage = false;
  public url: any;
  public load_btn_eliminar = false;
  public file: File | any = undefined;
  public nombreArchivo: string = '';

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
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;

    this._route.params.subscribe((params) => {
      this.id = params['id'];
      this.init_data();
    });
  }

  init_data() {
    this.imageChangedEvent = null;
    this.croppedImageFile = null;
    this.file = null;
    this.show_image = false;
    this.load_data = true;
    this.isImage = false;
    this._userService
      .obtener_cancha_empresa(this.id, this.token)
      .subscribe((response) => {
        if (response.data == undefined) {
          this.cancha = undefined;
          this.load_data = false;
        } else {
          this.cancha = response.data;

          //Limitar la galería a 5 fotos
          if (this.cancha.galeria.length == 5) {
            this.field_upload = false;
          } else {
            this.field_upload = true;
          }

          this.load_data = false;
        }
      });
  }

  ngOnInit(): void {
    this._title.setTitle('GRASS | Galería de canchas');
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

  fileChangeEvent(event: any): void {
    const input = event.target;
    const file = event.target.files && event.target.files[0];

    if ('files' in input && input.files.length > 0) {
      const file = input.files[0];
      this.nombreArchivo = file.name;
    }

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
        .agregar_imagen_galeria_cancha(this.id, data, this.token)
        .subscribe((response) => {
          this._toastrService.success('Se subió con éxito', 'SUBIDO!');
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
      .eliminar_imagen_galeria_cancha(this.id, { _id: id }, this.token)
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