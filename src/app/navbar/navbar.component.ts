import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  readonly lngs = [
    { value: 'ca', label: 'Català', img: 'assets/ca.png' }, 
    { value: 'es', label: 'Español', img: 'assets/es.png'}, 
    { value: 'en', label: 'English', img: 'assets/en.png' }
  ];

  public lng = this.lngs[0];

  ngOnInit(): void {
  }

}
