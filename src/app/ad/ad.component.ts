import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

import { IAnuncio } from '../interfaces/ianuncio';
import { ITipo } from '../interfaces/itipo';
import { IMunicipio } from '../interfaces/imunicipio';
import { IProvincia } from '../interfaces/iprovincia';
import { IGeneral } from '../interfaces/igeneral';

import { DataAnunciosService } from '../services/data-anuncios.service';

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.css']
})
export class AdComponent implements OnInit {

  apiUrl: string = environment.apiUrl;
  errorMessage: string = "";

  anuncio?: IAnuncio;

  constructor(private anuncioService: DataAnunciosService, private route: Router) { }

  ngOnInit(): void {
    // this.anuncioService.getAnuncio(anuncio.id).subscribe((anuncio: IAnuncio) => {
    //   anuncio.anuncio = anuncio;
    // });
  }

}
