import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  valor_cookie: any;

  constructor(public app: AppComponent, private route: Router, public _location: Location) { }

  readonly lngs = [
    { value: 'ca', label: 'Català', img: 'assets/ca.png' },
    { value: 'es', label: 'Español', img: 'assets/es.png' },
    { value: 'en', label: 'English', img: 'assets/en.png' }
  ];

  public lng = this.lngs[0];

  ngOnInit(): void {
    this.valor_cookie = this.app.getCookie();
    console.log("Valor cookie: " + this.valor_cookie);
  }

  signOut() {
    this.app.removeCookie();
    window.location.reload();
  }

}
