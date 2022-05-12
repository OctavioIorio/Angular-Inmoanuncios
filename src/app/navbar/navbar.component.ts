import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../app.component';
import { AdFormComponent } from '../ad-form/ad-form.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IGeneral } from '../interfaces/igeneral';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  valor_cookie: any;
  info: any;
  errorMessage: any;
  name: any;

  readonly lngs = [
    { value: 'es', label: 'Español', img: 'assets/es.png' },
    { value: 'ca', label: 'Català', img: 'assets/ca.png' },
    { value: 'en', label: 'English', img: 'assets/en.png' }
  ];

  public lng = this.lngs[0];


  constructor(public app: AppComponent, private route: Router, public _location: Location, public translate: TranslateService, private usuariosService: UsuariosService, public dialog: MatDialog) {
    translate.addLangs(['en', 'es', 'ca']);
    translate.setDefaultLang('es');
  }

  switchLang(lang: any) {
    this.translate.use(lang.value);
  }

  ngOnInit(): void {
    this.valor_cookie = this.app.getCookie();
    console.log("Valor cookie: " + this.valor_cookie);
    this.getDatosUsuarios(this.valor_cookie);
  }

  getDatosUsuarios(id: number) {
    this.usuariosService.getUsuarioGenConcreto(id).subscribe((usuarioGen: IGeneral) => {
      this.info = usuarioGen;
      this.name = usuarioGen.nombre;
      console.log(this.info);
    }, (error) => {
      this.errorMessage = error.message;
    });
  }

  signOut() {
    this.app.removeCookie();
    this.route.navigate(['/home'])
      .then(() => {
        window.location.reload();
      });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AdFormComponent, {
      width: '1080px',
      data: { user: this.app.getCookie() },
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   // this.animal = result;
    // });
  }

}
