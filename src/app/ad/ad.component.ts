import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

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
  id = Number(this.aroute.snapshot.params['id']);

  anuncio!: IAnuncio;
  vendedor!: IGeneral;

  constructor(private anuncioService: DataAnunciosService, private route: Router, private aroute:ActivatedRoute) { }

  ngOnInit(): void {
    this.anuncioService.getAnuncio(this.id).subscribe((anuncio: IAnuncio) => {
      // Get Vendedor Anuncio
      this.anuncioService.getVendedorAnuncio(anuncio.id).subscribe((vendedor: IGeneral) => {
        anuncio.vendedor = vendedor;
        this.vendedor = vendedor;
      });
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

      this.anuncio = anuncio;
    });
  }

}
