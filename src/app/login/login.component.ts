import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AppComponent } from '../app.component';
import { IUsuario } from '../interfaces/iusuario';
import { UsuariosService } from '../services/usuarios.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: any;
  sitekey: any;
  usuArray: any = [];

  @ViewChild("myNameElem")
  myNameElem!: ElementRef;

  constructor(private formBuilder: FormBuilder, private usuariosService: UsuariosService, private route: Router, private app: AppComponent, public location: Location) {
    this.loginForm = this.createForm();
  }

  createForm() {
    return this.formBuilder.group({
      nickname: [null, [Validators.required]],
      password: [null, [Validators.required]],
      recaptcha: [null, [Validators.required]]
    }
    );
  }

  ngOnInit(): void {
    this.usuariosService.getUsuarios().subscribe((data: any) => {
      data.forEach((element: any) => {
        this.usuArray.push(element);
      });
    }, (error) => {
      this.errorMessage = error.message; // treurem l'error a html
    });

    this.sitekey = environment.recaptcha.siteKey;

  }

  onSubmit() {

    if (!this.loginForm.valid) {
      return;
    }

    const formData = new FormData();

    var nickname = this.loginForm.get('nickname');
    var password = this.loginForm.get('password');

    if (nickname) formData.append("nickname", nickname.value);
    if (password) formData.append("password", password.value);

    for (let i = 0; i < this.usuArray.length; i++) {
      const elem = this.usuArray[i];
      if (nickname?.value == elem.nickname && password?.value == elem.password) {
        this.usuariosService.verificarAdmin(elem.id).subscribe((data: any) => {
          if (data) {
            this.app.saveAdmin("admin");
          } else {
            this.app.saveCookie(elem.id);
          }
        }, (error) => {
          this.errorMessage = error.message; // treurem l'error a html
        });

        this.route.navigate(['/home'])
          .then(() => {
            window.location.reload();
          });
      } else {
        this.myNameElem.nativeElement.classList.remove("no-visible");
      }
    }
  }

  noValid(nControl: string): boolean {
    let cc = this.loginForm.get(nControl);
    if (!cc) return true;
    return (!cc.valid &&
      cc.touched);
  }

  getErrorMessage(nControl: string): string {
    const ctl = this.loginForm.get(nControl);
    if (!ctl) return 'Control Erroni';
    let str = '';
    switch (nControl) {
      case 'nickname':
        str = ctl.hasError('required') ? 'Field is required' : '';
        break;
      case 'password':
        str = ctl.hasError('required') ? 'Field is required' : '';
        break;
      case 'recaptcha':
        str = ctl.hasError('required') ? 'Field is required' : '';
        break;
      default:
        str = 'Control invalid';
    };

    return str;
  }

}
