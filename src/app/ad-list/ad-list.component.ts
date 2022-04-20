import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

import { IAnuncio } from '../interfaces/ianuncio';
import { DataAnunciosService } from '../services/data-anuncios.service';
import { ITipo } from '../interfaces/itipo';
import { IMunicipio } from '../interfaces/imunicipio';
import { IProvincia } from '../interfaces/iprovincia';
import { IGeneral } from '../interfaces/igeneral';

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

  // Filter form
  selected = 'option2';

  constructor(private anuncioService: DataAnunciosService, private route: Router) { }

  ngOnInit(): void {
    this.anuncioService.getData().subscribe((anuncios: Array<IAnuncio>) => {
      for (const anuncio of anuncios) {
        // Get Tipo Anuncio
        this.anuncioService.getTipoAnuncio(anuncio.id).subscribe((tipo: ITipo) => {
          anuncio.tipo = tipo;  
        });
        // Get Municipio Anuncio
        this.anuncioService.getMunicipioAnuncio(anuncio.id).subscribe((municipio: IMunicipio) => {
          anuncio.municipio = municipio;
        });
        // Get Provincia Anuncio
        this.anuncioService.getProvinciaAnuncio(anuncio.id).subscribe((provincia: IGeneral) => {
          anuncio.provincia = provincia;  
        });
        // Get Vendedor Anuncio
        this.anuncioService.getVendedorAnuncio(anuncio.id).subscribe((vendedor: IGeneral) => {
          anuncio.vendedor = vendedor;  
        });
      }
      this.anuncios = anuncios;
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
