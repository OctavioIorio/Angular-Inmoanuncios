import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IGeneral } from '../interfaces/igeneral';
import { UploadService } from '../services/upload.service';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-dialog-edit-profile',
  templateUrl: './dialog-edit-profile.component.html',
  styleUrls: ['./dialog-edit-profile.component.css']
})
export class DialogEditProfileComponent implements OnInit {

  numid: string = "";
  editProfileForm: FormGroup;
  url: string = "";
  pattern_telefono = "^([+]?\d{1,2}[-\s]?|)[9|6|7][0-9]{8}$";
  imagen_valor: any;
  info:any = new Object;
  missatge: string | undefined;
  errorMessage: any;
  usuario: any;

  constructor(private formBuilder: FormBuilder, private usuariosService: UsuariosService, private route: Router, private _uploadService: UploadService, public dialogRef: MatDialogRef<DialogEditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }, private _snackBar: MatSnackBar, private translate: TranslateService) {
      this.editProfileForm = this.createForm();
  }

  ngOnInit(): void {
    this.numid = `Numero de la id de usuario para editar: ${this.data.id}`;
    this.getDatosUsuarios(this.data.id);
  }

  getDatosUsuarios(id: number) {
    this.usuariosService.getUsuarioGenConcreto(id).subscribe((usuarioGen: IGeneral) => {
      this.usuario = usuarioGen;
      document.getElementById("imgdialog")?.setAttribute("src", usuarioGen.imagen.replace(/%2F/gm, "/"));
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

  createForm() {
    return this.formBuilder.group({
      nombre: [null, [Validators.required]],
      apellidos: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      telefono: [null, [Validators.required, Validators.pattern(this.pattern_telefono)]],
      imagen: [null]
    });
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imagen_valor = file;
      this.editProfileForm.get('imagen')?.setValue(file);
      this.onUpload();
    }
  }

  onUpload() {

    const data = new FormData();
    data.append('file', this.imagen_valor);
    data.append('upload_preset', 'inmoanuncios_cloudinary');
    data.append('cloud_name', 'inmoanuncios');

    this._uploadService.uploadImage(data).subscribe(res => {
      this.info = res;
      this.subscribeEditInfo();
    });

  }

  selecImagen() {
    document.getElementById("verimagen")?.setAttribute("class", "w-sm-100 w-md-75 mx-auto mb-xs-3 mb-md-0");
  }

  borrarImagen() {
    document.getElementById("imgdialog")?.setAttribute("src", "https://res.cloudinary.com/inmoanuncios/image/upload/v1651686755/perfil_inmoanuncios_cloudinary/sinfotoperfil_iryooh.png");
    this.url = "https://res.cloudinary.com/inmoanuncios/image/upload/v1651686755/perfil_inmoanuncios_cloudinary/sinfotoperfil_iryooh.png";
    document.getElementById("boton-inmo")?.removeAttribute("disabled");
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

  onSubmit() {
    if (!this.editProfileForm.valid) {
      return;
    }

    if (this.imagen_valor) {
      this.onUpload();
    } else {
      this.subscribeEditInfo();
    }

  }

  subscribeEditInfo() {

    var url_upload = this.info.secure_url;

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

    this.missatge = `Usuari modificat correctament`;
    this.editProfileForm.reset();
    this.usuariosService.editUsuarioGenConcreto(this.data.id, formData).subscribe({
      next: (x) => {
        this.dialogRef.close(true);
        this.openSnackBar();
      },
      error: (error) => {
        console.log(error.message);
      }
    });

  }

  openSnackBar() {
    this._snackBar.open(this.translate.instant('adminDialogo.editadoUsuario'), this.translate.instant('adminDialogo.cerrar'), {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

}
