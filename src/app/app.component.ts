import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Inmoanuncios';
  cookieValue = '';

  constructor(public cookieService: CookieService) {
  }

  saveCookie(value:any) {
    this.cookieService.set('user', value);
  }

  getCookie(){
    this.cookieValue = this.cookieService.get('user');
    return this.cookieValue;
  }

  removeCookie() {
    this.cookieService.delete('user');
  }

}
