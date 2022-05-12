import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps'

import { IAnuncio } from '../interfaces/ianuncio';
import { ITipo } from '../interfaces/itipo';
import { IMunicipio } from '../interfaces/imunicipio';
import { IProvincia } from '../interfaces/iprovincia';
import { IGeneral } from '../interfaces/igeneral';
import { IMap } from '../interfaces/imap';

import { DataAnunciosService } from '../services/data-anuncios.service';
import { DataMapService } from '../services/data-map.service';
import { AppComponent } from '../app.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ad',
  templateUrl: './ad.component.html',
  styleUrls: ['./ad.component.css']
})
export class AdComponent implements OnInit {

  apiUrl: string = environment.apiUrl;
  errorMessage: string = "";
  msgContacto: string = "";
  id = Number(this.aroute.snapshot.params['id']);

  anuncio?: IAnuncio;
  vendedor?: IGeneral;

  // Maps
  map!: IMap;
  errorMessageMap: string = "";

  latLng!: google.maps.LatLngLiteral;
  label = "";

  marker!: google.maps.MarkerOptions;

  constructor(private anuncioService: DataAnunciosService, private mapService: DataMapService, private route: Router, private aroute: ActivatedRoute,
    private app: AppComponent, private _snackBar: MatSnackBar) { }

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
      this.anuncioService.getProvinciaAnuncio(anuncio.id).subscribe((provincia: IProvincia) => {
        anuncio.provincia = provincia;
      });

      // Maps
      this.mapService.getMap(anuncio).subscribe((map: IMap) => {
        this.latLng = {
          lat: map.data[0].latitude,
          lng: map.data[0].longitude,
        };
        this.label = map.data[0].label;
        this.map = map;
      }, (error) => {
        this.errorMessageMap = error.message;
      });

      this.anuncio = anuncio;
    }, (error) => {
      this.errorMessage = error.message;
    });

  }

  contactarVendedor() {
    if (!this.app.getCookie()) {
      let sb = this._snackBar.open("Debes de iniciar sesión.", "Login", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });

      sb.onAction().subscribe(() => {
        this.route.navigate(['login']);
      });

      return false;
    }

    if (this.msgContacto.length > 0) {
      const dataContacto: Object = { msg: this.msgContacto, idComprador: this.app.getCookie(), idAnuncio: this.anuncio?.id, url: window.location.href };
      this.anuncioService.contactarVendedor(dataContacto).subscribe({
        error: (error) => { this.errorMessage = error.message; }
      });

      this._snackBar.open("Mensaje enviado.", "Cerrar", {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    }
    return true;
  }

  tipoTrans(tipo: any) {
    switch (tipo) {
      case "Piso": return "adlist.floor";
      case "Casa": return "adlist.house";
      case "Alquiler": return "adlist.rent";
      case "Venta": return "adlist.sale";
      default: return "";
    }
  }

  phoneSeparator(numb: number) {
    var str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return str.join(".");
  }

}
