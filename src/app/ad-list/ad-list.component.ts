import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { IAnuncio } from '../interfaces/ianuncio';
import { DataAnunciosService } from '../services/data-anuncios.service';
import { PageEvent } from '@angular/material/paginator';


@Component({
  selector: 'app-ad-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.css']
})
export class AdListComponent implements OnInit {

  apiUrl: string = environment.apiUrl;
  errorMessage: string = "";

  anuncios: IAnuncio[] = [];
  pageAnuncios: IAnuncio[] = [];

  constructor(private anuncioService: DataAnunciosService, private route: Router) { }

  ngOnInit(): void {
    console.log("Anuncios:");
    this.anuncioService.getData().subscribe((anuncios: Array<IAnuncio>) => {
      this.anuncios = anuncios;
      console.log(anuncios);
      this.pageAnuncios = anuncios.slice(0, 10);
    }, (error) => {
      this.errorMessage = error.message;
    });
  }

  OnPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize

    if (endIndex > this.anuncios.length) {
      endIndex = this.anuncios.length;
    }

    this.pageAnuncios = this.anuncios.slice(startIndex, endIndex);
  }

}
