import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { IGeneral } from '../interfaces/igeneral';
import { UploadService } from '../services/upload.service';
import { UsuariosService } from '../services/usuarios.service';

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

  constructor(private formBuilder: FormBuilder, private usuariosService: UsuariosService, private route: Router, private app: AppComponent, private _uploadService: UploadService) {
    this.editProfileForm = this.createForm();
  }

  ngOnInit(): void {
    if (!this.app.getCookie()) this.route.navigate(['login']);

    this.valor_cookie = this.app.getCookie();
    this.getDatosUsuarios(this.valor_cookie);
    //document.getElementById("imgperfil")?.setAttribute("src", this.usuario.imagen.replace("%2F", "/"));

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
      this.subscribeEditInfo();
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
      this.subscribeEditInfo();
    });

  }

  subscribeEditInfo() {

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
    } else if(this.url != ""){
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

}
