import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  valor_cookie: any;

  readonly lngs = [
    { value: 'es', label: 'Español', img: 'assets/es.png' },
    { value: 'ca', label: 'Català', img: 'assets/ca.png' },
    { value: 'en', label: 'English', img: 'assets/en.png' }
  ];

  public lng = this.lngs[0];

  constructor(public app: AppComponent, private route: Router, public _location: Location, public translate: TranslateService) {
    translate.addLangs(['en', 'es', 'ca']);
    translate.setDefaultLang('es');
   }

  switchLang(lang: any) {
    console.log(lang.value);
    this.translate.use(lang.value);
  }

  ngOnInit(): void {
    this.valor_cookie = this.app.getCookie();
    console.log("Valor cookie: " + this.valor_cookie);
  }

  signOut() {
    this.app.removeCookie();
    this.route.navigate(['/home'])
      .then(() => {
        window.location.reload();
      });
  }

}
