import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';

import { IAnuncio } from '../interfaces/ianuncio';
import { ITipo } from '../interfaces/itipo';
import { IMunicipio } from '../interfaces/imunicipio';
import { IProvincia } from '../interfaces/iprovincia';
import { IGeneral } from '../interfaces/igeneral';

import { DataAnunciosService } from '../services/data-anuncios.service';
import { DataTiposService } from '../services/data-tipos.service';

@Component({
  selector: 'app-ad-list',
  templateUrl: './ad-list.component.html',
  styleUrls: ['./ad-list.component.css']
})
export class AdListComponent implements OnInit {
  apiUrl: string = environment.apiUrl;
  errorMessage: string = "";
  mun_id = Number(this.aroute.snapshot.params['mun_id']);

  anuncios: IAnuncio[] = [];
  pageAnuncios: IAnuncio[] = [];
  tipos: ITipo[] = [];
  tratos: string[] = ['Alquiler', 'Venta'];

  // Filter anuncios
  tipoSelected: number = 0;
  referencia: string = "";
  precioMin: number = 0;
  precioMax: number = 0;
  areaMin: number = 0;
  areaMax: number = 0;
  tratoSelected: string = "";
  habitaciones: number = 0;

  constructor(private anuncioService: DataAnunciosService, private tipoService: DataTiposService, private route: Router, private aroute: ActivatedRoute) { }

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
        anuncio.descripcion = this.ellipsisDesc(anuncio.descripcion);
      }
      this.anuncios = anuncios.filter(anuncio => anuncio.municipio_id === this.mun_id);
      this.pageAnuncios = anuncios.filter(anuncio => anuncio.municipio_id === this.mun_id).slice(0, 10);
    }, (error) => {
      this.errorMessage = error.message;
    });

    this.tipoService.getData().subscribe((tipos: Array<ITipo>) => {
      this.tipos = tipos;
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

  ellipsisDesc(desc: string) {
    if (desc.length > 150) {
      return desc.substring(0, 150) + '...';
    }
    return desc;
  };

}
