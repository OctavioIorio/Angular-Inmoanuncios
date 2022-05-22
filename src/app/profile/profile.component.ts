import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { IAnuncio } from '../interfaces/ianuncio';
import { IFavorito } from '../interfaces/ifavorito';
import { IGeneral } from '../interfaces/igeneral';
import { UploadService } from '../services/upload.service';
import { UsuariosService } from '../services/usuarios.service';
import { DataAnunciosService } from '../services/data-anuncios.service';
import { IMunicipio } from '../interfaces/imunicipio';
import { IProvincia } from '../interfaces/iprovincia';
import { ITipo } from '../interfaces/itipo';
import { IAnuncioImagen } from '../interfaces/ianuncioimagen';
import { MatDialog } from '@angular/material/dialog';
import { AdEditComponent } from '../ad-edit/ad-edit.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  editProfileForm: FormGroup;
  pattern_telefono = "^([+]?\d{1,2}[-\s]?|)[9|6|7][0-9]{8}$";
  errorMessage: any;
  usuario: any = null;
  valor_cookie: any;
  missatge: any;
  imagen_valor: any;
  url: any;
  info: any = new Object;
  favoritos: IFavorito[] = [];
  anuncios: IAnuncio[] = [];

  constructor(private formBuilder: FormBuilder, private usuariosService: UsuariosService, private route: Router, private app: AppComponent,
    private _uploadService: UploadService, private anuncioService: DataAnunciosService, public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.editProfileForm = this.createForm();
  }

  ngOnInit(): void {
    if (!this.app.getCookie()) this.route.navigate(['login']);

    this.valor_cookie = this.app.getCookie();
    this.getDatosUsuarios(this.valor_cookie);

    this.getFavs();

    this.getAnuncios();
  }

  getDatosUsuarios(id: number) {
    this.usuariosService.getUsuarioGenConcreto(id).subscribe((usuarioGen: IGeneral) => {
      this.usuario = usuarioGen;
      document.getElementById("imgperfil")?.setAttribute("src", usuarioGen.imagen.replace(/%2F/gm, "/"));
      this.actualizaForm(usuarioGen);
    }, (error) => {
      this.errorMessage = error.message;
    });
  }

  actualizaForm(usuario: any) {
    this.editProfileForm.setValue({
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      email: usuario.email,
      telefono: usuario.telefono,
      imagen: usuario.imagen
    });
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imagen_valor = file;
      console.log(file);
      console.log("INFO: " + this.imagen_valor);
      this.editProfileForm.get('imagen')?.setValue(file);
      this.onUpload();
    }
  }

  createForm() {
    return this.formBuilder.group({
      nombre: [null, [Validators.required]],
      apellidos: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      telefono: [null, [Validators.required, Validators.pattern(this.pattern_telefono)]],
      imagen: [null]
    });
  }

  onSubmit() {

    if (!this.editProfileForm.valid) {
      return;
    }

    if (this.imagen_valor) {
      console.log("Se ejecuta onupload");
      this.onUpload();
    } else {
      this.restainfo();
    }

  }

  onUpload() {

    const data = new FormData();
    data.append('file', this.imagen_valor);
    data.append('upload_preset', 'inmoanuncios_cloudinary');
    data.append('cloud_name', 'inmoanuncios');

    this._uploadService.uploadImage(data).subscribe(res => {
      this.info = res;
      console.log(this.info);
      this.restainfo();
    });
  }

  restainfo() {


    var url_upload = this.info.secure_url;
    console.log(url_upload);

    const formData = new FormData();

    var nombre = this.editProfileForm.get('nombre');
    var apellidos = this.editProfileForm.get('apellidos');
    var email = this.editProfileForm.get('email');
    var telefono = this.editProfileForm.get('telefono');
    var imagen = this.editProfileForm.get('imagen');

    if (nombre) formData.append("nombre", nombre.value);
    if (apellidos) formData.append("apellidos", apellidos.value);
    if (email) formData.append("email", email.value);
    if (telefono) formData.append("telefono", telefono.value);

    if (imagen?.value instanceof File) {
      formData.append("imagen", url_upload.replace(/\//gm, "%2F"));
    } else if (this.url != "") {
      formData.append("imagen", this.url);
    } else {
      formData.append("imagen", imagen?.value);
    }

    formData.forEach((value, key) => {
      console.log(key + " " + value)
    });

    this.missatge = `Usuari modificat correctament`;
    this.editProfileForm.reset();
    this.usuariosService.editUsuarioGenConcreto(this.valor_cookie, formData).subscribe({
      next: (x) => {
        alert(this.missatge);
        window.location.reload();
      },
      error: (error) => {
        console.log(error.message);
      }
    });

  }

  noValid(nControl: string): boolean {
    let cc = this.editProfileForm.get(nControl);
    if (!cc) return true;
    return (!cc.valid &&
      cc.touched);
  }

  getErrorMessage(nControl: string): string {
    const ctl = this.editProfileForm.get(nControl);

    if (!ctl) return 'Control Erroni';
    let str = '';
    switch (nControl) {
      case 'nombre':
        str = ctl.hasError('required') ? 'form.errorRequired' : '';
        break;
      case 'apellidos':
        str = ctl.hasError('required') ? 'form.errorRequired' : '';
        break;
      case 'email':
        str = ctl.hasError('required') ? 'form.errorRequired' :
          ctl.hasError('email') ? 'form.errorEmail' : '';
        break;
      case 'telefono':
        str = ctl.hasError('required') ? 'form.errorRequired' :
          ctl.hasError('pattern') ? 'form.errorPhoneFormat' : '';
        break;
      case 'imagen':
        break;
      default:
        str = 'Control invalid';
    };
    return str;
  }

  selecImagen() {
    document.getElementById("verimagen")?.setAttribute("class", "w-sm-100 w-md-75 mx-auto mb-xs-3 mb-md-0");
  }

  borrarImagen() {
    document.getElementById("imgperfil")?.setAttribute("src", "https://res.cloudinary.com/inmoanuncios/image/upload/v1651686755/perfil_inmoanuncios_cloudinary/sinfotoperfil_iryooh.png");
    this.url = "https://res.cloudinary.com/inmoanuncios/image/upload/v1651686755/perfil_inmoanuncios_cloudinary/sinfotoperfil_iryooh.png";
    document.getElementById("boton-inmo")?.removeAttribute("disabled");
  }

  tipoTrans(tipo: any) {
    switch (tipo) {
      case "Piso": return "adlist.floor";
      case "Casa": return "adlist.house";
      case "Alquiler": return "adlist.rent";
      case "Venta": return "adlist.sale";
      default: return "";
    }
  }

  openDialogEdit(ad: IAnuncio): void {
    const dialogRef = this.dialog.open(AdEditComponent, {
      width: '1080px',
      data: { anuncio: ad },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getAnuncios();
    });
  }

  getFavs() {
    this.usuariosService.getFavoritos().subscribe((favoritos: IFavorito[]) => {
      favoritos = favoritos.filter(fav => fav.usuario_id === parseInt(this.app.getCookie()));
      for (const favorito of favoritos) {
        // Get Usuario Favorito
        this.usuariosService.getUsuarioFavorito(favorito.id).subscribe((usuario: IGeneral) => {
          favorito.usuario = usuario;
        });
        // Get Anuncio Favorito
        this.usuariosService.getAnuncioFavorito(favorito.id).subscribe((anuncio: IAnuncio) => {
          // Get Imagen Anuncio
          this.anuncioService.getImagenesAnuncio(anuncio.id).subscribe((imgs: IAnuncioImagen[]) => {
            if (imgs.length > 0) anuncio.imagen = imgs[0].imagen.replace(/%2F/gm, "/");;
          });
          // Get Municipio Anuncio
          this.anuncioService.getMunicipioAnuncio(anuncio.id).subscribe((municipio: IMunicipio) => {
            anuncio.municipio = municipio;
          });
          // Get Provincia Anuncio
          this.anuncioService.getProvinciaAnuncio(anuncio.id).subscribe((provincia: IProvincia) => {
            anuncio.provincia = provincia;
          });
          // Get Tipo Anuncio
          this.anuncioService.getTipoAnuncio(anuncio.id).subscribe((tipo: ITipo) => {
            anuncio.tipo = tipo;
          });
          favorito.anuncio = anuncio;
        });
      }

      this.favoritos = favoritos;
    });
  }

  getAnuncios() {
    this.anuncioService.getData().subscribe((anuncios: IAnuncio[]) => {
      anuncios = anuncios.filter(anuncio => anuncio.vendedor_id === parseInt(this.app.getCookie()));
      for (const anuncio of anuncios) {
        // Get Imagen Anuncio
        this.anuncioService.getImagenesAnuncio(anuncio.id).subscribe((imgs: IAnuncioImagen[]) => {
          if (imgs.length > 0) anuncio.imagen = imgs[0].imagen.replace(/%2F/gm, "/");;
        });
        // Get Tipo Anuncio
        this.anuncioService.getTipoAnuncio(anuncio.id).subscribe((tipo: ITipo) => {
          anuncio.tipo = tipo;
        });
        // Get Municipio Anuncio
        this.anuncioService.getMunicipioAnuncio(anuncio.id).subscribe((municipio: IMunicipio) => {
          anuncio.municipio = municipio;
        });
        // Get Provincia Anuncio
        this.anuncioService.getProvinciaAnuncio(anuncio.id).subscribe((provincia: IGeneral) => {
          anuncio.provincia = provincia;
        });
        // Get Vendedor Anuncio
        this.anuncioService.getVendedorAnuncio(anuncio.id).subscribe((vendedor: IGeneral) => {
          anuncio.vendedor = vendedor;
        });
      }

      this.anuncios = anuncios;
    });
  }

  openDialogDeleteAd() {

  }

  deleteAnuncio(id: number) {
    this.anuncioService.deleteAnuncio(id).subscribe(() => {
      this.getAnuncios();
      this._snackBar.open("Anuncio eliminado", "Cerrar", {
        duration: 5000,
        horizontalPosition: 'left',
        verticalPosition: 'bottom'
      });
    });
  }

  deleteFav(id: number) {
    this.usuariosService.deleteFavorito(id).subscribe(() => {
      this.getFavs();
      this._snackBar.open("Favorito eliminado", "Cerrar", {
        duration: 5000,
        horizontalPosition: 'left',
        verticalPosition: 'bottom'
      });
    });
  }

  scrollFavRight() {
    document.getElementById('listFav')!.scrollLeft += 275;
  }

  scrollFavLeft() {
    document.getElementById('listFav')!.scrollLeft -= 275;
  }

  scrollAdRight() {
    document.getElementById('listAd')!.scrollLeft += 275;
  }

  scrollAdLeft() {
    document.getElementById('listAd')!.scrollLeft -= 275;
  }

}
