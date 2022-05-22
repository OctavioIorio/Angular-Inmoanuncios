import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../app.component';
import { IRegister } from '../interfaces/iregister';
import { UploadService } from '../services/upload.service';
import { UsuariosService } from '../services/usuarios.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  hide = true;
  registros: IRegister[] = [];
  registerForm: FormGroup;
  missatge = '';
  match = false;
  errorMessage: string = "Error de proba";
  pattern_password = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,16}$/;
  pattern_telefono = "^([+]?\d{1,2}[-\s]?|)[9|6|7][0-9]{8}$";
  errorPassword: string = "La contraseña debe tener al menos entre 8 y 16 caracteres, al menos un dígito, al menos una minúscula y al menos una mayúscula. NO puede tener otros símbolos";
  imagen_valor: any;
  info: any = new Object;

  constructor(private formBuilder: FormBuilder, private usuariosService: UsuariosService, private route: Router, private app: AppComponent, private _uploadService: UploadService, private _snackBar: MatSnackBar, private translate: TranslateService) {
    this.registerForm = this.createForm();
  }
  //^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{8,16})\S$
  createForm() {
    return this.formBuilder.group({
      nickname: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.pattern(this.pattern_password)]],
      cpassword: [null, [Validators.required]],
      nombre: [null, [Validators.required]],
      apellidos: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      telefono: [null, [Validators.required, Validators.pattern(this.pattern_telefono)]],
      imagen: [null],
      terminos: [false, Validators.requiredTrue]
    });
  }

  samePassword() {
    const password = this.registerForm.get('password')?.value;
    const cpassword = this.registerForm.get('cpassword')?.value;

    if (password === cpassword) {
      document.getElementById("cpassword")?.setAttribute("class", "border border-success form-control");
      this.registerForm.invalid;
      this.match = true;
    } else {
      document.getElementById("cpassword")?.setAttribute("class", "border border-danger form-control");
      document.getElementById("boton-inmo")?.setAttribute("disabled", "");
      this.match = false;
    }
  }

  ngOnInit(): void {
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imagen_valor = file;
      this.registerForm.get('imagen')?.setValue(file);
    }
  }

  onUpload() {

    const data = new FormData();
    data.append('file', this.imagen_valor);
    data.append('upload_preset', 'inmoanuncios_cloudinary');
    data.append('cloud_name', 'inmoanuncios');

    this._uploadService.uploadImage(data).subscribe(res => {
      this.info = res;
      this.subscribeCreateUser();
    });
  }

  onSubmit() {

    if (!this.registerForm.valid && this.match === false) {
      document.getElementById("boton-inmo")?.setAttribute("disabled", "");
      return;
    }

    if (this.imagen_valor) {
      this.onUpload();
    } else {
      this.subscribeCreateUser();
    }

  }

  subscribeCreateUser() {

    var url_upload = this.info.secure_url;

    const formData = new FormData();

    var nickname = this.registerForm.get('nickname');
    var password = this.registerForm.get('password');
    var nombre = this.registerForm.get('nombre');
    var apellidos = this.registerForm.get('apellidos');
    var email = this.registerForm.get('email');
    var telefono = this.registerForm.get('telefono');
    var imagen = this.registerForm.get('imagen');

    if (nickname) formData.append("nickname", nickname.value);
    if (password) formData.append("password", btoa(password.value));
    if (nombre) formData.append("nombre", nombre.value);
    if (apellidos) formData.append("apellidos", apellidos.value);
    if (email) formData.append("email", email.value);
    if (telefono) formData.append("telefono", telefono.value);
    if (imagen?.value instanceof File) {
      formData.append("imagen", url_upload.replace(/\//gm, "%2F"));
    } else {
      formData.append("imagen", "https://res.cloudinary.com/inmoanuncios/image/upload/v1651686755/perfil_inmoanuncios_cloudinary/sinfotoperfil_iryooh.png");
    }

    this.missatge = `Usuari inserit correctament`;
    this.registerForm.reset();
    this.usuariosService.postUsuario(formData).subscribe({
      next: (x) => {
        this.route.navigate(['/login'])
      .then(() => {
        this.notificacionUsuarioRegistrado();
      });
      },
      error: (error) => {
        console.error(error.message);
      }
    });
  }

  noValid(nControl: string): boolean {
    let cc = this.registerForm.get(nControl);
    if (!cc) return true;
    return (!cc.valid &&
      cc.touched);
  }

  getErrorMessage(nControl: string): string {
    const ctl = this.registerForm.get(nControl);

    if (!ctl) return 'Control Erroni';
    let str = '';
    switch (nControl) {
      case 'nickname':
        str = ctl.hasError('required') ? 'form.errorRequired' : '';
        break;
      case 'password':
        str = ctl.hasError('required') ? 'form.errorRequired' :
          ctl.hasError('pattern') ? 'form.errorPassword' : '';
        break;
      case 'cpassword':
        str = ctl.hasError('required') ? 'form.errorRequired' :
          this.match === false ? 'form.errorCPassword' : '';
        break;
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
      case 'terminos':
        str = ctl.hasError('required') ? 'Debes aceptar los terminos' : '';
        break;
      default:
        str = 'Control invalid';
    };

    return str;
  }

  notificacionUsuarioRegistrado() {
    this._snackBar.open(this.translate.instant('loginDialogo.usuRegistrado'), this.translate.instant('adminDialogo.cerrar'), {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom'
    });
  }

}
