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
  cookieLang = '';

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

  saveAdmin(value:any){
    this.cookieService.set('admin', value);
  }

  getAdmin(){
    this.cookieValue = this.cookieService.get('admin');
    return this.cookieValue;
  }

  removeAdmin() {
    this.cookieService.delete('admin');
  }

}
